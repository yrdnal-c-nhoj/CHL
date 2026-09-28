// Rain-with-text canvas simulation for 26-09-29.
//
// This is a faithful, strict-TypeScript port of the original `script.js`.
// It owns the <canvas> 2D render loop (`requestAnimationFrame`) and all
// `performance.now()` bookkeeping, so that the displayed clock time is derived
// solely from the shared `useClock` hook in `Clock.tsx` (docs/CLOCKS.md).
//
// The render loop only renders; it never computes clock time itself. The text
// rendered into the mask comes from `RainOptions.text`, which `Clock.tsx`
// derives from the shared `useClock` hook and writes to `optionsRef.current`
// every frame via `getOptions()`.

type Rgb = { r: number; g: number; b: number };

/** Options read from the React shell every frame via `getOptions`. */
export interface RainOptions {
  text: string;
  fontSize: number;
  pxSize: number;
  dither: boolean;
  bgColor: string;
  rainColor: string;
  fontName: string;
  fontHref: string | null;
  fontWeight: number;
  reducedMotion: boolean;
}

export interface RainEngine {
  destroy: () => void;
  resize: () => void;
  rebuildMask: () => void;
}

// === Config ==============================================================
const TARGET_FPS: number | null = 120; // set to null to disable frame cap

// Rain + physics
const RAIN_DENSITY = 0.0003; // drops per pixel
const RAIN_DIR = Math.PI * 0.4; // TL -> BR
const RAIN_SPEED_MIN = 6;
const RAIN_SPEED_MAX = 70;
const TRAIL = 6.5;

// Splashes / drips
const SPLASH_SPEED = 3.6;
const SPLASH_GRAVITY = 0.3;
const SPLASH_FRICTION = 0.98;
const SPLASH_PER_HIT_MIN = 4;
const SPLASH_PER_HIT_MAX = 10;
const DRIP_SPAWN_THRESHOLD = 3.0;
const DRIP_SPAWN_CHANCE = 0.0075;
const DRIP_GRAVITY = 0.6;

// Pools (on top ledges)
const POOL_ADD_PER_HIT = 2;
const POOL_DECAY = 0.96;
const POOL_FLOW = 0.3;
const POOL_VIS_MIN = 0.1;
const POOL_VIS_SCALE = 0.45;
const SLOPE_FLOW_BOOST = 10;
const SLOPE_DRIP_BONUS = 100;

// Floor (ground) under the text
const GROUND_ENABLED = true;
const GROUND_GAP_EM = 1;
const GROUND_THICK_EM = 0.25;
const GROUND_MIN_THICK = 12; // px @ DPR=1

// Decorative edge splashes
const EDGE_FAKE_RATE = 20;
const EDGE_SPLASH_COUNT_MIN = 2;
const EDGE_SPLASH_COUNT_MAX = 3;
const EDGE_SPLASH_SPEED = 0.2;
const EDGE_SPLASH_SPREAD = Math.PI * 0.9;
const EDGE_POOL_ADD_TOP = 0.1;
const GROUND_FAKE_WEIGHT = 0.0; // lower = fewer ground fakes
const GROUND_FAKE_COOLDOWN = 100000;

// Motion reduction when prefers-reduced-motion is active.
const REDUCED_DENSITY_SCALE = 0.2;

// Bayer 8x8 ordered-dither matrix
const BAYER8 = new Uint8Array([
  0, 48, 12, 60, 3, 51, 15, 63, 32, 16, 44, 28, 35, 19, 47, 31,
  8, 56, 4, 52, 11, 59, 7, 55, 40, 24, 36, 20, 43, 27, 39, 23,
  2, 50, 14, 62, 1, 49, 13, 61, 34, 18, 46, 30, 33, 17, 45, 29,
  10, 58, 6, 54, 9, 57, 5, 53, 42, 26, 38, 22, 41, 25, 37, 21,
]);

const DEFAULT_STACK = `"Montserrat","Poppins","Inter",system-ui,sans-serif`;

// Track injected Google Font stylesheets across engine lifecycles.
const loadedFontSheets = new Set<string>();

// === Color helpers =======================================================
function lum8(r: number, g: number, b: number): number {
  return (r * 77 + g * 150 + b * 29) >>> 8;
}
function hexToRgb(hex: string): Rgb {
  let h = (hex || '#fff').replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbaStr(rgb: Rgb, a = 1): string {
  return `rgba(${rgb.r | 0},${rgb.g | 0},${rgb.b | 0},${a})`;
}
function randItem<T>(arr: T[]): T | undefined {
  return arr.length ? arr[(Math.random() * arr.length) | 0] : undefined;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}
interface Splash extends Particle {
  life: number;
}
interface Drip extends Particle {
  life: number;
}

// Read a typed-array slot as a definite number. Under `noUncheckedIndexedAccess`
// typed-array reads are `number | undefined`; every read here uses an in-range
// index, so the cast is safe and zero-cost at runtime.
function num(arr: { [k: number]: number }, i: number): number {
  return arr[i] as number;
}

export function createRainEngine(
  canvas: HTMLCanvasElement,
  getOptions: () => RainOptions,
  onFps?: (fps: number) => void,
): RainEngine {
  function noop(): void {
    /* no-op — canvas 2D context unavailable */
  }

  // === DOM / Canvas ======================================================
  const rawCtx = canvas.getContext('2d', { alpha: false });
  const fx = document.createElement('canvas');
  const rawFxC = fx.getContext('2d', {
    alpha: false,
    willReadFrequently: true,
  });
  const textCanvas = document.createElement('canvas');
  const rawTctx = textCanvas.getContext('2d');
  if (!rawCtx || !rawFxC || !rawTctx) {
    return {
      destroy: noop,
      resize: noop,
      rebuildMask: noop,
    };
  }
  const ctx: CanvasRenderingContext2D = rawCtx;
  const fxc: CanvasRenderingContext2D = rawFxC;
  const tctx: CanvasRenderingContext2D = rawTctx;

  // === State =============================================================
  let W = 0;
  let H = 0;
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let RAIN_COUNT = 0;
  let gTopY = -1;
  let gLeftX = 0;
  let gRightX = -1; // floor extents

  // Mask + edges (allocated in rebuildTextMask)
  let maskData: Uint8ClampedArray = new Uint8ClampedArray(0);
  let ledgeFlags: Uint8Array = new Uint8Array(0);
  let pool: Float32Array = new Float32Array(0);
  let slideNeighbor: Int32Array = new Int32Array(0);
  let slopeDown: Uint8Array = new Uint8Array(0);
  let ledgeIndices: number[] = [];
  let edgeTopText: number[] = [];
  let edgeTopGround: number[] = [];
  let edgeBottom: number[] = [];
  let edgeLeft: number[] = [];
  let edgeRight: number[] = [];
  let edgeEmitAcc = 0;

  // Particles
  const rain: Particle[] = [];
  const splashes: Splash[] = [];
  const drips: Drip[] = [];

  // === Colors / Dither ===================================================
  let BG_COLOR = '#000000';
  let RAIN_COLOR = '#ffffff';
  let BG_RGB: Rgb = hexToRgb(BG_COLOR);
  let RAIN_RGB: Rgb = hexToRgb(RAIN_COLOR);

  // Precompute dither constants
  let DR = 0;
  let DG = 0;
  let DB = 0;
  let DEN = 1;
  let USE_PROJ = true;
  let PACKED_FG = 0;
  let PACKED_BG = 0;
  let BG_LUM = 0;
  let FG_LUM = 255;
  let MID_LUM = 128;
  const thrProjLUT = new Uint32Array(64); // DEN*(2*bayer+1)
  const thrLumLUT = new Uint16Array(64); // midpoint + bayer stride

  // Cached keys so we only rebuild when something actually changes.
  let lastColorKey = '';
  let lastFontKey = '';
  let lastSizeKey = 0;
  let lastTextKey = '';
  let lastReducedMotion = false;

  // Downhill neighbor offsets
  const OFF: Array<[number, number]> = [
    [1, 1],
    [1, 0],
    [0, 1],
    [2, 1],
    [2, 0],
    [-1, 1],
  ];

  function rebuildDitherConstants(): void {
    DR = (RAIN_RGB.r - BG_RGB.r) | 0;
    DG = (RAIN_RGB.g - BG_RGB.g) | 0;
    DB = (RAIN_RGB.b - BG_RGB.b) | 0;
    DEN = DR * DR + DG * DG + DB * DB;

    // prepack RGBA (little-endian)
    PACKED_FG = (255 << 24) | (RAIN_RGB.b << 16) | (RAIN_RGB.g << 8) | RAIN_RGB.r;
    PACKED_BG = (255 << 24) | (BG_RGB.b << 16) | (BG_RGB.g << 8) | BG_RGB.r;

    BG_LUM = lum8(BG_RGB.r, BG_RGB.g, BG_RGB.b);
    FG_LUM = lum8(RAIN_RGB.r, RAIN_RGB.g, RAIN_RGB.b);
    MID_LUM = (BG_LUM + FG_LUM) >> 1;

    USE_PROJ = DEN >= 32; // fallback to luma when too similar

    if (USE_PROJ) {
      for (let i = 0; i < 64; i++) {
        thrProjLUT[i] = DEN * (num(BAYER8, i) * 2 + 1);
      }
    } else {
      for (let i = 0; i < 64; i++) {
        thrLumLUT[i] = Math.max(
          0,
          Math.min(
            255,
            (MID_LUM + (num(BAYER8, i) + 0.5) * (255 / 64)) | 0,
          ),
        );
      }
    }
  }
  function updateColors(): void {
    BG_RGB = hexToRgb(BG_COLOR);
    RAIN_RGB = hexToRgb(RAIN_COLOR);
    rebuildDitherConstants();
  }

  // === Fonts =============================================================
  function fontSpec(px: number): string {
    const opts = getOptions();
    const family =
      opts.fontName === 'system'
        ? DEFAULT_STACK
        : `"${opts.fontName}",system-ui,sans-serif`;
    return `${opts.fontWeight} ${px}px ${family}`;
  }

  function applyFont(): Promise<void> {
    const opts = getOptions();
    const href = opts.fontHref;
    if (href && !loadedFontSheets.has(href)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      loadedFontSheets.add(href);
    }
    const px = Math.floor(opts.fontSize * dpr);
    const spec = fontSpec(px);
    const loadP = document.fonts.load(spec);
    return loadP.then(
      () => {
        rebuildTextMask();
      },
      () => {
        rebuildTextMask();
      },
    );
  }

  // === Resize / Mask build =================================================
  function resize(): void {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = window.innerWidth;
    const h = window.innerHeight;
    W = Math.floor(w * dpr);
    H = Math.floor(h * dpr);
    canvas.width = W;
    canvas.height = H;
    textCanvas.width = W;
    textCanvas.height = H;
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const opts = getOptions();
    const scale = opts.reducedMotion ? REDUCED_DENSITY_SCALE : 1;
    RAIN_COUNT = Math.max(500, Math.floor((W * H * RAIN_DENSITY) * scale));
    rebuildTextMask();
    spawnInitialRain();
  }

  function rebuildTextMask(): void {
    if (W === 0 || H === 0) return;
    const opts = getOptions();
    lastTextKey = opts.text;
    lastSizeKey = opts.fontSize;
    lastFontKey = opts.fontName + '|' + opts.fontWeight;
    lastColorKey = opts.bgColor + '|' + opts.rainColor;

    tctx.clearRect(0, 0, W, H);

    // text
    const fontPx = Math.floor(opts.fontSize * dpr);
    const text = opts.text || 'RAIN';
    tctx.fillStyle = '#fff';
    tctx.textBaseline = 'middle';
    tctx.textAlign = 'center';
    tctx.font = fontSpec(fontPx);
    const maxWidth = W * 0.82;
    const m = tctx.measureText(text);
    const scale = Math.min(1, maxWidth / Math.max(1, m.width));
    tctx.save();
    tctx.translate(W / 2, H / 2);
    tctx.scale(scale, 1);
    tctx.fillText(text, 0, 0);
    tctx.restore();

    // floor (always thick)
    gTopY = -1;
    gLeftX = 0;
    gRightX = -1;
    if (GROUND_ENABLED) {
      const m2 = tctx.measureText(text);
      const baselineY = H / 2;
      const descent =
        (m2.actualBoundingBoxDescent || opts.fontSize * 0.2) * dpr;
      const textBottom = baselineY + descent;
      const gapPx = Math.round(opts.fontSize * GROUND_GAP_EM * dpr);
      const thickPx = Math.max(
        Math.round(GROUND_MIN_THICK * dpr),
        Math.round(opts.fontSize * GROUND_THICK_EM * dpr),
      );
      const gTop = Math.min(
        H - thickPx - 1,
        Math.max(0, textBottom + gapPx),
      );
      tctx.fillRect(0, gTop | 0, W, thickPx);
      gTopY = gTop | 0;
      gLeftX = 0;
      gRightX = W - 1;
    }

    // scan
    const img = tctx.getImageData(0, 0, W, H);
    maskData = img.data;

    ledgeFlags = new Uint8Array(W * H);
    pool = new Float32Array(W * H);
    slideNeighbor = new Int32Array(W * H);
    slideNeighbor.fill(-1);
    slopeDown = new Uint8Array(W * H);
    ledgeIndices = [];
    edgeTopText = [];
    edgeTopGround = [];
    edgeBottom = [];
    edgeLeft = [];
    edgeRight = [];
    edgeEmitAcc = 0;

    const isSolid = (x: number, y: number): boolean => {
      if (x < 0 || y < 0 || x >= W || y >= H) return false;
      return num(maskData, ((y * W + x) << 2) + 3) > 127;
    };

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (!isSolid(x, y)) continue;
        const idx = y * W + x;
        if (!isSolid(x, y - 1)) {
          ledgeFlags[idx] = 1;
          ledgeIndices.push(idx);
          if (
            gTopY >= 0 &&
            y === gTopY &&
            x >= gLeftX &&
            x <= gRightX
          ) {
            edgeTopGround.push(idx);
          } else {
            edgeTopText.push(idx);
          }
        }
        if (!isSolid(x, y + 1)) edgeBottom.push(idx);
        if (!isSolid(x - 1, y)) edgeLeft.push(idx);
        if (!isSolid(x + 1, y)) edgeRight.push(idx);
      }
    }

    // downhill/contour neighbor (prefer (1,1) > (1,0) > (0,1) > (2,1) > (2,0) > (-1,1))
    for (let i = 0; i < ledgeIndices.length; i++) {
      const idx = ledgeIndices[i];
      if (idx === undefined) continue;
      const y = (idx / W) | 0;
      const x = idx - y * W;
      let best = -1;
      let bestScore = -1e9;
      let drop = 0;
      for (const off of OFF) {
        const [dx, dy] = off;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const nidx = ny * W + nx;
        if (!num(ledgeFlags, nidx)) continue;
        const d = ny - y;
        const score = d * 10 + (dx > 0 ? 1 : 0) - Math.abs(dx) * 0.2;
        if (score > bestScore) {
          bestScore = score;
          best = nidx;
          drop = d;
        }
      }
      slideNeighbor[idx] = best;
      slopeDown[idx] = drop & 3;
    }
  }

  // === Collision helpers =====================================================
  function isSolidAt(x: number, y: number): boolean {
    const xi = x | 0;
    const yi = y | 0;
    if (xi < 0 || yi < 0 || xi >= W || yi >= H) return false;
    return num(maskData, ((yi * W + xi) << 2) + 3) > 127;
  }
  function isLedgeIdx(idx: number): boolean {
    return num(ledgeFlags, idx) === 1;
  }
  function nearestTopSurfaceIndex(x: number, y: number): number {
    const xi = Math.max(0, Math.min(W - 1, x | 0));
    let yi = Math.max(0, Math.min(H - 1, y | 0));
    if (!isSolidAt(xi, yi)) {
      while (yi < H && !isSolidAt(xi, yi)) yi++;
      yi = Math.min(H - 1, yi);
    }
    while (yi >= 0 && isSolidAt(xi, yi)) yi--;
    yi = Math.min(H - 1, yi + 1);
    const idx = yi * W + xi;
    return isLedgeIdx(idx) ? idx : -1;
  }

  // === Particles =============================================================
  function spawnAtEntry(p: Particle): void {
    const dx = Math.cos(RAIN_DIR);
    const dy = Math.sin(RAIN_DIR);
    const mx = Math.max(40, (W * 0.25) | 0);
    const my = Math.max(40, (H * 0.25) | 0);
    const e1 = dx > 0 ? 'left' : 'right';
    const e2 = dy > 0 ? 'top' : 'bottom';
    const len = (edge: string): number =>
      edge === 'top' || edge === 'bottom' ? W + 2 * mx : H + 2 * my;
    const p1 = len(e1);
    const p2 = len(e2);
    const e = Math.random() < p1 / (p1 + p2) ? e1 : e2;
    switch (e) {
      case 'top':
        p.x = Math.random() * (W + 2 * mx) - mx;
        p.y = -my - Math.random() * my;
        break;
      case 'bottom':
        p.x = Math.random() * (W + 2 * mx) - mx;
        p.y = H + my + Math.random() * my;
        break;
      case 'left':
        p.x = -mx - Math.random() * mx;
        p.y = Math.random() * (H + 2 * my) - my;
        break;
      case 'right':
        p.x = W + mx + Math.random() * mx;
        p.y = Math.random() * (H + 2 * my) - my;
        break;
    }
    const s =
      RAIN_SPEED_MIN + Math.random() * (RAIN_SPEED_MAX - RAIN_SPEED_MIN);
    p.vx = dx * s;
    p.vy = dy * s;
  }
  function spawnInitialRain(): void {
    rain.length = 0;
    for (let i = 0; i < RAIN_COUNT; i++) {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0 };
      spawnAtEntry(p);
      rain.push(p);
    }
    splashes.length = 0;
    drips.length = 0;
  }
  function respawnDrop(p: Particle): void {
    spawnAtEntry(p);
  }

  function spawnSplashes(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const ang =
        -Math.PI / 2 + (Math.random() * Math.PI * 0.6 - Math.PI * 0.3);
      const sp = SPLASH_SPEED * (0.7 + Math.random() * 0.6);
      splashes.push({
        x,
        y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        life: 1.0,
      });
    }
  }
  function spawnSplashesDirected(
    x: number,
    y: number,
    normalAngle: number,
    count: number,
    baseSpeed: number,
    spread: number,
  ): void {
    for (let i = 0; i < count; i++) {
      const ang = normalAngle + (Math.random() * spread - spread * 0.5);
      const sp = baseSpeed * (0.7 + Math.random() * 0.6);
      splashes.push({
        x,
        y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        life: 0.8 + Math.random() * 0.4,
      });
    }
  }
  function spawnDripFromIndex(idx: number): void {
    const y = (idx / W) | 0;
    const x = idx - y * W;
    drips.push({
      x: x + Math.random() * 0.8 - 0.4,
      y: y - 0.6,
      vx: 0,
      vy: Math.random() * 0.5,
      life: 1.0,
    });
  }

  // Decorative edge events
  let _lastGroundFakeAt = -1;
  function spawnFakeEdgeEvent(): void {
    const ltText = edgeTopText.length;
    const ltGround = edgeTopGround.length;
    const lb = edgeBottom.length;
    const ll = edgeLeft.length;
    const lr = edgeRight.length;
    const ltWeighted = ltText + ltGround * GROUND_FAKE_WEIGHT;
    const total = ltWeighted + lb + ll + lr;
    if (total <= 0) return;

    let r = Math.random() * total;
    let arr: number[] | null = null;
    let angle = 0;
    if ((r -= ltWeighted) < 0) {
      if (ltWeighted <= 0) return;
      let rr = Math.random() * ltWeighted;
      if ((rr -= ltText) < 0 || ltGround === 0) {
        arr = edgeTopText;
        angle = -Math.PI / 2;
      } else {
        if (GROUND_FAKE_COOLDOWN > 0) {
          const now = performance.now();
          if (
            _lastGroundFakeAt >= 0 &&
            now - _lastGroundFakeAt < GROUND_FAKE_COOLDOWN
          ) {
            return;
          }
          _lastGroundFakeAt = now;
        }
        arr = edgeTopGround;
        angle = -Math.PI / 2;
      }
    } else if ((r -= lb) < 0) {
      arr = edgeBottom;
      angle = Math.PI / 2;
    } else if ((r -= ll) < 0) {
      arr = edgeLeft;
      angle = Math.PI;
    } else {
      arr = edgeRight;
      angle = 0;
    }

    if (!arr || arr.length === 0) return;
    const idx = randItem(arr);
    if (idx === undefined) return;
    const y = (idx / W) | 0;
    const x = idx - y * W;

    // Don't emit from hidden area under the floor
    if (GROUND_ENABLED && gTopY >= 0 && y > gTopY) return;

    const off = 0.9;
    const sx = x + Math.cos(angle) * off;
    const sy = y + Math.sin(angle) * off;
    const cnt =
      EDGE_SPLASH_COUNT_MIN +
      (Math.random() * (EDGE_SPLASH_COUNT_MAX - EDGE_SPLASH_COUNT_MIN + 1) | 0);
    spawnSplashesDirected(
      sx,
      sy,
      angle,
      cnt,
      EDGE_SPLASH_SPEED,
      EDGE_SPLASH_SPREAD,
    );
    if (num(ledgeFlags, idx) === 1) {
      pool[idx] = num(pool, idx) + EDGE_POOL_ADD_TOP;
    }
  }

  // === Post-process (pixelate + ordered dither) ============================
  let _lastPostW = 0;
  let _lastPostH = 0;
  function applyPostProcess(): void {
    const opts = getOptions();
    const pixelSize = opts.pxSize ? Math.max(1, opts.pxSize) : 1;
    const useDither = opts.dither;
    if (pixelSize <= 1 && !useDither) return;

    const postW = Math.max(1, (W / pixelSize) | 0);
    const postH = Math.max(1, (H / pixelSize) | 0);
    if (postW !== _lastPostW || postH !== _lastPostH) {
      fx.width = postW;
      fx.height = postH;
      _lastPostW = postW;
      _lastPostH = postH;
    }

    fxc.imageSmoothingEnabled = true;
    fxc.drawImage(canvas, 0, 0, postW, postH);

    if (useDither) {
      const img = fxc.getImageData(0, 0, postW, postH);
      const data = img.data;
      const u32 = new Uint32Array(data.buffer);
      let p = 0;
      if (USE_PROJ) {
        for (let y = 0; y < postH; y++) {
          const y8 = (y & 7) << 3;
          for (let x = 0; x < postW; x++, p += 4) {
            const r = num(data, p);
            const g = num(data, p + 1);
            const b = num(data, p + 2);
            const num_ =
              ((r - BG_RGB.r) * DR + (g - BG_RGB.g) * DG + (b - BG_RGB.b) * DB) |
              0;
            const thr = num(thrProjLUT, y8 | (x & 7));
            u32[p >> 2] = num_ << 7 > thr ? PACKED_FG : PACKED_BG;
          }
        }
      } else {
        for (let y = 0; y < postH; y++) {
          const y8 = (y & 7) << 3;
          for (let x = 0; x < postW; x++, p += 4) {
            const lum = lum8(num(data, p), num(data, p + 1), num(data, p + 2));
            const thr = num(thrLumLUT, y8 | (x & 7));
            u32[p >> 2] = lum > thr ? PACKED_FG : PACKED_BG;
          }
        }
      }
      fxc.putImageData(img, 0, 0);
    }

    const prevSmooth = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(fx, 0, 0, postW, postH, 0, 0, W, H);
    ctx.imageSmoothingEnabled = prevSmooth;
  }

  // === Render clip (hide anything below floor) ==============================
  function beginFloorClip(): boolean {
    if (GROUND_ENABLED && gTopY >= 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, gTopY);
      ctx.clip();
      return true;
    }
    return false;
  }
  function endFloorClip(did: boolean): void {
    if (did) ctx.restore();
  }

  // === Sync options from React shell ========================================
  function syncOptions(): RainOptions {
    const opts = getOptions();

    BG_COLOR = opts.bgColor;
    RAIN_COLOR = opts.rainColor;
    const colorKey = opts.bgColor + '|' + opts.rainColor;
    if (colorKey !== lastColorKey) {
      lastColorKey = colorKey;
      updateColors();
    }

    const fontKey = opts.fontName + '|' + opts.fontWeight;
    const textKey = opts.text;
    const sizeKey = opts.fontSize;
    if (fontKey !== lastFontKey) {
      // Font changed: (re)load the font sheet, then rebuild the mask.
      lastFontKey = fontKey;
      lastTextKey = textKey;
      lastSizeKey = sizeKey;
      applyFont();
    } else if (textKey !== lastTextKey || sizeKey !== lastSizeKey) {
      lastTextKey = textKey;
      lastSizeKey = sizeKey;
      rebuildTextMask();
    }

    if (opts.reducedMotion !== lastReducedMotion) {
      lastReducedMotion = opts.reducedMotion;
      resize();
    }

    return opts;
  }

  // === Main loop / FPS ======================================================
  let frameId = 0;
  let lastFrameTime = 0;
  let lastT = performance.now();
  const FRAME_INTERVAL = TARGET_FPS ? 1000 / TARGET_FPS : 0;
  let fpsSamples: number[] = [];
  let lastFpsUpdate = performance.now();

  function updateFps(now: number): void {
    if (!onFps) return;
    fpsSamples.push(now);
    fpsSamples = fpsSamples.filter((t) => now - t < 1000);
    if (now - lastFpsUpdate > 250) {
      onFps(fpsSamples.length);
      lastFpsUpdate = now;
    }
  }

  function frame(t: number): void {
    if (TARGET_FPS && t - lastFrameTime < FRAME_INTERVAL) {
      frameId = requestAnimationFrame(frame);
      return;
    }
    lastFrameTime = t;
    const opts = syncOptions();
    const dt = Math.min(33, t - lastT) / 16.67;
    lastT = t;

    // background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, W, H);

    // clip above floor
    const clipped = beginFloorClip();

    const rm = opts.reducedMotion ? REDUCED_DENSITY_SCALE : 1;

    // rain
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgbaStr(RAIN_RGB, 0.55);
    ctx.beginPath();
    for (const p of rain) {
      const nx = p.x + p.vx * dt;
      const ny = p.y + p.vy * dt;
      if (isSolidAt(nx, ny)) {
        const hx = p.x + p.vx * dt * 0.4;
        const hy = p.y + p.vy * dt * 0.4;
        const sIdx = nearestTopSurfaceIndex(hx, hy);
        if (sIdx !== -1) {
          pool[sIdx] = num(pool, sIdx) + POOL_ADD_PER_HIT * rm;
        }
        const cnt =
          SPLASH_PER_HIT_MIN +
          (Math.random() * (SPLASH_PER_HIT_MAX - SPLASH_PER_HIT_MIN + 1) | 0);
        spawnSplashes(hx, hy, cnt);
        respawnDrop(p);
      } else {
        ctx.moveTo(p.x - p.vx * TRAIL, p.y - p.vy * TRAIL);
        ctx.lineTo(p.x, p.y);
        p.x = nx;
        p.y = ny;
        if (p.x > W + 20 || p.y > H + 20) respawnDrop(p);
      }
    }
    ctx.stroke();

    // splashes
    ctx.strokeStyle = rgbaStr(RAIN_RGB, 0.7);
    ctx.beginPath();
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      if (!s) continue;
      s.vy += SPLASH_GRAVITY * dt;
      s.vx *= Math.pow(SPLASH_FRICTION, dt);
      s.vy *= Math.pow(SPLASH_FRICTION, dt);
      const px = s.x;
      const py = s.y;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life -= 0.02 * dt;
      ctx.moveTo(px, py);
      ctx.lineTo(s.x, s.y);
      if (s.life <= 0 || isSolidAt(s.x, s.y)) {
        if (!isSolidAt(px, py)) {
          const idx = nearestTopSurfaceIndex(s.x, s.y);
          if (idx !== -1) pool[idx] = num(pool, idx) + 0.2 * rm;
        }
        splashes.splice(i, 1);
      }
    }
    ctx.stroke();

    // decorative edge hits
    if (!opts.reducedMotion) {
      edgeEmitAcc += EDGE_FAKE_RATE * dt;
      while (edgeEmitAcc >= 1) {
        spawnFakeEdgeEvent();
        edgeEmitAcc -= 1;
      }
    }

    // pools (evaporate, slide, drip)
    for (let i = 0; i < ledgeIndices.length; i++) {
      const idx = ledgeIndices[i];
      if (idx === undefined) continue;
      const base = num(pool, idx);
      if (base <= 0.0001) {
        pool[idx] = 0;
        continue;
      }
      let v = base * Math.pow(POOL_DECAY, dt);

      const sn = num(slideNeighbor, idx);
      if (sn !== -1) {
        const drop = num(slopeDown, idx);
        const flow = Math.min(
          v * 0.9,
          v * (1 - Math.pow(1 - POOL_FLOW, dt)) * (1 + SLOPE_FLOW_BOOST * drop),
        );
        v -= flow;
        pool[sn] = num(pool, sn) + flow;

        if (
          v > DRIP_SPAWN_THRESHOLD &&
          Math.random() < (DRIP_SPAWN_CHANCE + drop * SLOPE_DRIP_BONUS) * dt
        ) {
          if (!opts.reducedMotion) spawnDripFromIndex(idx);
          v = Math.max(0, v - 0.8);
        }
      } else if (
        v > DRIP_SPAWN_THRESHOLD &&
        Math.random() < DRIP_SPAWN_CHANCE * dt
      ) {
        if (!opts.reducedMotion) spawnDripFromIndex(idx);
        v = Math.max(0, v - 0.8);
      }
      pool[idx] = v;
    }

    // pool highlights
    ctx.strokeStyle = rgbaStr(RAIN_RGB, 1);
    ctx.beginPath();
    for (let i = 0; i < ledgeIndices.length; i++) {
      const idx = ledgeIndices[i];
      if (idx === undefined) continue;
      const v = num(pool, idx);
      if (v > POOL_VIS_MIN) {
        const y = (idx / W) | 0;
        const x = idx - y * W;
        const a = Math.min(1, (v - POOL_VIS_MIN) * POOL_VIS_SCALE);
        if (v > 1.6 || Math.random() < 0.6) {
          ctx.strokeStyle = rgbaStr(RAIN_RGB, a);
          ctx.moveTo(x - 0.5, y - 0.6);
          ctx.lineTo(x + 0.8, y - 0.6);
        }
      }
    }
    ctx.stroke();

    // drips
    if (!opts.reducedMotion) {
      ctx.strokeStyle = rgbaStr(RAIN_RGB, 0.85);
      ctx.beginPath();
      for (let i = drips.length - 1; i >= 0; i--) {
        const d = drips[i];
        if (!d) continue;
        const px = d.x;
        const py = d.y;
        d.vy += DRIP_GRAVITY * dt;
        d.y += d.vy * dt;
        ctx.moveTo(px, py);
        ctx.lineTo(d.x, d.y);
        const by = d.y + 0.75;
        if (by >= 0 && by < H && isSolidAt(d.x, by)) {
          const sIdx = nearestTopSurfaceIndex(d.x, by);
          if (sIdx !== -1) {
            pool[sIdx] = num(pool, sIdx) + 1.5;
          }
          drips.splice(i, 1);
          continue;
        }
        if (d.y > H + 10) drips.splice(i, 1);
      }
      ctx.stroke();
    }

    // end clip
    endFloorClip(clipped);

    // FX + FPS
    applyPostProcess();
    updateFps(t);
    frameId = requestAnimationFrame(frame);
  }

  // === Events / Boot ========================================================
  const onResize = (): void => {
    resize();
  };
  window.addEventListener('resize', onResize, { passive: true });

  // Build the initial mask + particles so the first frame is correct.
  resize();
  frameId = requestAnimationFrame(frame);

  function destroy(): void {
    cancelAnimationFrame(frameId);
    window.removeEventListener('resize', onResize);
    fpsSamples = [];
  }

  return {
    destroy,
    resize,
    rebuildMask: () => {
      rebuildTextMask();
    },
  };
}

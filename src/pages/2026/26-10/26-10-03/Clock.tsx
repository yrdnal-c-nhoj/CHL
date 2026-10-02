import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

/* ==========================================================================
 * Clock_26_10_03
 * Full-screen dithered rain that pools / drips / splashes on a digital clock.
 * No UI controls. Displayed time comes from the shared useClock hook; the
 * requestAnimationFrame loop below only renders frames.
 * ========================================================================== */

// --- Fixed former HUD values -----------------------------------------------
const FONT_SIZE = 300;
const FONT_WEIGHT = 700;
const FONT_FAMILY_NAME = 'Cormorant';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant:wght@400;700&display=swap';
const PIXEL_SIZE = 2;
const DITHER = true;
const BG_COLOR = '#082244';
const RAIN_COLOR = '#cbede6';

const SHOW_SECONDS = false;

const TARGET_FPS = 120;

// Uniform + left-biased rain settings
const RAIN_DENSITY = 0.00035;
const RAIN_DIR = Math.PI * 0.4;
const RAIN_SPEED_MIN = 28;
const RAIN_SPEED_MAX = 42;
const TRAIL = 5.5;

const SPLASH_SPEED = 3.6;
const SPLASH_GRAVITY = 0.3;
const SPLASH_FRICTION = 0.98;
const SPLASH_PER_HIT_MIN = 4;
const SPLASH_PER_HIT_MAX = 10;
const DRIP_SPAWN_THRESHOLD = 5.0;
const DRIP_SPAWN_CHANCE = 0.0075;
const DRIP_GRAVITY = 0.6;

const POOL_PER_RAIN_HIT = 196;
const POOL_PER_SPLASH = 0.5;
const POOL_DECAY = 0.985;
const POOL_FLOW = 0.12;
const POOL_VIS_MIN = 0.05;
const POOL_VIS_SCALE = 0.9;
const POOL_LINE_WIDTH = 2;
const SLOPE_FLOW_BOOST = 4;
const SLOPE_DRIP_BONUS = 40;

const GROUND_GAP_EM = 1;
const GROUND_THICK_EM = 0.25;
const GROUND_MIN_THICK = 12;

const EDGE_FAKE_RATE = 20;
const EDGE_SPLASH_COUNT_MIN = 2;
const EDGE_SPLASH_COUNT_MAX = 3;
const EDGE_SPLASH_SPEED = 0.2;
const EDGE_SPLASH_SPREAD = Math.PI * 0.9;
const EDGE_POOL_ADD_TOP = 0.3;
const GROUND_FAKE_WEIGHT = 0.0;
const GROUND_FAKE_COOLDOWN = 100000;

// prettier-ignore
const BAYER8 = [
  0,48,12,60, 3,51,15,63, 32,16,44,28,35,19,47,31,
  8,56, 4,52,11,59, 7,55, 40,24,36,20,43,27,39,23,
  2,50,14,62, 1,49,13,61, 34,18,46,30,33,17,45,29,
 10,58, 6,54, 9,57, 5,53, 42,26,38,22,41,25,37,21,
];

// --- Types ------------------------------------------------------------------
interface RGB {
  r: number;
  g: number;
  b: number;
}
interface Drop {
  x: number;
  y: number;
  vx: number;
  vy: number;
}
interface Splash {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}
interface Drip {
  x: number;
  y: number;
  vy: number;
  life: number;
}

// --- Helpers ----------------------------------------------------------------
const lum8 = (r: number, g: number, b: number) =>
  (r * 77 + g * 150 + b * 29) >>> 8;

const hexToRgb = (hex: string): RGB => {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgbaStr = (rgb: RGB, a = 1) =>
  `rgba(${rgb.r | 0},${rgb.g | 0},${rgb.b | 0},${a})`;

const pad = (n: number) => String(n).padStart(2, '0');
const formatTime = (time: Date) => {
  const base = `${pad(time.getHours())}:${pad(time.getMinutes())}`;
  return SHOW_SECONDS ? `${base}:${pad(time.getSeconds())}` : base;
};

const FONT_FAMILY = `"${FONT_FAMILY_NAME}",system-ui,sans-serif`;
const fontSpec = (px: number) => `${FONT_WEIGHT} ${px}px ${FONT_FAMILY}`;

// Fast removal: move the last element into slot i, then shrink (O(1))
function removeAt<T>(arr: T[], i: number) {
  const last = arr.pop();
  if (last !== undefined && i < arr.length) arr[i] = last;
}

function RainClock() {
  const time = useClock();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(time);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let cancelled = false;
    let rafId = 0;

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    // Post-FX canvas
    const fx = document.createElement('canvas');
    const fxc = fx.getContext('2d', { alpha: false, willReadFrequently: true });
    if (!fxc) return;

    // Offscreen text/mask canvas
    const textCanvas = document.createElement('canvas');
    const tctx = textCanvas.getContext('2d', { willReadFrequently: true });
    if (!tctx) return;

    // Offscreen canvas for the static (reduced-motion) frame
    const staticCanvas = document.createElement('canvas');
    const sctx = staticCanvas.getContext('2d');
    if (!sctx) return;

    // Non-null aliases (narrowing is lost inside hoisted function declarations)
    const cv: HTMLCanvasElement = canvas;
    const gfx: CanvasRenderingContext2D = ctx;
    const fxGfx: CanvasRenderingContext2D = fxc;
    const maskGfx: CanvasRenderingContext2D = tctx;
    const staticGfx: CanvasRenderingContext2D = sctx;

    // --- Reduced motion -----------------------------------------------------
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery?.matches ?? false;
    let dirty = true;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reduced = e.matches;
      dirty = true;
    };
    motionQuery?.addEventListener('change', onMotionChange);

    // --- Colors / dither constants -----------------------------------------
    const BG_RGB = hexToRgb(BG_COLOR);
    const RAIN_RGB = hexToRgb(RAIN_COLOR);
    const DR = RAIN_RGB.r - BG_RGB.r;
    const DG = RAIN_RGB.g - BG_RGB.g;
    const DB = RAIN_RGB.b - BG_RGB.b;
    const DEN = DR * DR + DG * DG + DB * DB;
    const PACKED_FG =
      (255 << 24) | (RAIN_RGB.b << 16) | (RAIN_RGB.g << 8) | RAIN_RGB.r;
    const PACKED_BG =
      (255 << 24) | (BG_RGB.b << 16) | (BG_RGB.g << 8) | BG_RGB.r;
    const MID_LUM =
      (lum8(BG_RGB.r, BG_RGB.g, BG_RGB.b) +
        lum8(RAIN_RGB.r, RAIN_RGB.g, RAIN_RGB.b)) >>
      1;
    const USE_PROJ = DEN >= 32;
    const thrProjLUT = new Uint32Array(64);
    const thrLumLUT = new Uint16Array(64);
    for (let i = 0; i < 64; i++) {
      const b = BAYER8[i] ?? 0;
      if (USE_PROJ) thrProjLUT[i] = DEN * (b * 2 + 1);
      else
        thrLumLUT[i] = Math.max(
          0,
          Math.min(255, (MID_LUM + (b + 0.5) * (255 / 64)) | 0),
        );
    }

    // Pre-built stroke styles
    const rainStroke = rgbaStr(RAIN_RGB, 0.55);
    const splashStroke = rgbaStr(RAIN_RGB, 0.7);
    const dripStroke = rgbaStr(RAIN_RGB, 0.85);

    // --- State --------------------------------------------------------------
    let W = 0;
    let H = 0;
    let RAIN_COUNT = 0;
    let gTopY = -1;
    let currentText = formatTime(timeRef.current);

    // Spawn margins (extended left so rain reaches the lower-left ground)
    let leftExtra = 200;
    let rightExtra = 100;

    let maskData: Uint8ClampedArray = new Uint8ClampedArray(0);
    let ledgeFlags = new Uint8Array(0);
    let pool = new Float32Array(0);
    let slideNeighbor = new Int32Array(0);
    let slopeDown = new Uint8Array(0);
    const ledgeIndices: number[] = [];
    const edgeTopText: number[] = [];
    const edgeTopGround: number[] = [];
    const edgeBottom: number[] = [];
    const edgeLeft: number[] = [];
    const edgeRight: number[] = [];
    let edgeEmitAcc = 0;

    const rain: Drop[] = [];
    const splashes: Splash[] = [];
    const drips: Drip[] = [];

    const addPool = (idx: number, amount: number) => {
      pool[idx] = (pool[idx] ?? 0) + amount;
    };

    // --- Collision helpers --------------------------------------------------
    const isSolidAt = (x: number, y: number) => {
      const xi = x | 0;
      const yi = y | 0;
      if (xi < 0 || yi < 0 || xi >= W || yi >= H) return false;
      return (maskData[((yi * W + xi) << 2) + 3] ?? 0) > 127;
    };

    const nearestTopSurfaceIndex = (x: number, y: number) => {
      const xi = Math.max(0, Math.min(W - 1, x | 0));
      let yi = Math.max(0, Math.min(H - 1, y | 0));
      if (!isSolidAt(xi, yi)) {
        while (yi < H && !isSolidAt(xi, yi)) yi++;
        if (yi >= H) return -1;
      }
      while (yi > 0 && isSolidAt(xi, yi - 1)) yi--;
      const idx = yi * W + xi;
      return ledgeFlags[idx] === 1 ? idx : -1;
    };

    // --- Text mask ----------------------------------------------------------
    const measureCells = () => {
      let digitW = 0;
      for (let d = 0; d <= 9; d++)
        digitW = Math.max(digitW, tctx.measureText(String(d)).width);
      const colonW = tctx.measureText(':').width;
      return { digitW, colonW };
    };

    function rebuildTextMask() {
      maskGfx.clearRect(0, 0, W, H);

      const text = currentText;
      maskGfx.fillStyle = '#fff';
      maskGfx.textBaseline = 'middle';
      maskGfx.textAlign = 'center';

      let fontPx = Math.floor(FONT_SIZE * DPR);
      maskGfx.font = fontSpec(fontPx);
      let cells = measureCells();
      const template = SHOW_SECONDS ? '88:88:88' : '88:88';
      const cellsWidth = (s: string) =>
        s
          .split('')
          .reduce((a, c) => a + (c === ':' ? cells.colonW : cells.digitW), 0);
      const maxWidth = W * 0.82;
      const tw = cellsWidth(template);
      if (tw > maxWidth) {
        fontPx = Math.max(10, Math.floor((fontPx * maxWidth) / tw));
        maskGfx.font = fontSpec(fontPx);
        cells = measureCells();
      }
      const fontCss = fontPx / DPR;

      let x = W / 2 - cellsWidth(text) / 2;
      for (const ch of text) {
        const cw = ch === ':' ? cells.colonW : cells.digitW;
        maskGfx.fillText(ch, x + cw / 2, H / 2);
        x += cw;
      }

      const descent =
        maskGfx.measureText('0').actualBoundingBoxDescent || fontCss * 0.2;
      const textBottom = H / 2 + descent;
      const gapPx = Math.round(fontCss * GROUND_GAP_EM * DPR);
      const thickPx = Math.max(
        Math.round(GROUND_MIN_THICK * DPR),
        Math.round(fontCss * GROUND_THICK_EM * DPR),
      );
      const gTop = Math.min(H - thickPx - 1, Math.max(0, textBottom + gapPx));
      maskGfx.fillRect(0, gTop | 0, W, thickPx);
      gTopY = gTop | 0;
      const gLeftX = 0;
      const gRightX = W - 1;

      maskData = maskGfx.getImageData(0, 0, W, H).data;
      ledgeFlags = new Uint8Array(W * H);
      pool = new Float32Array(W * H);
      slideNeighbor = new Int32Array(W * H).fill(-1);
      slopeDown = new Uint8Array(W * H);
      ledgeIndices.length = 0;
      edgeTopText.length = 0;
      edgeTopGround.length = 0;
      edgeBottom.length = 0;
      edgeLeft.length = 0;
      edgeRight.length = 0;

      const solid = (px: number, py: number) => {
        if (px < 0 || py < 0 || px >= W || py >= H) return false;
        return (maskData[((py * W + px) << 2) + 3] ?? 0) > 127;
      };

      for (let y = 0; y < H; y++) {
        for (let xx = 0; xx < W; xx++) {
          if (!solid(xx, y)) continue;
          const idx = y * W + xx;
          if (!solid(xx, y - 1)) {
            ledgeFlags[idx] = 1;
            ledgeIndices.push(idx);
            if (gTopY >= 0 && y === gTopY && xx >= gLeftX && xx <= gRightX)
              edgeTopGround.push(idx);
            else edgeTopText.push(idx);
          }
          if (!solid(xx, y + 1)) edgeBottom.push(idx);
          if (!solid(xx - 1, y)) edgeLeft.push(idx);
          if (!solid(xx + 1, y)) edgeRight.push(idx);
        }
      }

      const OFF: [number, number][] = [
        [1, 1],
        [1, 0],
        [0, 1],
        [2, 1],
        [2, 0],
        [-1, 1],
      ];
      for (let i = 0; i < ledgeIndices.length; i++) {
        const idx = ledgeIndices[i];
        if (idx === undefined) continue;
        const y = (idx / W) | 0;
        const xx = idx - y * W;
        let best = -1;
        let bestScore = -1e9;
        let drop = 0;
        for (let k = 0; k < OFF.length; k++) {
          const off = OFF[k];
          if (!off) continue;
          const [dx, dy] = off;
          const nx = xx + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const nidx = ny * W + nx;
          if (!ledgeFlags[nidx]) continue;
          const score = dy * 10 + (dx > 0 ? 1 : 0) - Math.abs(dx) * 0.2;
          if (score > bestScore) {
            bestScore = score;
            best = nidx;
            drop = dy;
          }
        }
        slideNeighbor[idx] = best;
        slopeDown[idx] = drop & 3;
      }
      dirty = true;
    }

    // --- Particles ----------------------------------------------------------
    // Extended left spawn so rain enters from far left and reaches lower-left ground
    function spawnAtEntry(p: Drop) {
      const dx = Math.cos(RAIN_DIR);
      const dy = Math.sin(RAIN_DIR);

      // How far a drop travels horizontally while falling the full height
      const travelX = Math.abs(dx / Math.max(0.001, dy)) * H;

      // Strong left extension so drops can still hit x≈0 at the bottom
      leftExtra = travelX * 1.6 + Math.max(160, W * 0.35);
      rightExtra = travelX * 0.35 + 80;

      const marginY = Math.max(60, H * 0.18);

      // Spawn across a wide band that starts well outside the left edge
      p.x = Math.random() * (W + leftExtra + rightExtra) - leftExtra;
      p.y = -marginY - Math.random() * marginY;

      const s =
        RAIN_SPEED_MIN + Math.random() * (RAIN_SPEED_MAX - RAIN_SPEED_MIN);
      p.vx = dx * s;
      p.vy = dy * s;
    }

    function spawnInitialRain() {
      rain.length = 0;
      for (let i = 0; i < RAIN_COUNT; i++) {
        const p: Drop = { x: 0, y: 0, vx: 0, vy: 0 };
        spawnAtEntry(p);
        rain.push(p);
      }
      splashes.length = 0;
      drips.length = 0;
    }

    function spawnSplashes(x: number, y: number, count: number) {
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
    ) {
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

    function spawnDripFromIndex(idx: number) {
      const y = (idx / W) | 0;
      const x = idx - y * W;
      drips.push({
        x: x + Math.random() * 0.8 - 0.4,
        y: y - 0.6,
        vy: Math.random() * 0.5,
        life: 1.0,
      });
    }

    let lastGroundFakeAt = -1;
    function spawnFakeEdgeEvent(now: number) {
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
            if (
              lastGroundFakeAt >= 0 &&
              now - lastGroundFakeAt < GROUND_FAKE_COOLDOWN
            )
              return;
            lastGroundFakeAt = now;
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
      const idx = arr[(Math.random() * arr.length) | 0];
      if (idx === undefined) return;
      const y = (idx / W) | 0;
      const x = idx - y * W;

      if (gTopY >= 0 && y > gTopY) return;

      const off = 0.9;
      const sx = x + Math.cos(angle) * off;
      const sy = y + Math.sin(angle) * off;
      const cnt =
        EDGE_SPLASH_COUNT_MIN +
        ((Math.random() * (EDGE_SPLASH_COUNT_MAX - EDGE_SPLASH_COUNT_MIN + 1)) |
          0);
      spawnSplashesDirected(
        sx,
        sy,
        angle,
        cnt,
        EDGE_SPLASH_SPEED,
        EDGE_SPLASH_SPREAD,
      );
      if (ledgeFlags[idx] === 1) addPool(idx, EDGE_POOL_ADD_TOP);
    }

    // --- Post-process (pixelate + ordered dither) ---------------------------
    let lastPostW = 0;
    let lastPostH = 0;
    function applyPostProcess() {
      const pixelSize = Math.max(1, PIXEL_SIZE);
      if (pixelSize <= 1 && !DITHER) return;

      const postW = Math.max(1, (W / pixelSize) | 0);
      const postH = Math.max(1, (H / pixelSize) | 0);
      if (postW !== lastPostW || postH !== lastPostH) {
        fx.width = postW;
        fx.height = postH;
        lastPostW = postW;
        lastPostH = postH;
      }

      fxGfx.imageSmoothingEnabled = true;
      fxGfx.drawImage(cv, 0, 0, postW, postH);

      if (DITHER) {
        const img = fxGfx.getImageData(0, 0, postW, postH);
        const data = img.data;
        const u32 = new Uint32Array(data.buffer);
        let p = 0;
        if (USE_PROJ) {
          for (let y = 0; y < postH; y++) {
            const y8 = (y & 7) << 3;
            for (let x = 0; x < postW; x++, p += 4) {
              const num =
                (((data[p] ?? 0) - BG_RGB.r) * DR +
                  ((data[p + 1] ?? 0) - BG_RGB.g) * DG +
                  ((data[p + 2] ?? 0) - BG_RGB.b) * DB) |
                0;
              const thr = thrProjLUT[y8 | (x & 7)] ?? 0;
              u32[p >> 2] = num << 7 > thr ? PACKED_FG : PACKED_BG;
            }
          }
        } else {
          for (let y = 0; y < postH; y++) {
            const y8 = (y & 7) << 3;
            for (let x = 0; x < postW; x++, p += 4) {
              const lum = lum8(
                data[p] ?? 0,
                data[p + 1] ?? 0,
                data[p + 2] ?? 0,
              );
              const thr = thrLumLUT[y8 | (x & 7)] ?? 0;
              u32[p >> 2] = lum > thr ? PACKED_FG : PACKED_BG;
            }
          }
        }
        fxGfx.putImageData(img, 0, 0);
      }

      const prev = gfx.imageSmoothingEnabled;
      gfx.imageSmoothingEnabled = false;
      gfx.clearRect(0, 0, W, H);
      gfx.drawImage(fx, 0, 0, postW, postH, 0, 0, W, H);
      gfx.imageSmoothingEnabled = prev;
    }

    // --- Reduced-motion frame: no rain, just the time -----------------------
    function drawStaticFrame() {
      staticGfx.globalCompositeOperation = 'copy';
      staticGfx.drawImage(textCanvas, 0, 0);
      staticGfx.globalCompositeOperation = 'source-in';
      staticGfx.fillStyle = RAIN_COLOR;
      staticGfx.fillRect(0, 0, W, H);
      staticGfx.globalCompositeOperation = 'source-over';

      gfx.fillStyle = BG_COLOR;
      gfx.fillRect(0, 0, W, H);
      gfx.drawImage(staticCanvas, 0, 0);
      applyPostProcess();
    }

    // --- Resize -------------------------------------------------------------
    function resize() {
      const w = Math.floor(cv.clientWidth * DPR);
      const h = Math.floor(cv.clientHeight * DPR);
      if (w <= 0 || h <= 0 || (w === W && h === H)) return;
      W = w;
      H = h;
      cv.width = W;
      cv.height = H;
      textCanvas.width = W;
      textCanvas.height = H;
      staticCanvas.width = W;
      staticCanvas.height = H;
      gfx.setTransform(1, 0, 0, 1, 0, 0);

      RAIN_COUNT = Math.max(500, Math.floor(W * H * RAIN_DENSITY));
      rebuildTextMask();
      spawnInitialRain();
    }

    // --- Main loop (render only; time comes from useClock) ------------------
    const FRAME_INTERVAL = TARGET_FPS ? 1000 / TARGET_FPS : 0;
    let lastFrameTime = 0;
    let lastT = 0;

    function frame(t: number) {
      if (cancelled) return;
      if (TARGET_FPS && t - lastFrameTime < FRAME_INTERVAL) {
        rafId = requestAnimationFrame(frame);
        return;
      }
      lastFrameTime = t;
      if (lastT === 0) lastT = t;
      const dt = Math.min(33, t - lastT) / 16.67;
      lastT = t;

      // Rebuild the collision mask only when the displayed text changes
      const nowText = formatTime(timeRef.current);
      if (nowText !== currentText) {
        currentText = nowText;
        rebuildTextMask();
      }

      if (W === 0 || H === 0) {
        rafId = requestAnimationFrame(frame);
        return;
      }

      // prefers-reduced-motion: draw the time once, redraw only on change
      if (reduced) {
        if (dirty) {
          drawStaticFrame();
          dirty = false;
        }
        rafId = requestAnimationFrame(frame);
        return;
      }
      dirty = false;

      gfx.fillStyle = BG_COLOR;
      gfx.fillRect(0, 0, W, H);

      const clipped = gTopY >= 0;
      if (clipped) {
        gfx.save();
        gfx.beginPath();
        gfx.rect(0, 0, W, gTopY);
        gfx.clip();
      }

      // Rain
      gfx.lineWidth = 1;
      gfx.strokeStyle = rainStroke;
      gfx.beginPath();
      for (let i = 0; i < rain.length; i++) {
        const p = rain[i];
        if (!p) continue;
        const nx = p.x + p.vx * dt;
        const ny = p.y + p.vy * dt;
        if (isSolidAt(nx, ny)) {
          const hx = p.x + p.vx * dt * 0.4;
          const hy = p.y + p.vy * dt * 0.4;
          const sIdx = nearestTopSurfaceIndex(hx, hy);
          if (sIdx !== -1) addPool(sIdx, POOL_PER_RAIN_HIT);
          const cnt =
            SPLASH_PER_HIT_MIN +
            ((Math.random() * (SPLASH_PER_HIT_MAX - SPLASH_PER_HIT_MIN + 1)) |
              0);
          spawnSplashes(hx, hy, cnt);
          spawnAtEntry(p);
        } else {
          gfx.moveTo(p.x - p.vx * TRAIL, p.y - p.vy * TRAIL);
          gfx.lineTo(p.x, p.y);
          p.x = nx;
          p.y = ny;
          // Recycle only when far outside the extended spawn volume
          if (
            p.x < -leftExtra - 80 ||
            p.x > W + rightExtra + 80 ||
            p.y > H + 60
          ) {
            spawnAtEntry(p);
          }
        }
      }
      gfx.stroke();

      // Splashes
      gfx.strokeStyle = splashStroke;
      gfx.beginPath();
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
        gfx.moveTo(px, py);
        gfx.lineTo(s.x, s.y);
        if (s.life <= 0 || isSolidAt(s.x, s.y)) {
          if (!isSolidAt(px, py)) {
            const idx = nearestTopSurfaceIndex(s.x, s.y);
            if (idx !== -1) addPool(idx, POOL_PER_SPLASH);
          }
          removeAt(splashes, i);
        }
      }
      gfx.stroke();

      // Decorative edge hits
      edgeEmitAcc += EDGE_FAKE_RATE * dt;
      while (edgeEmitAcc >= 1) {
        spawnFakeEdgeEvent(t);
        edgeEmitAcc -= 1;
      }

      // Pools
      for (let i = 0; i < ledgeIndices.length; i++) {
        const idx = ledgeIndices[i];
        if (idx === undefined) continue;
        let v = pool[idx] ?? 0;
        if (v <= 0.0001) {
          pool[idx] = 0;
          continue;
        }
        v *= Math.pow(POOL_DECAY, dt);

        const sn = slideNeighbor[idx] ?? -1;
        if (sn !== -1) {
          const drop = slopeDown[idx] ?? 0;
          const flow = Math.min(
            v * 0.9,
            v *
              (1 - Math.pow(1 - POOL_FLOW, dt)) *
              (1 + SLOPE_FLOW_BOOST * drop),
          );
          v -= flow;
          addPool(sn, flow);

          if (
            v > DRIP_SPAWN_THRESHOLD &&
            Math.random() < (DRIP_SPAWN_CHANCE + drop * SLOPE_DRIP_BONUS) * dt
          ) {
            spawnDripFromIndex(idx);
            v = Math.max(0, v - 0.8);
          }
        } else if (
          v > DRIP_SPAWN_THRESHOLD &&
          Math.random() < DRIP_SPAWN_CHANCE * dt
        ) {
          spawnDripFromIndex(idx);
          v = Math.max(0, v - 0.8);
        }
        pool[idx] = v;
      }

      // Pool highlights
      gfx.lineWidth = POOL_LINE_WIDTH;
      gfx.beginPath();
      for (let i = 0; i < ledgeIndices.length; i++) {
        const idx = ledgeIndices[i];
        if (idx === undefined) continue;
        const v = pool[idx] ?? 0;
        if (v > POOL_VIS_MIN) {
          const y = (idx / W) | 0;
          const x = idx - y * W;
          const a = Math.min(1, (v - POOL_VIS_MIN) * POOL_VIS_SCALE);
          gfx.strokeStyle = rgbaStr(RAIN_RGB, a);
          gfx.moveTo(x - 0.5, y - 1);
          gfx.lineTo(x + 0.8, y - 1);
        }
      }
      gfx.stroke();
      gfx.lineWidth = 1;

      // Drips
      gfx.strokeStyle = dripStroke;
      gfx.beginPath();
      for (let i = drips.length - 1; i >= 0; i--) {
        const d = drips[i];
        if (!d) continue;
        const px = d.x;
        const py = d.y;
        d.vy += DRIP_GRAVITY * dt;
        d.y += d.vy * dt;
        gfx.moveTo(px, py);
        gfx.lineTo(d.x, d.y);
        const by = d.y + 0.75;
        if (by >= 0 && by < H && isSolidAt(d.x, by)) {
          const sIdx = nearestTopSurfaceIndex(d.x, by);
          if (sIdx !== -1) addPool(sIdx, 1.5);
          removeAt(drips, i);
          continue;
        }
        if (d.y > H + 10) removeAt(drips, i);
      }
      gfx.stroke();

      if (clipped) gfx.restore();

      applyPostProcess();
      rafId = requestAnimationFrame(frame);
    }

    // --- Boot ---------------------------------------------------------------
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = FONT_HREF;

    document.head.append(preconnect, stylesheet);

    resize();
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => resize())
        : null;
    resizeObserver?.observe(canvas);
    if (!resizeObserver) window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(frame);

    if (document.fonts?.load) {
      document.fonts
        .load(fontSpec(Math.floor(FONT_SIZE * DPR)))
        .then(() => {
          if (!cancelled) rebuildTextMask();
        })
        .catch(() => undefined);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      motionQuery?.removeEventListener('change', onMotionChange);
      preconnect.remove();
      stylesheet.remove();
    };
  }, []);

  return (
    <main
      className={styles.container}
      style={{ '--clock-bg': BG_COLOR } as CSSProperties}
    >
      <SRTime time={time} />
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </main>
  );
}

RainClock.displayName = 'Clock_26_10_03';

export default RainClock;

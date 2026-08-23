import { useSecondClock } from "@/utils/hooks";
import React, { useEffect, useRef } from "react";
import styles from './Clock.module.css';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export const assets: string[] = [];

// ---------------------------------------------------------------------------
// Color configuration
// ---------------------------------------------------------------------------

// Background gradient: colors spread across the screen left→right.
// Add/remove/reorder entries and change hex values to customize.
// Position is 0 (left) to 1 (right).
const GRADIENT_STOPS: { position: number; color: string }[] = [
  { position: 0.0, color: '#8F3838' },
  { position: 0.33, color: '#489448' },
  { position: 0.67, color: '#4E7495' },
  { position: 1.0, color: '#774D9B' },
];

// Clock digit cells: null = auto-invert background, or provide explicit gradient
const CLOCK_GRADIENT_STOPS: { position: number; color: string }[] | null = null;

// Mask color for offscreen canvas text (determines clock shape)
const MASK_COLOR = '#ffffff';

const CONFIG = {
  /** Target column count for smaller mobile screens to keep cells readable */
  TARGET_COLS_MOBILE: 45,
  /** Target column count for desktop screens */
  TARGET_COLS_DESKTOP: 90,
  /** Diffusion / swap operations performed per animation frame */
  nbDiffByStep: 150,
} as const;

const CYCLE_TIMINGS = {
  DISPLAY: 1200,      // solid clock visible
  DISSOLVE: 2000,     // scramble
  RECONSTITUTE: 2000, // reverse scramble
} as const;

const DX = [1, 0, -1, 0] as const;
const DY = [0, 1, 0, -1] as const;

type CyclePhase = "DISPLAY" | "DISSOLVE" | "RECONSTITUTE";

interface SwapRecord {
  kx: number;
  ky: number;
  x: number;
  y: number;
}

interface SimulationState {
  gridHue: number[][];
  clockMask: boolean[][];
  xDisp: number[];
  yDisp: number[];
  nbx: number;
  nby: number;
  step: number;
  side: number;
  animFrameId: number | null;
  isInitializing: boolean;
  phase: CyclePhase;
  phaseStartTime: number;
  swapHistory: SwapRecord[];
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => Math.round(x).toString(16).padStart(2, '0'))
      .join('')
  );
}

function getGradientColor(
  stops: { position: number; color: string }[],
  t: number
): string {
  t = Math.max(0, Math.min(1, t));
  if (stops.length === 0) return '#000000';
  if (stops.length === 1) return stops[0].color;

  let i = 0;
  while (i < stops.length - 1 && stops[i + 1].position <= t) {
    i++;
  }
  if (i >= stops.length - 1) return stops[stops.length - 1].color;

  const s1 = stops[i];
  const s2 = stops[i + 1];
  const range = s2.position - s1.position;
  const f = range > 0 ? (t - s1.position) / range : 0;

  const [r1, g1, b1] = hexToRgb(s1.color);
  const [r2, g2, b2] = hexToRgb(s2.color);

  return rgbToHex(
    r1 + (r2 - r1) * f,
    g1 + (g2 - g1) * f,
    b1 + (b2 - b1) * f
  );
}

function invertColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(255 - r, 255 - g, 255 - b);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const DissolvingDiffusionClock: React.FC = () => {
  const time = useSecondClock();
  const timeRef = useRef(time);
  timeRef.current = time;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const stateRef = useRef<SimulationState>({
    gridHue: [],
    clockMask: [],
    xDisp: [],
    yDisp: [],
    nbx: 0,
    nby: 0,
    step: 10,
    side: 9,
    animFrameId: null,
    isInitializing: false,
    phase: "DISPLAY",
    phaseStartTime: Date.now(),
    swapHistory: [],
  });

  // -----------------------------------------------------------------------
  // Drawing helpers
  // -----------------------------------------------------------------------

  const drawCell = (
    ctx: CanvasRenderingContext2D,
    kx: number,
    ky: number,
    forceInverted = false
  ) => {
    const { xDisp, yDisp, gridHue, side, nbx } = stateRef.current;
    const hue = gridHue[ky]?.[kx];
    if (hue === undefined) return;

    const t = nbx > 1 ? hue / 300 : 0;

    if (forceInverted) {
      // Clock digit color: either explicit CLOCK_GRADIENT_STOPS or inverted background.
      ctx.fillStyle = CLOCK_GRADIENT_STOPS
        ? getGradientColor(CLOCK_GRADIENT_STOPS, t)
        : invertColor(getGradientColor(GRADIENT_STOPS, t));
    } else {
      // Background color: interpolated from GRADIENT_STOPS based on column position.
      ctx.fillStyle = getGradientColor(GRADIENT_STOPS, t);
    }
    ctx.fillRect(xDisp[kx], yDisp[ky], side, side);
  };

  const renderFullGrid = (ctx: CanvasRenderingContext2D) => {
    const { nbx, nby, clockMask } = stateRef.current;
    for (let ky = 0; ky < nby; ky++) {
      for (let kx = 0; kx < nbx; kx++) {
        const isClock = clockMask[ky]?.[kx] ?? false;
        drawCell(ctx, kx, ky, isClock);
      }
    }
  };

  // -----------------------------------------------------------------------
  // Diffusion primitives
  // -----------------------------------------------------------------------

  const xchg = (ctx: CanvasRenderingContext2D) => {
    const { gridHue, clockMask, nbx, nby, phase, swapHistory } = stateRef.current;
    if (nbx <= 0 || nby <= 0 || !gridHue.length) return;

    const kx = Math.floor(Math.random() * nbx);
    const ky = Math.floor(Math.random() * nby);

    let x = 0;
    let y = 0;
    do {
      const dir = Math.floor(Math.random() * 4);
      x = kx + DX[dir];
      y = ky + DY[dir];
    } while (x < 0 || x >= nbx || y < 0 || y >= nby);

    if (gridHue[ky]?.[kx] === undefined || gridHue[y]?.[x] === undefined) {
      return;
    }

    if (phase === "DISSOLVE") {
      swapHistory.push({ kx, ky, x, y });
    }

    const tempHue = gridHue[ky][kx];
    gridHue[ky][kx] = gridHue[y][x];
    gridHue[y][x] = tempHue;

    if (phase === "DISSOLVE" && clockMask[ky] && clockMask[y]) {
      const tempMask = clockMask[ky][kx];
      clockMask[ky][kx] = clockMask[y][x];
      clockMask[y][x] = tempMask;
    }

    const isClock1 = clockMask[ky]?.[kx] ?? false;
    const isClock2 = clockMask[y]?.[x] ?? false;
    drawCell(ctx, kx, ky, isClock1);
    drawCell(ctx, x, y, isClock2);
  };

  const unxchg = (ctx: CanvasRenderingContext2D) => {
    const { gridHue, clockMask, swapHistory } = stateRef.current;
    if (swapHistory.length === 0) return;

    const { kx, ky, x, y } = swapHistory.pop()!;

    if (gridHue[ky]?.[kx] === undefined || gridHue[y]?.[x] === undefined) {
      return;
    }

    const tempHue = gridHue[ky][kx];
    gridHue[ky][kx] = gridHue[y][x];
    gridHue[y][x] = tempHue;

    if (clockMask[ky] && clockMask[y]) {
      const tempMask = clockMask[ky][kx];
      clockMask[ky][kx] = clockMask[y][x];
      clockMask[y][x] = tempMask;
    }

    const isClock1 = clockMask[ky]?.[kx] ?? false;
    const isClock2 = clockMask[y]?.[x] ?? false;
    drawCell(ctx, kx, ky, isClock1);
    drawCell(ctx, x, y, isClock2);
  };

  // -----------------------------------------------------------------------
  // Clock mask capture
  // -----------------------------------------------------------------------

  const captureClockMask = (currentTime: Date) => {
    const { nbx, nby } = stateRef.current;
    if (!nbx || !nby) return;

    const hours = String(currentTime.getHours());
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    const offscreen = document.createElement("canvas");
    offscreen.width = nbx;
    offscreen.height = nby;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    // Mobile scale adjustment: dynamically fill ~75-80% width max
    const fontSizeByHeight = Math.floor(nby * 0.35);
    const fontSizeByWidth = Math.floor((nbx / timeStr.length) * 1.5);
    const fontSize = Math.min(fontSizeByHeight, fontSizeByWidth);

    offCtx.font = `bold ${fontSize}px sans-serif, monospace`;
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillStyle = MASK_COLOR;
    offCtx.fillText(timeStr, nbx / 2, nby / 2);

    const imgData = offCtx.getImageData(0, 0, nbx, nby).data;
    const mask: boolean[][] = Array.from({ length: nby }, () =>
      Array(nbx).fill(false)
    );

    for (let ky = 0; ky < nby; ky++) {
      for (let kx = 0; kx < nbx; kx++) {
        const alpha = imgData[(ky * nbx + kx) * 4 + 3];
        mask[ky][kx] = alpha > 128;
      }
    }

    stateRef.current.clockMask = mask;
    stateRef.current.swapHistory = [];
  };

  // -----------------------------------------------------------------------
  // Initialization / resize
  // -----------------------------------------------------------------------

  const initSimulation = () => {
    stateRef.current.isInitializing = true;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      stateRef.current.isInitializing = false;
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      stateRef.current.isInitializing = false;
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    
    // Support high DPI screens on mobile without breaking grid calculations
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    // Dynamic grid step calculation for responsive density
    const isMobile = width < 600;
    const targetCols = isMobile
      ? CONFIG.TARGET_COLS_MOBILE
      : CONFIG.TARGET_COLS_DESKTOP;
    
    const calculatedStep = Math.max(6, Math.floor(width / targetCols));
    const calculatedSide = Math.max(4, calculatedStep - 1);

    const nbx = Math.ceil(width / calculatedStep);
    const nby = Math.ceil(height / calculatedStep);

    if (nbx < 5 || nby < 5) {
      stateRef.current.isInitializing = false;
      return;
    }

    stateRef.current.step = calculatedStep;
    stateRef.current.side = calculatedSide;
    stateRef.current.nbx = nbx;
    stateRef.current.nby = nby;

    const xOffs = (width - nbx * calculatedStep) / 2;
    stateRef.current.xDisp = Array.from(
      { length: nbx },
      (_, kx) => xOffs + kx * calculatedStep
    );

    const yOffs = (height - nby * calculatedStep) / 2;
    stateRef.current.yDisp = Array.from(
      { length: nby },
      (_, ky) => yOffs + ky * calculatedStep
    );

    // Diffusion state values (0-300); actual colors are derived from GRADIENT_STOPS in drawCell.
    const gridHue: number[][] = Array.from({ length: nby }, () =>
      Array.from({ length: nbx }, (_, kx) => Math.floor((300 * kx) / nbx))
    );
    stateRef.current.gridHue = gridHue;

    stateRef.current.phase = "DISPLAY";
    stateRef.current.phaseStartTime = Date.now();
    captureClockMask(timeRef.current);
    renderFullGrid(ctx);

    stateRef.current.isInitializing = false;
  };

  // -----------------------------------------------------------------------
  // Animation loop
  // -----------------------------------------------------------------------

  useEffect(() => {
    initSimulation();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (now: number) => {
      const state = stateRef.current;

      if (!state.isInitializing && state.gridHue.length > 0) {
        const elapsed = now - state.phaseStartTime;

        if (state.phase === "DISPLAY" && elapsed >= CYCLE_TIMINGS.DISPLAY) {
          state.phase = "DISSOLVE";
          state.phaseStartTime = now;
        } else if (
          state.phase === "DISSOLVE" &&
          elapsed >= CYCLE_TIMINGS.DISSOLVE
        ) {
          state.phase = "RECONSTITUTE";
          state.phaseStartTime = now;
        } else if (
          state.phase === "RECONSTITUTE" &&
          (elapsed >= CYCLE_TIMINGS.RECONSTITUTE ||
            state.swapHistory.length === 0)
        ) {
          state.phase = "DISPLAY";
          state.phaseStartTime = now;
          captureClockMask(timeRef.current);
          renderFullGrid(ctx);
        }

        if (state.phase === "RECONSTITUTE") {
          const remainingTime = Math.max(
            16,
            CYCLE_TIMINGS.RECONSTITUTE - elapsed
          );
          const swapsPerFrame = Math.max(
            1,
            Math.ceil(state.swapHistory.length / (remainingTime / 16))
          );
          for (let i = 0; i < swapsPerFrame; i++) {
            unxchg(ctx);
          }
        } else {
          for (let i = 0; i < CONFIG.nbDiffByStep; i++) {
            xchg(ctx);
          }
        }

        if (state.phase === "DISPLAY") {
          const { nbx, nby, clockMask } = state;
          for (let ky = 0; ky < nby; ky++) {
            for (let kx = 0; kx < nbx; kx++) {
              if (clockMask[ky]?.[kx]) {
                drawCell(ctx, kx, ky, true);
              }
            }
          }
        }
      }

      state.animFrameId = requestAnimationFrame(loop);
    };

    stateRef.current.animFrameId = requestAnimationFrame(loop);

    // ResizeObserver ensures dynamic mobile address bar changes & rotations resize correctly
    const resizeObserver = new ResizeObserver(() => {
      initSimulation();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (stateRef.current.animFrameId !== null) {
        cancelAnimationFrame(stateRef.current.animFrameId);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <main ref={containerRef} className={styles.container}>
      <canvas
        ref={canvasRef}
        onClick={initSimulation}
        className={styles.clockCanvas}
      />
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

const MemoizedClock = React.memo(DissolvingDiffusionClock);

MemoizedClock.displayName = "Clock_26_08_23";

export default MemoizedClock;
import fontUrl from '@/assets/fonts/26fonts/26-08-30.otf?url';
import { useEffect, useRef } from 'react';
import water from '../../../../assets/images/26_images/26-08/26-08-30/water.webp';
import styles from './Clock.module.css';

export const assets = [water, fontUrl];

// ---- Configuration ----
const FONT_FAMILY = "'ClockFont_26_08_30', sans-serif";
const NUM_NODES = 19;
const SINGLE_SLICE = (Math.PI * 2) / NUM_NODES;
const BASE_RADIUS = 20;
const BOUNCE_RADIUS = 150;
const GRID_STEP = 100;
const NODE_SPEED = 0.01;

type TimeCategory = 'hours' | 'minutes' | 'ampm';

interface ClockTimeState {
  hours: string;
  minutes: string;
  ampm: string;
}

interface Node {
  baseX: number;
  baseY: number;
  angleCircle: number;
  cosAngleCircle: number;
  sinAngleCircle: number;
  angle: number;
  speed: number;
}

interface NodeContainer {
  category: TimeCategory;
  nodes: Node[];
}

// ---- Pure helpers ----

function getCurrentTimeState(): ClockTimeState {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    ampm,
  };
}

function createNode(x: number, y: number, index: number): Node {
  const angleCircle = index * SINGLE_SLICE;
  return {
    baseX: x,
    baseY: y + Math.random(),
    angleCircle,
    cosAngleCircle: Math.cos(angleCircle),
    sinAngleCircle: Math.sin(angleCircle),
    angle: -x + y, // Inverted X phase relationship for Right-to-Left movement
    speed: NODE_SPEED,
  };
}

function categoryForIndex(index: number): TimeCategory {
  const mod = index % 3;
  return mod === 0 ? 'hours' : mod === 1 ? 'minutes' : 'ampm';
}

function buildGrid(width: number, height: number): NodeContainer[] {
  const containers: NodeContainer[] = [];
  let containerIdx = 0;

  for (let x = 0; x < width + GRID_STEP; x += GRID_STEP) {
    for (let y = 0; y < height + GRID_STEP; y += GRID_STEP) {
      const category = categoryForIndex(containerIdx);
      const nodes = Array.from({ length: NUM_NODES }, (_, i) => createNode(x, y, i));
      containers.push({ category, nodes });
      containerIdx++;
    }
  }

  return containers;
}

/** Advances a node's phase and returns its current render props. Mutates node.angle. */
function stepNode(node: Node) {
  const bounceOffset = Math.sin(node.angle + node.angleCircle) * BOUNCE_RADIUS + BASE_RADIUS;
  const posX = node.baseX + node.cosAngleCircle * bounceOffset;
  const posY = node.baseY + node.sinAngleCircle * bounceOffset;

  const rawSize = Math.cos(node.angle) * 8 + 10;
  const fontSize = Math.round(Math.max(12, rawSize * 2.2));
  const lightness = Math.round(rawSize * 4);

  node.angle += node.speed;

  return { posX, posY, fontSize, lightness };
}

// ---- Hooks ----

/** Loads the custom clock font once and registers it with the document. */
function useCustomFont() {
  useEffect(() => {
    const face = new FontFace('ClockFont_26_08_30', `url(${fontUrl})`, { display: 'block' });
    face
      .load()
      .then((loadedFace) => document.fonts.add(loadedFace))
      .catch(() => {
        // Font failed to load; canvas text falls back to sans-serif.
      });
  }, []);
}

/** Keeps a ref to the current wall-clock time, refreshed every second. */
function useLiveClockTime() {
  const timeStateRef = useRef<ClockTimeState>(getCurrentTimeState());

  useEffect(() => {
    timeStateRef.current = getCurrentTimeState();
    const intervalId = setInterval(() => {
      timeStateRef.current = getCurrentTimeState();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return timeStateRef;
}

/** Drives the canvas render loop. */
function useWaveTextAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  timeStateRef: React.RefObject<ClockTimeState>
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let containers: NodeContainer[] = [];

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      containers = buildGrid(width, height);
    };

    const renderFrame = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      const timeState = timeStateRef.current;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let activeFont = '';
      let activeFill = '';

      for (const container of containers) {
        const text = timeState[container.category];

        for (const node of container.nodes) {
          const { posX, posY, fontSize, lightness } = stepNode(node);

          const fontString = `bold ${fontSize}px ${FONT_FAMILY}`;
          if (fontString !== activeFont) {
            ctx.font = fontString;
            activeFont = fontString;
          }

          const fillString = `hsl(195, 100%, ${lightness}%)`;
          if (fillString !== activeFill) {
            ctx.fillStyle = fillString;
            activeFill = fillString;
          }

          ctx.fillText(text, posX, posY);
        }
      }

      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    renderFrame();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, timeStateRef]);
}

// ---- Component ----

export default function SeaWavesTextClock() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useCustomFont();
  const timeStateRef = useLiveClockTime();
  useWaveTextAnimation(canvasRef, timeStateRef);

  return (
    <div className={styles.container}>
      <img
        src={water}
        alt=""
        className={styles.bgImage}
      />

      <canvas
        ref={canvasRef}
        className={styles.canvas}
      />
    </div>
  );
}
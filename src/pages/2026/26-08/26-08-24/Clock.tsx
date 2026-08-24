import React, { useRef, useEffect, useMemo } from 'react';
import { useSecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets: string[] = [];

// ---------------------------------------------------------------------------
// Color configuration
// ---------------------------------------------------------------------------

const GRADIENT_STOPS: { position: number; color: string }[] = [
  { position: 0.0, color: '#ff6b6b' },
  { position: 0.33, color: '#feca57' },
  { position: 0.67, color: '#48dbfb' },
  { position: 1.0, color: '#ff9ff3' },
];

const CLOCK_GRADIENT_STOPS: { position: number; color: string }[] | null = null;

const MASK_COLOR = '#ffffff';

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
// Bubble / Clock generation
// ---------------------------------------------------------------------------

interface Bubble {
  x: number;
  y: number;
  radius: number;
  colorT: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BubbleClock: React.FC = () => {
  const time = useSecondClock();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const widthRef = useRef(0);
  const heightRef = useRef(0);

  // Generate bubbles that pack into the canvas area
  const generateBubbles = (width: number, height: number): Bubble[] => {
    const bubbles: Bubble[] = [];
    const minRadius = Math.max(20, Math.min(width, height) * 0.04);
    const maxRadius = Math.max(minRadius + 20, Math.min(width, height) * 0.18);
    const targetCount = Math.floor((width * height) / (Math.PI * (maxRadius * maxRadius) * 1.2));
    const count = Math.max(6, Math.min(targetCount, 60));

    const placed: { x: number; y: number; radius: number }[] = [];
    const maxAttempts = 200;

    for (let i = 0; i < count; i++) {
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      let bestX = width * 0.5;
      let bestY = height * 0.5;
      let bestDist = Infinity;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const x = radius + Math.random() * (width - radius * 2);
        const y = radius + Math.random() * (height - radius * 2);

        let minFound = Infinity;
        for (const p of placed) {
          const dx = x - p.x;
          const dy = y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) - radius - p.radius;
          if (dist < 0) {
            minFound = -1;
            break;
          }
          minFound = Math.min(minFound, dist);
        }

        if (minFound >= 0 && minFound < bestDist) {
          bestDist = minFound;
          bestX = x;
          bestY = y;
          if (bestDist < 1) break;
        }
      }

      if (bestDist >= -1 || placed.length === 0) {
        bubbles.push({
          x: bestX,
          y: bestY,
          radius,
          colorT: Math.random(),
        });
        placed.push({ x: bestX, y: bestY, radius });
      }
    }

    return bubbles;
  };

  // Resize / init
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      widthRef.current = rect.width;
      heightRef.current = rect.height;
      bubblesRef.current = generateBubbles(rect.width, rect.height);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = widthRef.current;
      const height = heightRef.current;
      const bubbles = bubblesRef.current;
      if (!width || !height) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const hours = time.getHours() % 12;
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();
      const milliseconds = time.getMilliseconds();

      const smoothSeconds = seconds + milliseconds / 1000;
      const smoothMinutes = minutes + smoothSeconds / 60;
      const smoothHours = hours + smoothMinutes / 60;

      for (const bubble of bubbles) {
        const { x, y, radius, colorT } = bubble;

        // Bubble body
        const bg = getGradientColor(GRADIENT_STOPS, colorT);
        const clockColor = CLOCK_GRADIENT_STOPS
          ? getGradientColor(CLOCK_GRADIENT_STOPS, colorT)
          : invertColor(bg);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = bg;
        ctx.fill();

        // Bubble highlight
        const grad = ctx.createRadialGradient(
          x - radius * 0.3, y - radius * 0.3, radius * 0.05,
          x, y, radius
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Clock face
        const handHour = (smoothHours / 12) * Math.PI * 2 - Math.PI / 2;
        const handMinute = (smoothMinutes / 60) * Math.PI * 2 - Math.PI / 2;
        const handSecond = (smoothSeconds / 60) * Math.PI * 2 - Math.PI / 2;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(radius / 40, radius / 40);

        // Hour markers
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const inner = 28;
          const outer = 35;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          ctx.stroke();
        }

        // Hour hand
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(handHour) * 14, Math.sin(handHour) * 14);
        ctx.stroke();

        // Minute hand
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(handMinute) * 22, Math.sin(handMinute) * 22);
        ctx.stroke();

        // Second hand
        ctx.strokeStyle = clockColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(handSecond) * 26, Math.sin(handSecond) * 26);
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fill();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [time]);

  return (
    <main ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.clockCanvas} />
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

const MemoizedBubbleClock = React.memo(BubbleClock);
MemoizedBubbleClock.displayName = 'Clock_26_08_24';

export default MemoizedBubbleClock;

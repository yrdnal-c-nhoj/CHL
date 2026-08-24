import React, { useRef, useEffect, useMemo } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import soapVideo from '@/assets/images/26_images/26-08/26-08-24/soap.webm';
import styles from './Clock.module.css';

export const assets = [soapVideo];

const GRADIENT_STOPS: { position: number; color: string }[] = [
  { position: 0.0, color: '#ff6b6b' },
  { position: 0.33, color: '#feca57' },
  { position: 0.67, color: '#48dbfb' },
  { position: 1.0, color: '#ff9ff3' },
];

interface Bubble {
  x: number;
  y: number;
  radius: number;
  colorT: number;
}

interface CanvasParams {
  faceRadius: number;
  faceStroke: string;
  faceLineWidth: number;
  hourColor: string;
  hourWidth: number;
  hourLength: number;
  minuteColor: string;
  minuteWidth: number;
  minuteLength: number;
  secondWidth: number;
  secondLength: number;
  scale: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [parseInt(result[1]!, 16), parseInt(result[2]!, 16), parseInt(result[3]!, 16)];
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
  if (stops.length === 1) return stops[0]!.color;

  let i = 0;
  while (i < stops.length - 1 && stops[i + 1]!.position <= t) {
    i++;
  }
  if (i >= stops.length - 1) return stops[stops.length - 1]!.color;

  const s1 = stops[i]!;
  const s2 = stops[i + 1]!;

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

const BubbleClock: React.FC = () => {
  const time = useMillisecondClock();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const clocksRef = useRef<Bubble[]>([]);

  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const canvasParamsRef = useRef<CanvasParams>({
    faceRadius: 36,
    faceStroke: 'rgba(255, 255, 255, 0.25)',
    faceLineWidth: 1.5,
    hourColor: 'rgba(255, 255, 255, 0.8)',
    hourWidth: 4,
    hourLength: 14,
    minuteColor: 'rgba(255, 255, 255, 0.7)',
    minuteWidth: 3,
    minuteLength: 22,
    secondWidth: 2,
    secondLength: 26,
    scale: 40,
  });

  const readCssParams = () => {
    const container = containerRef.current;
    if (!container) return;
    const style = getComputedStyle(container);
    canvasParamsRef.current = {
      faceRadius: parseFloat(style.getPropertyValue('--clock-face-radius')) || 36,
      faceStroke: style.getPropertyValue('--clock-face-stroke').trim() || 'rgba(255, 255, 255, 0.25)',
      faceLineWidth: parseFloat(style.getPropertyValue('--clock-face-line-width')) || 1.5,
      hourColor: style.getPropertyValue('--clock-hour-color').trim() || 'rgba(255, 255, 255, 0.8)',
      hourWidth: parseFloat(style.getPropertyValue('--clock-hour-width')) || 4,
      hourLength: parseFloat(style.getPropertyValue('--clock-hour-length')) || 14,
      minuteColor: style.getPropertyValue('--clock-minute-color').trim() || 'rgba(255, 255, 255, 0.7)',
      minuteWidth: parseFloat(style.getPropertyValue('--clock-minute-width')) || 3,
      minuteLength: parseFloat(style.getPropertyValue('--clock-minute-length')) || 22,
      secondWidth: parseFloat(style.getPropertyValue('--clock-second-width')) || 2,
      secondLength: parseFloat(style.getPropertyValue('--clock-second-length')) || 26,
      scale: parseFloat(style.getPropertyValue('--clock-scale')) || 40,
    };
  };

  const { handHour, handMinute, handSecond, clocks } = useMemo(() => {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    const smoothSeconds = seconds + milliseconds / 1000;
    const smoothMinutes = minutes + smoothSeconds / 60;
    const smoothHours = hours + smoothMinutes / 60;

    return {
      handHour: (smoothHours / 12) * Math.PI * 2 - Math.PI / 2,
      handMinute: (smoothMinutes / 60) * Math.PI * 2 - Math.PI / 2,
      handSecond: (smoothSeconds / 60) * Math.PI * 2 - Math.PI / 2,
      clocks: clocksRef.current,
    };
  }, [time]);

  const generateClocks = (width: number, height: number): Bubble[] => {
    const clocks: Bubble[] = [];
    const minRadius = Math.max(25, Math.min(width, height) * 0.05);
    const maxRadius = Math.max(minRadius * 1.8, Math.min(width, height) * 0.3);
    const targetCount = Math.floor((width * height) / (Math.PI * (maxRadius * maxRadius) * 0.55));
    const count = Math.max(15, Math.min(targetCount, 100));

    const placed: { x: number; y: number; radius: number }[] = [];
    const maxAttempts = 400;

    for (let i = 0; i < count; i++) {
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      let bestX = radius + Math.random() * (width - radius * 2);
      let bestY = radius + Math.random() * (height - radius * 2);
      let bestDist = placed.length === 0 ? 0 : Infinity;

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

        if (placed.length === 0 || (minFound >= 0 && minFound < bestDist)) {
          bestDist = minFound;
          bestX = x;
          bestY = y;
          if (bestDist < 1) break;
        }
      }

      if (bestDist >= -1) {
        clocks.push({
          x: bestX,
          y: bestY,
          radius,
          colorT: Math.random(),
        });
        placed.push({ x: bestX, y: bestY, radius });
      }
    }

    return clocks;
  };

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
      clocksRef.current = generateClocks(rect.width, rect.height);
    };

    resize();
    readCssParams();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = widthRef.current;
    const height = heightRef.current;
    if (!width || !height) return;

    ctx.clearRect(0, 0, width, height);

    for (const clock of clocks) {
      const { x, y, radius, colorT } = clock;

      const clockColor = getGradientColor(GRADIENT_STOPS, colorT);
      const params = canvasParamsRef.current;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(radius / params.scale, radius / params.scale);

      ctx.beginPath();
      ctx.arc(0, 0, params.faceRadius, 0, Math.PI * 2);
      ctx.strokeStyle = params.faceStroke;
      ctx.lineWidth = params.faceLineWidth;
      ctx.stroke();

      ctx.strokeStyle = params.hourColor;
      ctx.lineWidth = params.hourWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(handHour) * params.hourLength, Math.sin(handHour) * params.hourLength);
      ctx.stroke();

      ctx.strokeStyle = params.minuteColor;
      ctx.lineWidth = params.minuteWidth;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(handMinute) * params.minuteLength, Math.sin(handMinute) * params.minuteLength);
      ctx.stroke();

      ctx.strokeStyle = clockColor;
      ctx.lineWidth = params.secondWidth;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(handSecond) * params.secondLength, Math.sin(handSecond) * params.secondLength);
      ctx.stroke();

      ctx.restore();
    }
  }, [time, handHour, handMinute, handSecond, clocks]);

  return (
    <main ref={containerRef} className={styles.container}>
      <video
        ref={videoRef}
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={soapVideo} type="video/webm" />
      </video>
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

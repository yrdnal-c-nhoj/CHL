import React, { useRef, useEffect, useMemo } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import soapVideo from '@/assets/images/26_images/26-08/26-08-24/soap.webm';
import styles from './Clock.module.css';

export const assets = [soapVideo];

interface Bubble {
  x: number;
  y: number;
  radius: number;
  secondColor: string;
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

function getRandomBrightColor(): string {
  const h = Math.random() * 360;
  const s = 80 + Math.random() * 20;
  const l = 50 + Math.random() * 20;
  return `hsl(${h}, ${s}%, ${l}%)`;
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
    faceStroke: 'rgba(255, 255, 255, 0.45)',
    faceLineWidth: 1.5,
    hourColor: 'rgba(255, 255, 255, 0.9)',
    hourWidth: 4,
    hourLength: 14,
    minuteColor: 'rgba(255, 255, 255, 0.8)',
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
      faceStroke: style.getPropertyValue('--clock-face-stroke').trim() || 'rgba(255, 255, 255, 0.45)',
      faceLineWidth: parseFloat(style.getPropertyValue('--clock-face-line-width')) || 1.5,
      hourColor: style.getPropertyValue('--clock-hour-color').trim() || 'rgba(255, 255, 255, 0.9)',
      hourWidth: parseFloat(style.getPropertyValue('--clock-hour-width')) || 4,
      hourLength: parseFloat(style.getPropertyValue('--clock-hour-length')) || 14,
      minuteColor: style.getPropertyValue('--clock-minute-color').trim() || 'rgba(255, 255, 255, 0.8)',
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
    const minRadius = 40;
    const maxRadius = 90;
    const avgRadius = (minRadius + maxRadius) / 2;
    const targetCount = Math.floor((width * height) / (Math.PI * (avgRadius * avgRadius) * 0.45));
    const count = Math.max(8, Math.min(targetCount, 35));

    const placed: { x: number; y: number; radius: number }[] = [];
    const maxAttempts = 500;

    for (let i = 0; i < count; i++) {
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      let bestX = -radius * 0.4 + Math.random() * (width + radius * 0.8);
      let bestY = -radius * 0.4 + Math.random() * (height + radius * 0.8);
      let bestDist = placed.length === 0 ? 0 : Infinity;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const x = -radius * 0.4 + Math.random() * (width + radius * 0.8);
        const y = -radius * 0.4 + Math.random() * (height + radius * 0.8);

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

      if (bestDist >= 0) {
        clocks.push({
          x: bestX,
          y: bestY,
          radius,
          secondColor: getRandomBrightColor(),
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
      const { x, y, radius, secondColor } = clock;

      const params = canvasParamsRef.current;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(radius / params.scale, radius / params.scale);

      ctx.beginPath();
      ctx.arc(0, 0, params.faceRadius, 0, Math.PI * 2);
      ctx.strokeStyle = params.faceStroke;
      ctx.lineWidth = params.faceLineWidth;
      ctx.fillStyle = secondColor.replace(')', ', 0.08)').replace('hsl', 'hsla');
      ctx.fill();
      ctx.stroke();

      const highlight = ctx.createRadialGradient(
        -params.faceRadius * 0.25,
        -params.faceRadius * 0.25,
        params.faceRadius * 0.05,
        0,
        0,
        params.faceRadius
      );
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      highlight.addColorStop(0.4, 'rgba(255, 255, 255, 0.08)');
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.beginPath();
      ctx.arc(0, 0, params.faceRadius, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();

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

      ctx.strokeStyle = secondColor;
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

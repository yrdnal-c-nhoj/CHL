import soapVideo from '@/assets/images/26_images/26-08/26-08-24/soap.webm';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useRef } from 'react';
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
  fillOpacity: number;
  highlightOpacity: number;
  glossOpacity: number;
  highlightThickness: number;
  highlightOpacity2: number;
  highlightOffsetX: number;
  highlightOffsetY: number;
  highlightRadiusScale: number;
  highlightStartAngle: number;
  highlightEndAngle: number;
  highlightGap: number;
  minRadius: number;
  maxRadius: number;
}

function getRandomBrightColor(): string {
  const h = Math.random() * 360;
  const s = 80 + Math.random() * 20;
  const l = 50 + Math.random() * 20;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

const Clock: React.FC = () => {
  const time = useMillisecondClock();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const clocksRef = useRef<Bubble[]>([]);

  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const canvasParamsRef = useRef<CanvasParams>({
    faceRadius: 36,
    faceStroke: 'rgba(255, 255, 255, 0.99)',
    faceLineWidth: 1,
    hourColor: 'rgba(255, 255, 255, 0.77)',
    hourWidth: 1,
    hourLength: 14,
    minuteColor: 'rgba(255, 255, 255, 0.55)',
    minuteWidth: 1,
    minuteLength: 22,
    secondWidth: 0.5,
    secondLength: 26,
    scale: 40,
    fillOpacity: 0.1,
    highlightOpacity: 0.45,
    glossOpacity: 0.15,
    highlightThickness: 2.5,
    highlightOpacity2: 0.65,
    highlightOffsetX: 0.08,
    highlightOffsetY: -0.12,
    highlightRadiusScale: 0.82,
    highlightStartAngle: 2.4,
    highlightEndAngle: 3.8,
    highlightGap: 0.5,
    minRadius: 40,
    maxRadius: 90,
  });

  const readCssParams = () => {
    const container = containerRef.current;
    if (!container) return;
    const style = getComputedStyle(container);
    canvasParamsRef.current = {
      faceRadius: parseFloat(style.getPropertyValue('--clock-face-radius')) || 36,
      faceStroke: style.getPropertyValue('--clock-face-stroke').trim() || 'rgba(255, 255, 255, 0.55)',
      faceLineWidth: parseFloat(style.getPropertyValue('--clock-face-line-width')) || 2,
      hourColor: style.getPropertyValue('--clock-hour-color').trim() || 'rgba(255, 255, 255, 0.95)',
      hourWidth: parseFloat(style.getPropertyValue('--clock-hour-width')) || 4,
      hourLength: parseFloat(style.getPropertyValue('--clock-hour-length')) || 14,
      minuteColor: style.getPropertyValue('--clock-minute-color').trim() || 'rgba(255, 255, 255, 0.85)',
      minuteWidth: parseFloat(style.getPropertyValue('--clock-minute-width')) || 3,
      minuteLength: parseFloat(style.getPropertyValue('--clock-minute-length')) || 22,
      secondWidth: parseFloat(style.getPropertyValue('--clock-second-width')) || 2,
      secondLength: parseFloat(style.getPropertyValue('--clock-second-length')) || 26,
      scale: parseFloat(style.getPropertyValue('--clock-scale')) || 40,
      fillOpacity: parseFloat(style.getPropertyValue('--bubble-fill-opacity')) || 0.1,
      highlightOpacity: parseFloat(style.getPropertyValue('--bubble-highlight-opacity')) || 0.45,
      glossOpacity: parseFloat(style.getPropertyValue('--bubble-gloss-opacity')) || 0.15,
      highlightThickness: parseFloat(style.getPropertyValue('--bubble-highlight-thickness')) || 2.5,
      highlightOpacity2: parseFloat(style.getPropertyValue('--bubble-highlight-opacity-2')) || 0.65,
      highlightOffsetX: parseFloat(style.getPropertyValue('--bubble-highlight-offset-x')) || 0.08,
      highlightOffsetY: parseFloat(style.getPropertyValue('--bubble-highlight-offset-y')) || -0.12,
      highlightRadiusScale: parseFloat(style.getPropertyValue('--bubble-highlight-radius-scale')) || 0.82,
      highlightStartAngle: parseFloat(style.getPropertyValue('--bubble-highlight-start-angle')) || 2.4,
      highlightEndAngle: parseFloat(style.getPropertyValue('--bubble-highlight-end-angle')) || 3.8,
      highlightGap: parseFloat(style.getPropertyValue('--bubble-highlight-gap')) || 0.5,
      minRadius: parseFloat(style.getPropertyValue('--bubble-min-radius')) || 40,
      maxRadius: parseFloat(style.getPropertyValue('--bubble-max-radius')) || 90,
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
    const minRadius = canvasParamsRef.current.minRadius;
    const maxRadius = canvasParamsRef.current.maxRadius;
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

    readCssParams();
    resize();
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
      ctx.fillStyle = secondColor.replace(')', `, ${params.fillOpacity})`).replace('hsl', 'hsla');
      ctx.fill();
      ctx.stroke();

      const highlight = ctx.createRadialGradient(
        -params.faceRadius * 0.3,
        -params.faceRadius * 0.3,
        params.faceRadius * 0.05,
        0,
        0,
        params.faceRadius
      );
      highlight.addColorStop(0, `rgba(255, 255, 255, ${params.highlightOpacity})`);
      highlight.addColorStop(0.35, `rgba(255, 255, 255, ${params.glossOpacity})`);
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.beginPath();
      ctx.arc(0, 0, params.faceRadius, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();

      ctx.strokeStyle = `rgba(255, 255, 255, ${params.highlightOpacity2})`;
      ctx.lineWidth = params.highlightThickness;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(
        params.faceRadius * params.highlightOffsetX,
        params.faceRadius * params.highlightOffsetY,
        params.faceRadius * params.highlightRadiusScale,
        params.highlightStartAngle,
        params.highlightEndAngle,
        false
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(
        params.faceRadius * params.highlightOffsetX,
        params.faceRadius * params.highlightOffsetY,
        params.faceRadius * params.highlightRadiusScale,
        params.highlightStartAngle + params.highlightGap,
        params.highlightEndAngle - params.highlightGap,
        false
      );
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

Clock.displayName = 'Clock_26_08_24';

export default Clock;

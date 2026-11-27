import { useEffect, useRef } from 'react';

import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import clockFont from '@/assets/fonts/26fonts/26-11-24.ttf?url';

import styles from './Clock.module.css';

export const assets = [clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_24',
  fontUrl: clockFont,
};

interface FallingDigit {
  value: string;
  column: number;
  startTime: number;
  duration: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  rotationDirection: number;
  startX: number;
  startY: number;
}

const MAX_DIGITS = 240;
const FALL_DISTANCE = 1.5;

const getRotation = (): number => {
  const direction = Math.random() > 0.5 ? 1 : -1;
  return direction * (360 + Math.random() * 1080);
};

const createFallingDigit = (
  value: string,
  column: number,
  startTime: number,
): FallingDigit => {
  const distanceFromRight = 5 - column;

  const duration =
    (120000 + Math.random() * 30000) * Math.pow(1.5, distanceFromRight);

  return {
    value,
    column,
    startTime,
    duration,
    rotationX: getRotation(),
    rotationY: getRotation(),
    rotationZ: getRotation(),
    rotationDirection: Math.random() > 0.5 ? 1 : -1,
    startX: 0,
    startY: 0,
  };
};

const Clock_26_11_24 = () => {
  const time = useClock();

  useSuspenseFontLoader([fontConfig]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const digitsRef = useRef<FallingDigit[]>([]);
  const previousTime = useRef('');
  const lastAnimationTime = useRef<number>(0);

  const displayTime = time
    .toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/:/g, '');

  // Add a falling digit whenever a displayed digit changes.
  useEffect(() => {
    if (!previousTime.current) {
      previousTime.current = displayTime;
      return;
    }

    const previous = previousTime.current;

    if (previous === displayTime) return;

    previousTime.current = displayTime;

    const now = lastAnimationTime.current || 0;

    for (let column = 0; column < 6; column++) {
      const prevChar = previous[column];
      const nextChar = displayTime[column];

      if (!prevChar || prevChar === nextChar) continue;

      digitsRef.current.push(createFallingDigit(prevChar, column, now));
    }

    // Keep memory and rendering costs bounded.
    if (digitsRef.current.length > MAX_DIGITS) {
      digitsRef.current.splice(0, digitsRef.current.length - MAX_DIGITS);
    }
  }, [displayTime]);

  // Draw all falling digits in one canvas animation loop.
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    });

    if (!context) return;

    let animationFrame = 0;
    let lastFrame = 0;

    const frameInterval = 1000 / 30;

    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    let fontSize = 0;
    let columnWidth = 0;
    let centerX = 0;
    let startY = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      fontSize = Math.min(height * 0.3, width * 0.18);
      columnWidth = fontSize * 0.65;

      centerX = width / 2;
      startY = height * 0.2;
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = (timestamp: number) => {
      animationFrame = requestAnimationFrame(draw);

      lastAnimationTime.current = timestamp;

      if (timestamp - lastFrame < frameInterval) return;

      lastFrame = timestamp;

      context.clearRect(0, 0, width, height);

      context.font = `${fontSize}px ClockFont_26_11_24, monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      const digits = digitsRef.current;
      const now = timestamp;

      // Filter active digits and build new array
      const activeDigits: FallingDigit[] = [];

      for (let index = 0; index < digits.length; index++) {
        const digit = digits[index];

        if (!digit) continue;

        const progress = (now - digit.startTime) / digit.duration;

        if (progress >= 1) continue;

        activeDigits.push(digit);

        const columnX = centerX + (digit.column - 2.5) * columnWidth;

        const fallY = progress * height * FALL_DISTANCE;

        const rotationX = digit.rotationX * progress;
        const rotationY = digit.rotationY * progress;
        const rotationZ = digit.rotationZ * progress;

        const fade = Math.max(0, 1 - progress * progress);

        // Approximate 3D rotation using canvas transforms.
        const scaleX = Math.cos((rotationY * Math.PI) / 180);
        const scaleY = Math.cos((rotationX * Math.PI) / 180);

        context.save();

        context.translate(
          columnX + digit.startX,
          startY + fallY + digit.startY,
        );

        context.rotate((rotationZ * Math.PI) / 180);

        context.transform(
          scaleX,
          Math.sin((rotationZ * Math.PI) / 180) * 0.2,
          Math.sin((rotationZ * Math.PI) / 180) * 0.2,
          scaleY,
          0,
          0,
        );

        context.globalAlpha = fade;

        context.shadowColor = '#eddede';
        context.shadowOffsetX = -2;
        context.shadowOffsetY = 2;
        context.shadowBlur = 0;

        context.fillStyle = '#f904a0';

        context.fillText(digit.value, 0, 0);

        context.restore();
      }

      digitsRef.current = activeDigits;
    };

    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, []);

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.content} aria-hidden="true">
        {displayTime.split('').map((value, index) => (
          <span className={styles.digit} key={index}>
            {value}
          </span>
        ))}
      </div>

      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </main>
  );
};

Clock_26_11_24.displayName = 'Clock_26_11_24';

export default Clock_26_11_24;

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '@/utils/useSmoothClock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import type { CSSProperties } from 'react';
import stickFont from '@/assets/fonts/2025/25-04-26-Stick.ttf?url';

// Component Props interface
interface SkewClockProps {
  // No props required for this component
}

const SkewClock: React.FC<SkewClockProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'skew-stick',
      fontUrl: stickFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();

  const getRandomVibrantColor = useCallback((): string => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 50%)`;
  }, []);

  const updateClock = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let hours = currentTime.getHours() % 12;
    if (hours === 0) hours = 12;
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    let digits = `${hours}${minutes}`.split('');
    if (digits.length < 4) digits.unshift(' '); // pad with space for single-digit hour
    const colors = digits.map(() => getRandomVibrantColor());
    drawText(ctx, canvas, digits, colors);
  }, [currentTime, getRandomVibrantColor]);

  const drawText = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, digits: string[], colors: string[]): void => {
    ctx.save();

    const fontSize = canvas.height * 0.2;
    ctx.font = `${fontSize}px 'skew-stick', sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';

    // Measure widths for precise centering
    const spacing = canvas.width * 0.015;
    const widths = digits.map((d) => ctx.measureText(d).width);
    const totalWidth =
      widths.reduce((acc, w) => acc + w, 0) + spacing * (digits.length - 1);
    let startX = (canvas.width - totalWidth) / 2;
    const centerY = canvas.height / 2;

    digits.forEach((digit, i) => {
      // Slight random jitter around centered position
      const jitterX = (Math.random() - 0.5) * 30; // ±15 px horizontally
      const jitterY = (Math.random() - 0.5) * 30; // ±15 px vertically

      const x = startX + jitterX;
      const y = centerY + jitterY;

      // Exaggerated skew ±0.7
      const skew = (Math.random() - 0.5) * 1.4;

      ctx.setTransform(1, skew, skew, 1, x, y);

      ctx.lineWidth = 0.5 * canvas.height * 0.01;

      ctx.strokeStyle = getRandomVibrantColor();
      ctx.strokeText(digit, 0, 0);

      ctx.fillStyle = colors[i];
      ctx.fillText(digit, 0, 0);

      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      startX += widths[i] + spacing;
    });

    ctx.restore();
  }, [getRandomVibrantColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.fonts.load(`1rem 'skew-stick'`).then(() => {
      updateClock();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [updateClock]);

  return (
    <div
      className="skew-wrapper"
      style={{ fontFamily: 'skew-stick, sans-serif' }}
    >
      <style>{`
        @font-face {
          font-family: 'skew-stick';
          src: url(${stickFont}) format('truetype');
        }

        .skew-wrapper, .skew-wrapper * {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .skew-wrapper {
          background: black;
          height: 100dvh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
        }
      `}</style>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SkewClock;

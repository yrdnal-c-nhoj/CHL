import { useEffect, useRef, useMemo, Suspense } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime, useSmoothClock } from '@/utils/hooks';
import backgroundImage from '@/assets/images/2025/25-08/25-08-27/rootsu.webp';
import dodecahedronFontFile from '@/assets/fonts/2025/25-08-27-root.ttf';
import styles from './Clock.module.css';

export const assets = [backgroundImage];

function ClockContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef<HTMLCanvasElement>(null);
  const fontRef = useRef('sans-serif');
  const time = useClockTime();
  const smoothTime = useSmoothClock();
  const animState = useRef({ step: 1, alpha: 1, frameCount: 0 });

  const fontConfigs = useMemo(
    () => [
      {
        fontFamily: 'DodecahedronFont',
        fontUrl: dodecahedronFontFile,
        options: {
          weight: 'normal',
          style: 'normal',
        },
      },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    const clock = clockRef.current!;
    const cctx = clock.getContext('2d');

    const n = 12;
    const buildSpeed = 5;
    const fadeSpeed = 0.01;

    // Ensure font name is ready for canvas
    fontRef.current = 'DodecahedronFont';

    const resize = () => {
      const containerSize =
        Math.min(window.innerWidth, window.innerHeight) * 0.8;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = containerSize * dpr;
      canvas.height = containerSize * dpr;
      clock.width = containerSize * dpr;
      clock.height = containerSize * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      canvas.style.width = `${containerSize}px`;
      canvas.style.height = `${containerSize}px`;
      clock.style.width = `${containerSize}px`;
      clock.style.height = `${containerSize}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    const drawRoots = (ctx: CanvasRenderingContext2D, size: number) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.35;
      const pointRadius = size * 0.02;
      const textOffset = size * 0.04;

      const roots = [];
      for (let k = 0; k < n; k++) {
        const angle = Math.PI + (2 * Math.PI * k) / n;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        roots.push({ x, y });
      }

      ctx.clearRect(0, 0, size, size);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255,0,0,0.3)';
      ctx.lineWidth = size * 0.009;
      ctx.stroke();

      ctx.font = `${size * 0.08}px ${fontRef.current}`;
      ctx.fillStyle = '#03341F';

      roots.forEach((root, k) => {
        ctx.beginPath();
        ctx.arc(root.x, root.y, pointRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#212321';
        ctx.fill();

        const angle = Math.atan2(root.y - centerY, root.x - centerX);
        const labelDist = radius * 0.15;
        const tx = centerX + (radius + labelDist) * Math.cos(angle);
        const ty = centerY + (radius + labelDist) * Math.sin(angle);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`ω^${k}`, tx, ty);
      });

      ctx.strokeStyle = `rgba(255,255,0,${animState.current.alpha})`;
      ctx.lineWidth = size * 0.01;
      ctx.beginPath();
      for (let k = 0; k < animState.current.step - 1; k++) {
        ctx.moveTo(roots[k].x, roots[k].y);
        ctx.lineTo(roots[k + 1].x, roots[k + 1].y);
      }
      if (animState.current.step === n) {
        ctx.moveTo(roots[n - 1].x, roots[n - 1].y);
        ctx.lineTo(roots[0].x, roots[0].y);
      }
      ctx.stroke();

      animState.current.frameCount++;
      if (animState.current.frameCount % buildSpeed === 0) {
        animState.current.step++;
        if (animState.current.step > n) animState.current.step = n;
      }
      if (animState.current.step === n) {
        animState.current.alpha -= fadeSpeed;
        if (animState.current.alpha <= 0) {
          animState.current.alpha = 1;
          animState.current.step = 1;
        }
      }
    };

    const drawClock = (
      cctx: CanvasRenderingContext2D,
      currentTime: Date,
      size: number,
    ) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.45;
      cctx.clearRect(0, 0, size, size);

      const sec = currentTime.getSeconds();
      const min = currentTime.getMinutes();
      const hr = currentTime.getHours() % 12;

      const hourAngle = ((hr + min / 60) * 2 * Math.PI) / 12 - Math.PI / 2;
      const minAngle = ((min + sec / 60) * 2 * Math.PI) / 60 - Math.PI / 2;
      const secAngle = (sec * 2 * Math.PI) / 60 - Math.PI / 2;

      const drawHand = (
        angle: number,
        length: number,
        color: string,
        width: number
      ) => {
        cctx.beginPath();
        cctx.moveTo(centerX, centerY);
        cctx.lineTo(
          centerX + length * Math.cos(angle),
          centerY + length * Math.sin(angle),
        );
        cctx.strokeStyle = color;
        cctx.lineWidth = width;
        cctx.stroke();
      };

      drawHand(hourAngle, radius * 0.5, '#312E2E', 0.3 * (size / 100));
      drawHand(minAngle, radius * 0.8, '#312E2E', 0.3 * (size / 100));
      drawHand(secAngle, radius * 0.9, '#1A1C1A', 0.3 * (size / 100));
    };

    let animationId: number;
    const animate = () => {
      const dpr = window.devicePixelRatio || 1;
      const size = canvas.width / dpr;

      drawRoots(ctx!, size);
      drawClock(cctx!, smoothTime, size);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
    // Removed smoothTime from dependencies to prevent effect restart loop.
    // The animate loop inside already has access to the clock logic.
  }, []);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} style={{ display: 'none' }}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.clockWrapper}>
        <img
          decoding="async"
          loading="lazy"
          src={backgroundImage}
          alt="Background"
          className={styles.bgImage}
        />
        <canvas ref={canvasRef} className={styles.canvasLayer1} />
        <canvas ref={clockRef} className={styles.canvasLayer3} />
      </div>
    </main>
  );
}

export default function TwelfthRootsOfUnityWithClock() {
  return (
    <Suspense fallback={null}>
      <ClockContent />
    </Suspense>
  );
}

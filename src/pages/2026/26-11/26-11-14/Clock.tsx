import { useEffect, useRef } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import backgroundVideo from '@/assets/images/26_images/26-11/26-11-14/collapse.webm';
import clockFont from '@/assets/fonts/26fonts/26-11-14-subset.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, clockFont];

const TILE_WIDTH = 200;
const TILE_HEIGHT = 300;

const Clock_26_11_14 = () => {
  const time = useSmoothClock(16);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });

    if (!ctx) return;

    let animationFrame = 0;
    let active = false;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.scale(dpr, dpr);
      canvasSizeRef.current = { width: rect.width, height: rect.height };
    };

    // Match object-fit: cover for each individual tile.
    const draw = () => {
      if (!active) return;

      const { width: canvasWidth, height: canvasHeight } =
        canvasSizeRef.current;

      if (video.readyState >= 2 && canvasWidth > 0 && canvasHeight > 0) {
        const videoAspect = video.videoWidth / video.videoHeight;
        const tileAspect = TILE_WIDTH / TILE_HEIGHT;

        let sx = 0;
        let sy = 0;
        let sw = video.videoWidth;
        let sh = video.videoHeight;

        if (videoAspect > tileAspect) {
          sw = video.videoHeight * tileAspect;
          sx = (video.videoWidth - sw) / 2;
        } else {
          sh = video.videoWidth / tileAspect;
          sy = (video.videoHeight - sh) / 2;
        }

        const tileCols = Math.ceil(canvasWidth / TILE_WIDTH);
        const tileRows = Math.ceil(canvasHeight / TILE_HEIGHT);

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let row = 0; row < tileRows; row++) {
          for (let col = 0; col < tileCols; col++) {
            ctx.drawImage(
              video,
              sx,
              sy,
              sw,
              sh,
              col * TILE_WIDTH,
              row * TILE_HEIGHT,
              TILE_WIDTH,
              TILE_HEIGHT,
            );
          }
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const start = () => {
      if (motionPreference.matches || active) return;

      active = true;

      video.play().catch(() => {
        active = false;
      });

      animationFrame = requestAnimationFrame(draw);
    };

    const stop = () => {
      active = false;
      cancelAnimationFrame(animationFrame);
      video.pause();
    };

    const handleMotionChange = () => {
      if (motionPreference.matches) {
        stop();
      } else {
        start();
      }
    };

    motionPreference.addEventListener('change', handleMotionChange);

    // Initial resize and observer
    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    if (video.readyState >= 1) {
      start();
    } else {
      video.addEventListener('loadedmetadata', start, { once: true });
    }

    return () => {
      stop();
      video.removeEventListener('loadedmetadata', start);
      motionPreference.removeEventListener('change', handleMotionChange);
      resizeObserver.disconnect();
    };
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const milliseconds = time.getMilliseconds().toString().padStart(3, '0');

  return (
    <main className={styles.container}>
      <video
        ref={videoRef}
        className={styles.videoSource}
        src={backgroundVideo}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <canvas ref={canvasRef} className={styles.tileLayer} aria-hidden="true" />

      <SRTime time={time} />

      <div className={styles.content} aria-hidden="true">
        {hours}
        {minutes}
        {seconds}
        {milliseconds}
      </div>
    </main>
  );
};

Clock_26_11_14.displayName = 'Clock_26_11_14';

export default Clock_26_11_14;

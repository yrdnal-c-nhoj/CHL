import { useSecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from './Clock.module.css';

import zoomVideo from '@/assets/images/26_images/26-07/26-07-22/zoom.mp4';

// Export assets for the preloading pipeline
export const assets = [zoomVideo];

// =========================
// UTILITY FUNCTIONS
// =========================
const formatDigits = (num: number): string => num.toString().padStart(2, '0');

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// =========================
// CANVAS TILING HOOK
// =========================
function useVideoTiling(
  videoSrc: string,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number>(0);
  const renderFrameRef = useRef<() => void>(() => {
    /* noop placeholder */
  });

  // Define the actual render function once via ref so rAF callbacks stay stable
  renderFrameRef.current = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const vw = video.videoWidth;
    const vh = video.videoHeight;

    if (vw === 0 || vh === 0) {
      rafRef.current = requestAnimationFrame(() => renderFrameRef.current());
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, cw, ch);

    // Tile settings
    const tileW = 200; // tile width in px
    const tileH = (vh / vw) * tileW; // maintain aspect ratio

    // Calculate number of tiles needed to fill the canvas
    const cols = Math.ceil(cw / tileW);
    const rows = Math.ceil(ch / tileH);

    // Center the grid by computing offset
    const offsetX = (cw - cols * tileW) / 2;
    const offsetY = (ch - rows * tileH) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = Math.round(offsetX + col * tileW);
        const y = Math.round(offsetY + row * tileH);

        // Checkerboard: alternate horizontal flip
        if ((row + col) % 2 === 1) {
          ctx.save();
          ctx.translate(Math.round(x + tileW / 2), Math.round(y + tileH / 2));
          ctx.scale(-1, 1);
          ctx.drawImage(video, -tileW / 2, -tileH / 2, Math.round(tileW), Math.round(tileH));
          ctx.restore();
        } else {
          ctx.drawImage(video, x, y, Math.round(tileW), Math.round(tileH));
        }
      }
    }

    rafRef.current = requestAnimationFrame(() => renderFrameRef.current());
  };

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.visibility = 'hidden';
    video.style.position = 'absolute';
    video.style.width = '0';
    video.style.height = '0';
    video.style.pointerEvents = 'none';
    document.body.appendChild(video);

    videoRef.current = video;

    const startRendering = () => {
      rafRef.current = requestAnimationFrame(() => renderFrameRef.current());
    };

    if (video.readyState >= 2) {
      startRendering();
    } else {
      video.addEventListener('canplay', startRendering, { once: true });
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.pause();
      video.removeAttribute('src');
      video.load();
      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }
      videoRef.current = null;
    };
  }, [videoSrc]);
}

// =========================
// MAIN COMPONENT
// =========================
const ZoomClock: React.FC = () => {
  const time = useSecondClock();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useVideoTiling(zoomVideo, canvasRef);

  // Sync canvas size with window dimensions
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const { hours, minutes, seconds, isoTime, dateStr } = useMemo(() => {
    const h = formatDigits(time.getHours());
    const m = formatDigits(time.getMinutes());
    const s = formatDigits(time.getSeconds());
    const dayName = DAYS[time.getDay()];
    const monthName = MONTHS[time.getMonth()];
    const dayNum = time.getDate();
    const year = time.getFullYear();

    return {
      hours: h,
      minutes: m,
      seconds: s,
      isoTime: time.toISOString(),
      dateStr: `${dayName}, ${monthName} ${dayNum}, ${year}`,
    };
  }, [time]);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.background}
      />

      <div className={styles.overlay} />

      <time className={styles.timeDisplay} dateTime={isoTime}>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{hours[0]}</span>
          <span className={styles.digit}>{hours[1]}</span>
        </span>
        <span className={styles.separator}>:</span>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{minutes[0]}</span>
          <span className={styles.digit}>{minutes[1]}</span>
        </span>
        <span className={styles.separator}>:</span>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{seconds[0]}</span>
          <span className={styles.digit}>{seconds[1]}</span>
        </span>
      </time>

      <span className={styles.dateDisplay} aria-hidden="true">
        {dateStr}
      </span>
    </div>
  );
};

export default ZoomClock;

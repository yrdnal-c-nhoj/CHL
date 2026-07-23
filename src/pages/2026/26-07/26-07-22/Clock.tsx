import zoomVideo from '@/assets/images/26_images/26-07/26-07-22/zoom.mp4';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from './Clock.module.css';

export const assets = [zoomVideo];

const TILE_WIDTH = 200;

function useVideoTiling(
  videoSrc: string,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((e) => {
        console.error("Video play failed:", e);
      });
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const cw = canvas.width;
          const ch = canvas.height;
          const vw = video.videoWidth;
          const vh = video.videoHeight;

          if (vw > 0 && vh > 0) {
            ctx.clearRect(0, 0, cw, ch);

            const exactTileH = (vh / vw) * TILE_WIDTH;
            const tileH = Math.ceil(exactTileH);

            const cols = Math.ceil(cw / TILE_WIDTH) + 3;
            const rows = Math.ceil(ch / tileH) + 2;

            const offsetX = Math.floor((cw - (cols - 2) * TILE_WIDTH) / 2) - TILE_WIDTH;
            const offsetY = Math.floor((ch - (rows - 1) * tileH) / 2);

            const drawW = TILE_WIDTH + 3;
            const drawH = tileH + 3;

            for (let row = 0; row < rows; row++) {
              const rowShift = row % 2 === 1 ? TILE_WIDTH : 0;

              for (let col = 0; col < cols; col++) {
                const x = Math.floor(offsetX + col * TILE_WIDTH + rowShift);
                const y = Math.floor(offsetY + row * tileH);

                const flipX = (row + col) % 2 === 1;
                const flipY = row % 2 === 1;

                if (flipX || flipY) {
                  ctx.save();
                  const centerX = x + Math.floor(TILE_WIDTH / 2);
                  const centerY = y + Math.floor(tileH / 2);

                  ctx.translate(centerX, centerY);
                  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
                  
                  ctx.drawImage(
                    video,
                    -Math.floor(TILE_WIDTH / 2) - 1,
                    -Math.floor(tileH / 2) - 1,
                    drawW,
                    drawH
                  );
                  ctx.restore();
                } else {
                  ctx.drawImage(video, x - 1, y - 1, drawW, drawH);
                }
              }
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, videoRef]);

  return videoRef;
}

const DigitGroup: React.FC<{ value: string }> = React.memo(({ value }) => (
  <span className={styles.digitGroup}>
    <span className={styles.digit}>{value[0]}</span>
    <span className={styles.digit}>{value[1]}</span>
  </span>
));
DigitGroup.displayName = 'DigitGroup';

const ZoomClock: React.FC = () => {
  const time = useMillisecondClock();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useVideoTiling(zoomVideo, canvasRef);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { hours, minutes, seconds, isoTime } = useMemo(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      hours: pad(time.getHours()),
      minutes: pad(time.getMinutes()),
      seconds: pad(time.getSeconds()),
      isoTime: time.toISOString(),
    };
  }, [time]);

  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        src={zoomVideo}
        autoPlay
        loop
        muted
        playsInline
        className={styles.videoSource}
      />
      <canvas ref={canvasRef} className={styles.background} />

      <time className={styles.timeDisplay} dateTime={isoTime} aria-label={time.toLocaleTimeString()}>
        <DigitGroup value={hours} />
        <span className={styles.separator}>:</span>
        <DigitGroup value={minutes} />
        <span className={styles.separator}>:</span>
        <DigitGroup value={seconds} />
        <span className={styles.srOnly}>{time.toLocaleTimeString()}</span>
      </time>
    </div>
  );
};

export default ZoomClock;
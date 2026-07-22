import zoomVideo from '@/assets/images/26_images/26-07/26-07-22/zoom.mp4';
import { useSecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useRef } from 'react';

export const assets = [zoomVideo];

const TILE_WIDTH = 380;

const STYLES: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
  timeDisplay: {
    position: 'relative',
    zIndex: 3,
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace",
    color: '#CEEDF8',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    textShadow: '3px 3px rgb(0, 0, 0), -3px -3px rgba(0, 0, 0)',
    // Apply the 14-second continuous zoom cycle
    animation: 'zoomCycle 14s ease-in-out infinite',
    transformOrigin: 'center center',
  },
  digitGroup: {
    display: 'flex',
  },
  digit: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'clamp(3rem, 10vw, 8rem)',
    lineHeight: 1,
  },
  separator: {
    fontSize: 'clamp(2rem, 10vw, 8rem)',
    opacity: 0.8,
    animation: 'pulse 1s ease-in-out infinite',
    margin: '0 -0.15em',
  },
};

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  
  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.3; }
  }

  @keyframes zoomCycle {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(0);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

function useVideoTiling(
  videoSrc: string,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.display = 'none';

    document.body.appendChild(video);
    videoRef.current = video;

    video.play().catch(() => {});

    return () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
      videoRef.current = null;
    };
  }, [videoSrc]);

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
  }, [canvasRef]);
}

const DigitGroup: React.FC<{ value: string }> = React.memo(({ value }) => (
  <span style={STYLES.digitGroup}>
    <span style={STYLES.digit}>{value[0]}</span>
    <span style={STYLES.digit}>{value[1]}</span>
  </span>
));
DigitGroup.displayName = 'DigitGroup';

const ZoomClock: React.FC = () => {
  const time = useSecondClock();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useVideoTiling(zoomVideo, canvasRef);

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
    <div style={STYLES.container}>
      <style>{KEYFRAMES}</style>
      <canvas ref={canvasRef} style={STYLES.background} />

      <time style={STYLES.timeDisplay} dateTime={isoTime}>
        <DigitGroup value={hours} />
        <span style={STYLES.separator}>:</span>
        <DigitGroup value={minutes} />
        <span style={STYLES.separator}>:</span>
        <DigitGroup value={seconds} />
      </time>
    </div>
  );
};

export default ZoomClock;
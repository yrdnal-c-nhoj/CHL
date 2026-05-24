import fontUrl from '@/assets/fonts/26fonts/26-05-23.ttf';
import backgroundVideo from '@/assets/images/26_images/26-05/26-05-23/lava.mp4';
import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/clockUtils';
import { ClockLoadingFallback, useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { Suspense, useEffect, useMemo, useRef } from 'react';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const inlineStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    backgroundColor: '#f37033',
  },
  backgroundContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '500vw',
    height: '500dvh',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    zIndex: 0,
    lineHeight: 0,
    overflow: 'hidden',
  },
  // Replaced the video style with an identical layout style for our lightweight canvases
  videoCanvas: {
    flex: '0 0 auto',
    width: 'auto',
    height: 'auto',
    maxWidth: '100vw',
    maxHeight: '100dvh',
    display: 'block',
  },
  digitsContainer: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100dvh',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  },
  digitBox: {
    fontSize: 'calc(100dvh / 8)',
    fontWeight: 300,
    fontFamily: 'Clock26-04-23, monospace',
    color: '#f20a0a',
    textShadow: '0 3px 2px rgba(2, 46, 27, 0.963)',
    lineHeight: 0.9,
    fontVariantNumeric: 'tabular-nums',
  },
};

const ClockInner: React.FC = () => {
  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'Clock26-04-23', fontUrl: fontUrl }],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  const time = useClockTime();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Create exactly ONE master video element in memory
    const masterVideo = document.createElement('video');
    masterVideo.src = backgroundVideo;
    masterVideo.muted = true;
    masterVideo.loop = true;
    masterVideo.playsInline = true;
    masterVideo.autoplay = true;
    masterVideo.preload = 'auto';

    // 2. Query all our layout canvases once they render
    const canvases = containerRef.current?.querySelectorAll('canvas');
    if (!canvases) return;

    let animationFrameId: number;
    let isDimensSet = false;

    const renderLoop = () => {
      if (masterVideo.readyState >= masterVideo.HAVE_CURRENT_DATA) {
        canvases.forEach((canvas) => {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Dynamically set canvas drawing dimensions to match the video native aspect ratio once
          if (!isDimensSet) {
            canvas.width = masterVideo.videoWidth;
            canvas.height = masterVideo.videoHeight;
          }

          // Blit the single decoded frame across all 121 canvas spots instantly
          ctx.drawImage(masterVideo, 0, 0, canvas.width, canvas.height);
        });
        isDimensSet = true;
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    masterVideo.play().then(() => {
      renderLoop();
    }).catch(err => console.log("Video playback waiting for user interaction:", err));

    return () => {
      cancelAnimationFrame(animationFrameId);
      masterVideo.pause();
      masterVideo.src = '';
      masterVideo.load();
    };
  }, []);

  const hours24 = time.getHours();
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';

  const h = formatTime(hours12);
  const m = formatTime(time.getMinutes());
  const s = formatTime(time.getSeconds());

  const allDigits = (h + m + s + ampm).split('');

  return (
    <div style={inlineStyles.container}>
      {/* Kept your exact CSS Grid layout system intact */}
      <div ref={containerRef} style={inlineStyles.backgroundContainer}>
        {Array.from({ length: 121 }).map((_, i) => (
          <canvas
            key={i}
            style={inlineStyles.videoCanvas}
          />
        ))}
      </div>

      <main style={inlineStyles.digitsContainer}>
        {allDigits.map((digit, index) => (
          <span key={index} style={inlineStyles.digitBox}>
            {digit}
          </span>
        ))}
      </main>
    </div>
  );
};

const Clock: React.FC = () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <ClockInner />
  </Suspense>
);

export default Clock;
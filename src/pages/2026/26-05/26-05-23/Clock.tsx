import fontUrl from '@/assets/fonts/26fonts/26-05-23.ttf';
import lavaVideoSrc from '@/assets/images/26_images/26-05/26-05-23/lava.mp4';
import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/clockUtils';
import { ClockLoadingFallback, useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const inlineStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoContainer: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  video: {
    width: '100%',
    height: '100%',
    maxWidth: '100vw',
    maxHeight: '100dvh',
    objectFit: 'contain',     // No clipping - full video visible
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
    () => [{ fontFamily: 'Clock26-04-23', fontUrl }],
    []
  );

  useSuspenseFontLoader(fontConfigs);
  const time = useClockTime();
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = lavaVideoSrc;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';

    const handleCanPlay = () => setIsReady(true);

    video.addEventListener('canplay', handleCanPlay);

    video.play().catch(console.log);

    return () => {
      video.pause();
      video.removeEventListener('canplay', handleCanPlay);
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
      {/* Single Fullscreen Video */}
      <div style={inlineStyles.videoContainer}>
        <video
          ref={videoRef}
          style={inlineStyles.video}
          muted
          loop
          playsInline
        />
      </div>

      {/* Clock Digits */}
      <main style={inlineStyles.digitsContainer}>
        {allDigits.map((digit, index) => (
          <span key={index} style={inlineStyles.digitBox}>
            {digit}
          </span>
        ))}
      </main>

      {/* Loading Overlay */}
      {!isReady && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '1.2rem',
          }}
        >
          Loading lava atmosphere...
        </div>
      )}
    </div>
  );
};

const Clock: React.FC = () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <ClockInner />
  </Suspense>
);

export default Clock;
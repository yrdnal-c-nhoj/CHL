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

  videoStack: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    zIndex: 0,
  },

  videoSlot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    flex: '0 0 auto',
  },

  video: {
    width: 'auto',
    height: 'auto',
    maxWidth: '100vw',
    maxHeight: '100dvh',
    objectFit: 'contain',
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

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];

    videos.forEach((video) => {
      video.src = lavaVideoSrc;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'auto';
    });

    const handleCanPlay = () => setIsReady(true);

    videos.forEach(v => v.addEventListener('canplay', handleCanPlay));

    Promise.all(videos.map(v => v.play().catch(console.log)))
      .then(() => setIsReady(true));

    return () => {
      videos.forEach(v => {
        v.pause();
        v.removeEventListener('canplay', handleCanPlay);
      });
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
      <div style={inlineStyles.videoStack}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={inlineStyles.videoSlot}>
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              style={inlineStyles.video}
              muted
              loop
              playsInline
            />
          </div>
        ))}
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
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          fontSize: '1.2rem'
        }}>
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
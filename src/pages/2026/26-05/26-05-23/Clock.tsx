import fontUrl from '@/assets/fonts/26fonts/26-05-23.ttf';
import lavaVideoSrc from '@/assets/images/26_images/26-05/26-05-23/lava.mp4';
import type { FontConfig } from '@/types/clock';
import { ClockLoadingFallback, useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets: string[] = [lavaVideoSrc, fontUrl];

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
    fontFamily: 'Clock26-05-23, monospace',
    color: '#f20a0a',
    textShadow: '0 3px 2px rgba(2, 46, 27, 0.963)',
    lineHeight: 0.9,
    fontVariantNumeric: 'tabular-nums',
  },
};

const ClockInner: React.FC = () => {
  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'Clock26-05-23', fontUrl }],
    []
  );

  useSuspenseFontLoader(fontConfigs);
  const time = useClockTime();
  const [isReady, setIsReady] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    if (videos.length === 0) return;

    videos.forEach((video) => {
      video.src = lavaVideoSrc;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.play().catch(() => {});
    });

    const handleCanPlay = () => setIsReady(true);
    videos[0]?.addEventListener('canplay', handleCanPlay);

    return () => {
      videos.forEach((v) => v.pause());
      videos[0]?.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const hours24 = time.getHours();
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const h = formatTime(hours12);
  const m = formatTime(time.getMinutes());
  const s = formatTime(time.getSeconds());
  const allDigits = (h + m + s + ampm).split('');
  const isoTime = time.toISOString();

  return (
    <div style={inlineStyles.container}>
      {/* Tiled Maximized Videos */}
      <div style={inlineStyles.videoStack}>
        {[...Array(12)].map((_, i) => (
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
      <time dateTime={isoTime} style={inlineStyles.digitsContainer}>
        {allDigits.map((digit, index) => (
          <span key={index} style={inlineStyles.digitBox}>
            {digit}
          </span>
        ))}
      </time>

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
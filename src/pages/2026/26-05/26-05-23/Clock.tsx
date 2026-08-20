import fontUrl from '@/assets/fonts/26fonts/26-05-23.ttf?url';
import lavaVideoSrc from '@/assets/images/26_images/26-05/26-05-23/lava.mp4';
import type { FontConfig } from '@/types/clock';
import { ClockLoadingFallback, useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { Suspense, useEffect, useMemo, useRef, useState, memo } from 'react';
import styles from './Clock.module.css';

export const assets: string[] = [lavaVideoSrc, fontUrl];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const ClockInner =  () => {
  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'Clock26-05-23', fontUrl }],
    []
  );

  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();
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
    <main className={styles.container}>
      <time dateTime={isoTime} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      {/* Tiled Maximized Videos */}
      <div className={styles.videoStack}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={styles.videoSlot}>
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              className={styles.video}
              muted
              loop
              playsInline
            />
          </div>
        ))}
      </div>

      {/* Clock Digits */}
      <time dateTime={isoTime} className={styles.digitsContainer}>
        {allDigits.map((digit, index) => (
          <span key={index} className={styles.digitBox}>
            {digit}
          </span>
        ))}
      </time>

      {/* Loading Overlay */}
      {!isReady && (
        <div
          className={styles.loadingOverlay}
        >
          Loading lava atmosphere...
        </div>
      )}
    </main>
  );
};

const Clock =  () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <ClockInner />
  </Suspense>
);

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_05_23';
export default MemoizedClock;

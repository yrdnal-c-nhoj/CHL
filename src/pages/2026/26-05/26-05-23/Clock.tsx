import fontUrl from '@/assets/fonts/26fonts/26-05-23.ttf';
import backgroundVideo from '@/assets/images/26_images/26-05/26-05-23/lava.mp4';
import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/clockUtils';
import {
  ClockLoadingFallback,
  useSuspenseFontLoader,
} from '@/utils/fontLoader';
import React, { Suspense, useMemo } from 'react';
import styles from './Clock.module.css';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const ClockInner: React.FC = () => {
  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'Clock26-04-23', fontUrl: fontUrl }],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  const time = useClockTime();

  const hours24 = time.getHours();
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';

  const h = formatTime(hours12);
  const m = formatTime(time.getMinutes());
  const s = formatTime(time.getSeconds());

  // Compose characters for the vertical sequence (Hours, Minutes, Seconds, AM/PM)
  const allDigits = (h + m + s + ampm).split('');

  return (
    <div className={styles.container}>
      <div className={styles.backgroundContainer}>
        {Array.from({ length: 121 }).map((_, i) => (
          <video
            key={i}
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ))}
      </div>

      <main className={styles.digitsContainer}>
        {allDigits.map((digit, index) => (
          <span key={index} className={styles.digitBox}>
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

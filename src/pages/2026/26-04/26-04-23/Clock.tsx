import React, { Suspense, useMemo } from 'react';
import backgroundVideo from '@/assets/images/26_images/26-04/26-04-23/sunflower.mp4';
import fontUrl from '@/assets/fonts/26fonts/26-04-23.otf';
import { useSmoothClock } from '@/utils/hooks';
import {
  useSuspenseFontLoader,
  ClockLoadingFallback,
} from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';
export const assets = [backgroundVideo, fontUrl];


const formatTime = (num: number): string => num.toString().padStart(2, '0');
const formatMs = (num: number): string => num.toString().padStart(3, '0');

const ClockInner =  () => {
  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'Clock26-04-23', fontUrl }],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  const time = useSmoothClock();

  const h = formatTime(time.getHours());
  const m = formatTime(time.getMinutes());
  const s = formatTime(time.getSeconds());
  const ms = formatMs(time.getMilliseconds());

  // Join them to treat the milliseconds as part of the sequence
  const allDigits = (h + m + s + ms).split('');

  return (
    <div className={styles.container}>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

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

const Clock =  () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <ClockInner />
  </Suspense>
);

export default Clock;

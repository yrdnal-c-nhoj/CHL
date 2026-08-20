import fontUrl from '@/assets/fonts/26fonts/26-06-07.ttf?url';
import backgroundVideo from '@/assets/images/26_images/26-06/26-06-07/spacewalk.mp4';
import type { FontConfig } from '@/types/clock';
import {
  ClockLoadingFallback,
  useSuspenseFontLoader,
} from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { Suspense, useEffect, useMemo, useState, memo } from 'react';
import styles from './Clock.module.css';

export const assets = [backgroundVideo, fontUrl];

export const fontConfigs: FontConfig[] = [
  { fontFamily: 'Clock26-06-07', fontUrl },
];

const formatTime = (num: number): string => num.toString().padStart(2, '0');
const formatMs = (num: number): string => num.toString().padStart(3, '0');

const ClockInner =  () => {
  useSuspenseFontLoader(fontConfigs);

  const time = useMillisecondClock();

  const h = formatTime(time.getHours());
  const m = formatTime(time.getMinutes());
  const s = formatTime(time.getSeconds());

  const ms = formatMs(time.getMilliseconds());
  const ms2 = ms.slice(0, 2);
  const allDigits = (h + m + s + ms2).split('');

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

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
    </main>
  );
};

const Clock =  () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <ClockInner />
  </Suspense>
);

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_06_07';
export default MemoizedClock;

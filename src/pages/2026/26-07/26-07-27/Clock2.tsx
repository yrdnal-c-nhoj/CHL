import fontUrl from '@/assets/fonts/26fonts/26-07-29.otf?url';
import backgroundVideo from '@/assets/images/26_images/26-07/26-07-29/eiffel.mp4';
import type { FontConfig } from '@/types/clock';
import {
  ClockLoadingFallback,
  useSuspenseFontLoader,
} from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { Suspense } from 'react';
import styles from './Clock.module.css';

export const assets = [backgroundVideo, fontUrl];

export const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_07_29', fontUrl },
];

const formatTime = (num: number): string => num.toString().padStart(2, '0');
const formatMs = (num: number): string => num.toString().padStart(3, '0');

const ClockInner: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);

  const time = useMillisecondClock();

  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());
  const milliseconds = formatMs(time.getMilliseconds()).slice(0, 2);
  const allDigits = (hours + minutes + seconds + milliseconds).split('');

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

      {/* Accessible time element as per ARCHITECTURE.md */}
      <time dateTime={time.toISOString()} className={styles.semanticTime}>
        {time.toLocaleTimeString()}
      </time>
    </div>
  );
};

const Clock: React.FC = () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <ClockInner />
  </Suspense>
);

const MemoizedClock = React.memo(Clock);
MemoizedClock.displayName = 'Clock_26_07_29';

export default MemoizedClock;

import React, { useMemo } from 'react';

import northImage from '@/assets/images/26_images/26-06/26-06-04/nort.webp';
import animalsVideo from '@/assets/images/26_images/26-06/26-06-04/north.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';

import styles from './Clock.module.css';

// Preload visual assets; videos are excluded from preloading per architecture
export const assets = [northImage];

const fontUrl = new URL(
  '../../../../assets/fonts/26fonts/26-06-04-north.ttf',
  import.meta.url,
).href;

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_04',
    fontUrl,
  },
];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock =  () => {
  const time = useSmoothClock();
  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, ampm } = useMemo(() => {
    const h24 = time.getHours();
    const h12 = h24 % 12 || 12;
    const ampmStr = h24 >= 12 ? 'PM' : 'AM';
    const h = formatTime(h12);
    const m = formatTime(time.getMinutes());
    return { hours: h, minutes: m, ampm: ampmStr };
  }, [time]);

  return (
    <main className={styles.container}>
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        src={animalsVideo}
      />
      <img
        src={northImage}
        alt=""
        className={styles.backgroundImage}
        decoding="async"
      />
      <time 
        dateTime={time.toISOString()} 
        className={styles.clock} 
        aria-label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      >
        <span className={styles.srOnly}>{time.toLocaleTimeString()}</span>
        <span className={styles.digit}>{hours[0]}</span>
        <span className={styles.digit}>{hours[1]}</span>
        <span className={styles.digit}>{minutes[0]}</span>
        <span className={styles.digit}>{minutes[1]}</span>
        <span className={`${styles.digit} ${styles.ampm}`}>{ampm[0]}</span>
        <span className={`${styles.digit} ${styles.ampm}`}>{ampm[1]}</span>
      </time>
    </main>
  );
};

const MemoizedClock = React.memo(Clock);
MemoizedClock.displayName = 'Clock_26_06_04';
export default MemoizedClock;

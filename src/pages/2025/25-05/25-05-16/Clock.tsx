import React from 'react';

import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

import braiFont from '@/assets/fonts/25fonts/25-05-16-brai.ttf';
import styles from './Clock.module.css';

export const assets = [];

const fontConfigs: FontConfig[] = [
    {
      fontFamily: 'brai',
      fontUrl: braiFont,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  const pad = (n: number) => n.toString().padStart(2, '0');

  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  return (
    <main
        className={styles.container}
        role="timer"
        aria-live="polite"
        aria-label={`Current time is ${hours} hours, ${minutes} minutes, and ${seconds} seconds`}
      >
        <time dateTime={time.toISOString()} className={styles.srOnly}>
          {time.toLocaleTimeString()}
        </time>
        <div className={styles.segment}>
          <div className={styles.timePart}>{hours}</div>
        </div>
        <div className={styles.segment}>
          <div className={styles.timePart}>{minutes}</div>
        </div>
        <div className={styles.segment}>
          <div className={styles.timePart}>{seconds}</div>
        </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_05_16';

export default MemoizedClock;

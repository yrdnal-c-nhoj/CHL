import React from 'react';

import semFont from '@/assets/fonts/25fonts/25-05-21-sem.ttf';
import background from '@/assets/images/25_images/25-05/25-05-21/signals.jpg';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

const fontConfigs: FontConfig[] = [
    {
      fontFamily: 'sem',
      fontUrl: semFont,
      options: { weight: 'normal', style: 'normal' },
    },
  ];

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  const getDigits = (value: number) => String(value).padStart(2, '0').split('');
  const [hourTens, hourUnits] = getDigits(time.getHours());
  const [minuteTens, minuteUnits] = getDigits(time.getMinutes());
  const [secondTens, secondUnits] = getDigits(time.getSeconds());

  return (
    <main className={styles.container}>
      <div className={styles.bg} style={{ backgroundImage: `url(${background})` }} />
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.clockFace} role="timer" aria-live="off">
        <div className={styles.timeGroup}>
          <div className={styles.digit}>{hourTens}</div>
          <div className={styles.digit}>{hourUnits}</div>
        </div>
        <div className={styles.timeGroup}>
          <div className={styles.digit}>{minuteTens}</div>
          <div className={styles.digit}>{minuteUnits}</div>
        </div>
        <div className={styles.timeGroup}>
          <div className={styles.digit}>{secondTens}</div>
          <div className={styles.digit}>{secondUnits}</div>
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_05_21';

export default MemoizedClock;

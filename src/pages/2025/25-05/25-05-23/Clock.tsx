import React from 'react';

import crossFont from '@/assets/fonts/25fonts/25-05-23-Cross.otf';
import backgroundImage from '@/assets/images/25_images/25-05/25-05-23/blank.jpg';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'Cross',
    fontUrl: crossFont,
    options: { weight: 'normal', style: 'normal' },
  },
];

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  const formatTime = () => {
    let hours = time.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return {
      hours: String(hours),
      minutes: String(time.getMinutes()).padStart(2, '0'),
      seconds: String(time.getSeconds()).padStart(2, '0'),
      ampm,
    };
  };
  const { hours, minutes, seconds, ampm } = formatTime();

  const renderUnit = (value: string) => (
    <div className={styles.unit}>
      {value.split('').map((char, idx) => (
        <span key={idx} className={styles.digit}>
          {char}
        </span>
      ))}
    </div>
  );

  return (
    <main className={styles.container}>
      <img decoding="async" loading="lazy" src={backgroundImage} alt="" className={styles.bg} />
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.clockFace} role="timer" aria-live="off">
        {renderUnit(hours)}
        {renderUnit(minutes)}
        {renderUnit(seconds)}
        <div className={styles.ampm}>{ampm}</div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_05_23';

export default MemoizedClock;

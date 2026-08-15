import React from 'react';

import bluFont from '@/assets/fonts/25fonts/25-05-18-blu.otf'; // local font
import image1 from '@/assets/images/25_images/25-05/25-05-18/13966281486_Volantis_Tumblr.gif'; // bottom layer
import image2 from '@/assets/images/25_images/25-05/25-05-18/8mMt.gif'; // middle layer
import image3 from '@/assets/images/25_images/25-05/25-05-18/bloo.gif'; // top layer
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

export const assets = [bluFont, image1, image2, image3];

const fontConfigs: FontConfig[] = [
    {
      fontFamily: 'blu',
      fontUrl: bluFont,
      options: { weight: 'normal', style: 'normal' },
    },
  ];

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  // Format time with leading zeros
  const formatTime = (unit: number) => String(unit).padStart(2, '0');
  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  return (
    <main className={styles.container}>
      <img decoding="async" loading="lazy" src={image1} alt="" className={styles.image1} />
      <img decoding="async" loading="lazy" src={image2} alt="" className={styles.image2} />
      <img decoding="async" loading="lazy" src={image3} alt="" className={styles.image3} />
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.clock} role="timer" aria-live="off">
        <span className={styles.digit}>{hours[0]}</span>
        <span className={styles.digit}>{hours[1]}</span>
        <span className={styles.digit}>{minutes[0]}</span>
        <span className={styles.digit}>{minutes[1]}</span>
        <span className={styles.digit}>{seconds[0]}</span>
        <span className={styles.digit}>{seconds[1]}</span>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_05_18';

export default MemoizedClock;

import React from 'react';

import issFont from '@/assets/fonts/25fonts/25-05-30-iss.ttf';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';

import styles from './Clock.module.css';

export const assets = [];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'iss',
    fontUrl: issFont,
    options: { weight: 'normal', style: 'normal' },
  },
];

const ISS_LIVE_VIDEO_ID = 'jKHvbJe9c_Y';

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);

  const time = useSmoothClock();

  const formatDigit = (value: number): string[] =>
    String(value).padStart(2, '0').split('');

  const [h1, h2] = formatDigit(time.getHours());
  const [m1, m2] = formatDigit(time.getMinutes());
  const [s1, s2] = formatDigit(time.getSeconds());

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <iframe
        src={`https://www.youtube.com/embed/${ISS_LIVE_VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ISS_LIVE_VIDEO_ID}&rel=0&modestbranding=1`}
        title="International Space Station video feed"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        className={styles.backgroundIframe}
        tabIndex={-1}
      />

      <div className={styles.clockWrapper}>
        <div className={styles.clockContainer} aria-hidden="true">
          <div className={styles.digitBox}>{h1}</div>
          <div className={styles.digitBox}>{h2}</div>
          <div className={styles.digitBox}>{m1}</div>
          <div className={styles.digitBox}>{m2}</div>
          <div className={styles.digitBox}>{s1}</div>
          <div className={styles.digitBox}>{s2}</div>
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_05_30';

export default MemoizedClock;

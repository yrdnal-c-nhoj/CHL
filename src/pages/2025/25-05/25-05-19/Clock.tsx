import React from 'react';

import antFontUrl from '@/assets/fonts/25fonts/25-05-19-Ant.ttf';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';

import styles from './Clock.module.css';

export const assets = [antFontUrl];

const fontConfigs: FontConfig[] = [
    {
      fontFamily: 'Ant',
      fontUrl: antFontUrl,
      options: { weight: 'normal', style: 'normal' },
    },
  ];

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useSmoothClock();

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

  const radius = 45; // percent from center for numbers

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.bg2} />
      <div className={styles.bg1} />
      <div className={styles.clockFace} role="timer" aria-live="off">
        <div className={styles.clockCenter}>
          {/* Numbers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i + 1) * 30;
            const rad = (angle * Math.PI) / 180;
            const style = {
              left: `${50 + radius * Math.sin(rad)}%`,
              top: `${50 - radius * Math.cos(rad)}%`,
            };
            return (
              <div key={i} style={style} className={styles.number}>
                {i + 1}
              </div>
            );
          })}
          {/* Hour Hand */}
          <div
            className={styles.hourHand}
            style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
          />
          {/* Minute Hand */}
          <div
            className={styles.minuteHand}
            style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
          />
          {/* Second Hand */}
          <div
            className={styles.secondHand}
            style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
          />
          {/* Center Dot */}
          <div className={styles.centerDot} />
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_05_19';

export default MemoizedClock;

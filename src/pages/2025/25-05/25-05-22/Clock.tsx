import React from 'react';

import dirFontUrl from '@/assets/fonts/25fonts/25-05-22-Dir.ttf';
import sunGif from '@/assets/images/25_images/25-05/25-05-22/sun.gif'; // Use static import
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

export const assets = [dirFontUrl, sunGif];

const romanNumerals = [
  'XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI',
];

const fontConfigs: FontConfig[] = [
    {
      fontFamily: 'Dir',
      fontUrl: dirFontUrl,
      options: { weight: 'normal', style: 'normal' },
    },
  ];

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  const sec = time.getSeconds();
  const min = time.getMinutes();
  const hr = time.getHours();

  const secondDeg = sec * 6;
  const minuteDeg = min * 6 + sec * 0.1;
  const hourDeg = (hr % 12) * 30 + min * 0.5;

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <img decoding="async" loading="lazy" src={sunGif} alt="" className={styles.sun} />
      <div className={styles.clockFace} role="timer" aria-live="off">
        <div className={styles.clock}>
          {romanNumerals.map((num, i) => {
            const angleDeg = i * 30;
            const angleRad = angleDeg * (Math.PI / 180);
            const radius = 43;
            const x = 50 + radius * Math.sin(angleRad);
            const y = 50 - radius * Math.cos(angleRad);
            const style = {
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
            };
            return (
              <div key={i} style={style} className={styles.numeral}>
                {num}
              </div>
            );
          })}
          <div className={styles.hourHand} style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }} />
          <div className={styles.minuteHand} style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }} />
          <div className={styles.secondHand} style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }} />
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_05_22';

export default MemoizedClock;

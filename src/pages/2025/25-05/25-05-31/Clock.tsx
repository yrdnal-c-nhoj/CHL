import React from 'react';

import fatFont from '@/assets/fonts/25fonts/25-05-31-fat.otf';
import elWebp from '@/assets/images/25_images/25-05/25-05-31/el.webp';
import el1 from '@/assets/images/25_images/25-05/25-05-31/el1.png';
import el2 from '@/assets/images/25_images/25-05/25-05-31/el2.png';
import el3 from '@/assets/images/25_images/25-05/25-05-31/el3.png';
import eleGif from '@/assets/images/25_images/25-05/25-05-31/ele.gif';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';

import styles from './Clock.module.css';

export const assets = [elWebp, el1, el2, el3, eleGif, fatFont];

const fontConfigs: FontConfig[] = [
    {
      fontFamily: 'fat',
      fontUrl: fatFont,
      options: { weight: 'normal', style: 'normal' },
    },
  ];

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useSmoothClock(50); // Update at a reasonable frame rate

  const t = time.getTime();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  // Replicate original animation logic in a declarative way
  const secondDeg = seconds * 6 + 5 * Math.sin(t / 150);
  const hourDeg = hours * 30 + 3 * Math.sin(t * 0.001);
  const minuteDeg = minutes * 6 + 4 * Math.sin(t * 0.002);
  const orbitAngle = (t * -0.12) % 360;

  const orbitRadius = 40;
  const orbitRad = (orbitAngle * Math.PI) / 180;
  const orbitX = 50 + orbitRadius * Math.cos(orbitRad);
  const orbitY = 50 + orbitRadius * Math.sin(orbitRad);

  const orbitStyle = {
    left: `${orbitX}%`,
    top: `${orbitY}%`,
    transform: `translate(-50%, -50%) rotate(${orbitAngle + 90}deg)`,
  };

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <img decoding="async" loading="lazy" src={elWebp} alt="" className={styles.bg} />
      <div className={styles.clockFace}>
        <div className={styles.clockCenter}>
          {Array.from({ length: 12 }, (_, i) => {
            const num = i + 1;
            const angle = (num * 30 * Math.PI) / 180;
            const x = 50 + 40 * Math.sin(angle) * (80 / 60);
            const y = 50 - 40 * Math.cos(angle);
            return (
              <div key={num} style={{ left: `${x}%`, top: `${y}%` }} className={styles.number}>
                {num}
              </div>
            );
          })}
          <div className={styles.handContainer}>
            <img src={el2} alt="" className={styles.hourHand} style={{ transform: `translate(-50%, -50%) rotate(${hourDeg}deg)` }} />
          </div>
          <div className={styles.handContainer}>
            <img src={el1} alt="" className={styles.minuteHand} style={{ transform: `translate(-50%, -50%) rotate(${minuteDeg}deg)` }} />
          </div>
          <div className={styles.handContainer}>
            <img src={el3} alt="" className={styles.secondHand} style={{ transform: `translate(-50%, -50%) rotate(${secondDeg}deg)` }} />
          </div>
          <img src={eleGif} alt="" aria-hidden="true" className={styles.orbitingImage} style={orbitStyle} />
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_05_31';

export default MemoizedClock;

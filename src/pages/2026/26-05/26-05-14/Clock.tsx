import React, { useMemo } from 'react';
import { useClock } from '@/utils/hooks/useClock';
import styles from './Clock.module.css';

export const assets = [];

const AnalogClock: React.FC = () => {
  const { time: currentTime } = useClock();

  const rotations = useMemo(() => {
    const ms = currentTime.getMilliseconds();
    const s = currentTime.getSeconds() + ms / 1000;
    const m = currentTime.getMinutes() + s / 60;
    const h = (currentTime.getHours() % 12) + m / 60;

    return {
      hr: h * 30,
      min: m * 6,
      sec: s * 6,
    };
  }, [currentTime]);

  return (
    <main className={styles.container}>
      <time className={styles.clockBody} dateTime={currentTime.toISOString()}>
        {[...Array(12)].map((_, i) => {
          const val = i === 0 ? 12 : i;
          const angle = i * 30;
          return (
            <div
              key={i}
              className={styles.numeral}
              style={{ transform: `rotate(${angle}deg) translateY(-38vmin)` }}
            >
              <span style={{ transform: `rotate(-${angle}deg)` }}>{val}</span>
            </div>
          );
        })}

        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ transform: `rotate(${rotations.hr}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ transform: `rotate(${rotations.min}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ transform: `rotate(${rotations.sec}deg)` }}
        />

        <div className={styles.centerPivot} />
      </time>
    </main>
  );
};

export default AnalogClock;

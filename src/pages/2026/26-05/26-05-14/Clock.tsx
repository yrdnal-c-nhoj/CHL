import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/hooks';
import backgroundImage from '@/assets/images/26-05/26-05-14/bg.webp';
import styles from './Clock.module.css';

export const assets = [backgroundImage];

const AnalogClock: React.FC = () => {
  const time = useClockTime();

  const rotations = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds() + ms / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;

    return {
      hr: h * 30,
      min: m * 6,
      sec: s * 6,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <img
        src={backgroundImage}
        alt=""
        className={styles.backgroundImage}
        aria-hidden="true"
      />
      <time className={styles.clockBody} dateTime={time.toISOString()}>
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

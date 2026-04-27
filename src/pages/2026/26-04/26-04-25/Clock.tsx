import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';
import bgImage from '@/assets/images/2026/26-04/26-04-25/magnify.jpg';

const Clock: React.FC = () => {
  const time = useClockTime();

  const angles = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    const ms = time.getMilliseconds();

    const secondsWithMs = s + ms / 1000;

    return {
      hour: ((h % 12) + m / 60) * 30,
      minute: (m + s / 60) * 6,
      second: secondsWithMs * 6,
    };
  }, [time]);

  return (
    <div className={styles.container}>
      <img src={bgImage} alt="" className={styles.bgImage} />
      <div className={styles.clockFace}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={styles.tickMarkContainer}
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={styles.tickMark} />
          </div>
        ))}

        <div
          className={`${styles.handBase} ${styles.hourHand}`}
          style={{ transform: `rotate(${angles.hour}deg)` }}
        />
        <div
          className={`${styles.handBase} ${styles.minuteHand}`}
          style={{ transform: `rotate(${angles.minute}deg)` }}
        />
        <div
          className={`${styles.handBase} ${styles.secondHand}`}
          style={{ transform: `rotate(${angles.second}deg)` }}
        />

        <div className={styles.centerDot} />
      </div>
    </div>
  );
};

export default Clock;
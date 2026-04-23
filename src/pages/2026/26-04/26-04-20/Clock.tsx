import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import bgImg from '@/assets/images/2026/26-04/26-04-20/bstream.gif';
import styles from './Clock.module.css'; // Import CSS Modules

export const assets = [bgImg];

const Clock: React.FC = () => {
  const time = useClockTime();

  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    const h = time.getHours() % 12;
    const m = time.getMinutes();
    const s = time.getSeconds();
    return {
      hourDeg: (h * 30) + (m * 0.5),
      minuteDeg: m * 6,
      secondDeg: s * 6,
    };
  }, [time]);

  return (
    <div className={styles.container}>
      <div className={styles.bg} style={{ backgroundImage: `url(${bgImg})` }} />
      <div className={styles.clockFace}>
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
        />
        <div className={styles.centerDot} />
      </div>
    </div>
  );
};

export default Clock;

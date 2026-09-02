import React, { useMemo } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import bgImg from '@/assets/images/26_images/26-04/26-04-20/bstream.gif';
import styles from './Clock.module.css'; // Import CSS Modules

export const assets = [bgImg];

const Clock =  () => {
  const time = useSmoothClock();

  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    const h = time.getHours() % 12;
    const m = time.getMinutes();
    const s = time.getSeconds();
    return {
      hourDeg: h * 30 + m * 0.5,
      minuteDeg: m * 6,
      secondDeg: s * 6,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div className={styles.bg} style={{ backgroundImage: `url(${bgImg})` }} />
      <div className={styles.clockFace}>
        <div className={`${styles.hand} ${styles.hourHand}`} style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }} />
        <div className={`${styles.hand} ${styles.minuteHand}`} style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }} />
        <div className={`${styles.hand} ${styles.secondHand}`} style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }} />
        <div className={styles.centerDot} />
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_04_20';
export default MemoizedClock;

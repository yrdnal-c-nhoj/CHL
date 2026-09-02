import React, { useMemo, memo } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import videoBg from '@/assets/images/26_images/26-04/26-04-22/steamroller.mp4';
import styles from './Clock.module.css';

export const assets = [videoBg];

const Clock =  () => {
  const time = useSmoothClock();

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const h = time.getHours() % 12;
    const m = time.getMinutes();
    const s = time.getSeconds();
    return {
      hourAngle: h * 30 + m * 0.5,
      minuteAngle: m * 6,
      secondAngle: s * 6,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div className={styles.contentBox}>
        <video
          src={videoBg}
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={styles.clockContainer}>
          <div className={styles.clockFace}>
            <div className={styles.twelveDot} />
            <div className={`${styles.handBase} ${styles.hourHand}`} style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />
            <div className={`${styles.handBase} ${styles.minuteHand}`} style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
            <div className={`${styles.handBase} ${styles.secondHand}`} style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }} />
            <div className={styles.centerDot} />
          </div>
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_04_22';
export default MemoizedClock;

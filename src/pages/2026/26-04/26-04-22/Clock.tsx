import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import videoBg from '@/assets/images/2026/26-04/26-04-22/steamroller.mp4';
import styles from './Clock.module.css';

export const assets = [videoBg];

const Clock: React.FC = () => {
  const time = useClockTime();

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const h = time.getHours() % 12;
    const m = time.getMinutes();
    const s = time.getSeconds();
    return {
      hourAngle: (h * 30) + (m * 0.5),
      minuteAngle: m * 6,
      secondAngle: s * 6,
    };
  }, [time]);

  return (
    <div className={styles.container}>
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
    </div>
  );
};

export default Clock;

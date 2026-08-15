import hourHandImage from '@/assets/images/25_images/25-09/25-09-02/arm1.gif';
import minuteHandImage from '@/assets/images/25_images/25-09/25-09-02/arm2.gif';
import secondHandImage from '@/assets/images/25_images/25-09/25-09-02/arm3.gif';
import bgImage from '@/assets/images/25_images/25-09/25-09-02/lp.webp';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports
export const assets = [bgImage, hourHandImage, minuteHandImage, secondHandImage];

const ClockComponent =  () => {
  const time = useMillisecondClock();

  const { hourAngle, minAngle, secAngle } = useMemo(() => {
    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    return {
      secAngle: (seconds / 60) * 360,
      minAngle: (minutes / 60) * 360,
      hourAngle: (hours / 12) * 360,
    };
  }, [time]);

  const handStyle = (angle: number) => ({
    transform: `rotate(${angle}deg)`,
  });

  return (
    <main
      className={styles.container}
      style={{ '--bg-image': `url(${bgImage})` } as React.CSSProperties}
    >
      {/* Accessible time element */}
      <time dateTime={time.toISOString()} className={styles.semanticTime} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.clockFace}>
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={
            {
              '--bg-image': `url(${hourHandImage})`,
              ...handStyle(hourAngle),
            } as React.CSSProperties
          }
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={
            {
              '--bg-image': `url(${minuteHandImage})`,
              ...handStyle(minAngle),
            } as React.CSSProperties
          }
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={
            {
              '--bg-image': `url(${secondHandImage})`,
              ...handStyle(secAngle),
            } as React.CSSProperties
          }
        />
      </div>
    </main>
  );
}

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_09_02';

export default MemoizedClock;

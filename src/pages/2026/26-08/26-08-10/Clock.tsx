import hourHandImage from '@/assets/images/26_images/26-08/26-08-10/hour-hand.webp';
import minuteHandImage from '@/assets/images/26_images/26-08/26-08-10/minute-hand.webp';
import secondHandImage from '@/assets/images/26_images/26-08/26-08-10/second-hand.webp';

import straw2Image from '@/assets/images/26_images/26-08/26-08-10/str.webp';
import strawImage from '@/assets/images/26_images/26-08/26-08-10/straw.webp';
import { useClockAngles } from '@/hooks/useClockAngles'; // This hook already supports millisecond precision
import { useSmoothClock } from '@/utils/hooks';
import { memo, useMemo } from 'react';
import styles from './Clock.module.css';

export const assets: string[] = [
  strawImage,
  hourHandImage,
  minuteHandImage,
  secondHandImage,
];

const ClockComponent =  () => {
  const time = useSmoothClock(); // Changed to useSmoothClock for smooth second hand movement
  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  const { timeString } = useMemo(() => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');

    return {
      timeString: `${hours}:${minutes}:${seconds}`,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <img
        src={strawImage}
        className={styles.backgroundImage}
        alt="Straw texture background"
      />
       <img
        src={straw2Image}
        className={styles.backgroundImage2}
        alt="Straw texture background"
      />
      <div className={styles.analogClock}>
        <div className={styles.face}>
          <img
            src={hourHandImage}
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
            alt="Hour hand"
          />
          <img
            src={minuteHandImage}
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ transform: `translateX(-50%) rotate(${minAngle}deg)` }}
            alt="Minute hand"
          />
          <img
            src={secondHandImage}
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `translateX(-50%) rotate(${secAngle}deg)` }}
            alt="Second hand"
          />
          <div className={styles.centerDot} />
        </div>
      </div>

      {/* Screen-reader only accessible time */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {timeString}
      </time>
    </main>
  );
};

const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_10';

export default MemoizedClock;
import hourHandImage from '@/assets/images/26_images/26-08/26-08-10/hour-hand.webp';
import minuteHandImage from '@/assets/images/26_images/26-08/26-08-10/minute-hand.webp';
import secondHandImage from '@/assets/images/26_images/26-08/26-08-10/second-hand.webp';
import strawImage from '@/assets/images/26_images/26-08/26-08-10/straw.webp';
import { useClockAngles } from '@/hooks/useClockAngles';
import type { FontConfig } from '@/types/clock';
import { useSecondClock } from '@/utils/hooks'; // Correctly using canonical hook
import { memo, useMemo } from 'react';
import styles from './Clock.module.css';

export const assets: string[] = [
  strawImage,
  hourHandImage,
  minuteHandImage,
  secondHandImage,
];

// Per ARCHITECTURE.md, font configuration is required even if empty.
const fontConfigs: FontConfig[] = [];

const ClockComponent = () => {
  const time = useSecondClock();
  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  const { timeString, accessibleTime } = useMemo(() => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
    const hours12 = String(time.getHours() % 12 || 12);

    return {
      timeString: `${hours}:${minutes}:${seconds}`,
      accessibleTime: `${hours12}:${minutes}:${seconds} ${ampm}`,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <div className={styles.analogClock}>
        <div className={styles.face}>
          <img
            src={hourHandImage}
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `rotate(${hourAngle}deg)` }}
            alt="Hour hand"
          />
          <img
            src={minuteHandImage}
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ transform: `rotate(${minAngle}deg)` }}
            alt="Minute hand"
          />
          <img
            src={secondHandImage}
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `rotate(${secAngle}deg)` }}
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

// Per ARCHITECTURE.md, wrapping in React.memo and setting a displayName is required.
const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_10';

export default MemoizedClock;
MemoizedClock.displayName = 'Clock_26_08_10';

export default MemoizedClock;
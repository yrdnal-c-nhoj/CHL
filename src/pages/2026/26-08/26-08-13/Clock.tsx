import { useClockAngles } from '@/hooks/useClockAngles';
import { useMillisecondClock } from '@/utils/hooks';
import React from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports (for preloading)
import backgroundVideo from '@/assets/images/26_images/26-08/26-08-13/venus.webm';

export const assets = [backgroundVideo];

// 3. Main Component
const ClockComponent = () => {
  // Use the millisecond hook for a smooth, sweeping second hand.
  // 16ms interval targets ~60fps for continuous motion.
  const time = useMillisecondClock(16);

  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  return (
    <main className={styles.container}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.backgroundVideo}
        src={backgroundVideo}
      />
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      {/* --- Clock UI --- */}
      <div className={styles.clockContainer}>
        {/* Analog Clock */}
        <div className={styles.analogClock}>
          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `rotate(${hourAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ transform: `rotate(${minAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `rotate(${secAngle}deg)` }}
          />
        </div>

      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_13';

export default MemoizedClock;
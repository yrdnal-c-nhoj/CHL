import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// Import the background image for the firework display
import fireworksVideo1 from '@/assets/images/26_images/26-07/26-07-04/orange.mp4';
import fireworksVideo2 from '@/assets/images/26_images/26-07/26-07-04/orange2.mp4';

// Export assets for the preloading pipeline
export const assets = [fireworksVideo1, fireworksVideo2];

const TickMarks: React.FC = () => (
  <>
    {Array.from({ length: 60 }).map((_, i) => {
      const isHourMark = i % 5 === 0;
      return (
        <div
          key={`tick-${i}`}
          className={`${styles.tick} ${isHourMark ? styles.hourTick : styles.minuteTick}`}
          style={{
            transform: `rotate(${i * 6}deg)`,
          }}
        />
      );
    })}
  </>
);

const AnalogClock: React.FC = () => {
  const currentTime = useMillisecondClock();

  // Memoize angle calculations for performance
  const rotations = useMemo(() => {
    const seconds = currentTime.getSeconds() + currentTime.getMilliseconds() / 1000;
    const minutes = currentTime.getMinutes() + seconds / 60;
    const hours = (currentTime.getHours() % 12) + minutes / 60;
    return {
      hour: hours * 30,
      minute: minutes * 6,
      second: seconds * 6,
    };
  }, [currentTime]);

  return (
    <main className={styles.container}>
      <div className={styles.videoBackground}>
        <video autoPlay loop muted playsInline className={styles.videoLayer}>
          <source src={fireworksVideo1} type="video/mp4" />
        </video>
        <video autoPlay loop muted playsInline className={`${styles.videoLayer} ${styles.videoLayerTop}`}>
          <source src={fireworksVideo2} type="video/mp4" />
        </video>
      </div>

      <div className={styles.clockFace}>
        <TickMarks />

        {/* Clock Hands */}
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ transform: `rotate(${rotations.hour}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ transform: `rotate(${rotations.minute}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ transform: `rotate(${rotations.second}deg)` }}
        />

        <div className={styles.centerPin} />
      </div>
    </main>
  );
};

export default AnalogClock;
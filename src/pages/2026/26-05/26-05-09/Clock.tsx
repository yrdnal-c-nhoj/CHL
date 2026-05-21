import React, { useMemo } from 'react';
import { useClockTime, calculateAngles, formatTime } from '@/utils/clockUtils';
import bgImage from '@/assets/images/26_images/26-05/26-05-09/lotus.webp';
import styles from './Clock.module.css';

// BTS: Export assets for the preloading pipeline
// This ensures the capture script waits for the background to load
export const assets = [bgImage];

/**
 * May 9, 2026 - "Capture"
 * An analog clock with lotus background.
 */
const CaptureClock: React.FC = () => {
  const time = useClockTime();

  const {
    hour: hourAngle,
    minute: minuteAngle,
    second: secondAngle,
  } = calculateAngles(time);

  const formatted = useMemo(() => formatTime(time, '24h'), [time]);

  return (
    <main
      className={styles.container}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.clock}>
        <div className={styles.face}>
          <div
            className={`${styles.hand} ${styles.hourHand} ${styles.hourHandRotation}`}
            style={{ '--hour-angle': `${hourAngle}deg` } as React.CSSProperties}
          />
          <div
            className={`${styles.hand} ${styles.minuteHand} ${styles.minuteHandRotation}`}
            style={
              { '--minute-angle': `${minuteAngle}deg` } as React.CSSProperties
            }
          />
          <div
            className={`${styles.hand} ${styles.secondHand} ${styles.secondHandRotation}`}
            style={
              { '--second-angle': `${secondAngle}deg` } as React.CSSProperties
            }
          />
          <div className={styles.center} />
        </div>
      </div>
      <time dateTime={time.toISOString()} className="sr-only">
        {formatted}
      </time>
    </main>
  );
};

export default CaptureClock;

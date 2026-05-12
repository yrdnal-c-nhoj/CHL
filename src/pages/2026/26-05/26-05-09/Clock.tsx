import React from 'react';
import { useClockTime, calculateAngles } from '@/utils/clockUtils';
import styles from './Clock.module.css';

/**
 * May 9, 2026 - "Capture"
 * An analog clock with lotus background.
 */
const CaptureClock: React.FC = () => {
  const time = useClockTime();
  
  const { hour: hourAngle, minute: minuteAngle, second: secondAngle } = calculateAngles(time);

  return (
    <div className={styles.container}>
      <div className={styles.clock}>
        <div className={styles.face}>
          <div 
            className={`${styles.hand} ${styles.hourHand} ${styles.hourHandRotation}`}
            style={{ '--hour-angle': `${hourAngle}deg` } as React.CSSProperties}
          />
          <div 
            className={`${styles.hand} ${styles.minuteHand} ${styles.minuteHandRotation}`}
            style={{ '--minute-angle': `${minuteAngle}deg` } as React.CSSProperties}
          />
          <div 
            className={`${styles.hand} ${styles.secondHand} ${styles.secondHandRotation}`}
            style={{ '--second-angle': `${secondAngle}deg` } as React.CSSProperties}
          />
          <div className={styles.center} />
          
  
        </div>
      </div>
    </div>
  );
};

export default CaptureClock;

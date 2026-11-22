import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import circleImage from '@/assets/images/26_images/26-11/26-11-19/circ.webp';

import styles from './Clock.module.css';
import type { CSSProperties } from 'react';

export const assets = [circleImage];

const Clock_26_11_19 = () => {
  const time = useSmoothClock(50);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  // Smooth hand positions (including fractional parts for continuous motion)
  const hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30; // 30 degrees per hour
  const minuteAngle = (minutes + seconds / 60 + milliseconds / 60000) * 6; // 6 degrees per minute
  const secondAngle = (seconds + milliseconds / 1000) * 6; // 6 degrees per second

  return (
    <main
      className={styles.container}
      style={{ '--background-image': `url(${circleImage})` } as CSSProperties}
    >
      <SRTime time={time} />

      <div className={styles.clockFace} aria-hidden="true">
        {/* Hour hand */}
        <div
          className={styles.hand}
          style={
            {
              '--angle': `${hourAngle}deg`,
              '--length': '30%',
              '--width': '6px',
            } as CSSProperties
          }
        />
        {/* Minute hand */}
        <div
          className={styles.hand}
          style={
            {
              '--angle': `${minuteAngle}deg`,
              '--length': '45%',
              '--width': '4px',
            } as CSSProperties
          }
        />
        {/* Second hand */}
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={
            {
              '--angle': `${secondAngle}deg`,
              '--length': '48%',
              '--width': '2px',
            } as CSSProperties
          }
        />
        {/* Center dot */}
        <div className={styles.centerDot} />
      </div>
    </main>
  );
};

Clock_26_11_19.displayName = 'Clock_26_11_19';

export default Clock_26_11_19;

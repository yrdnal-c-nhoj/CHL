import React, { useMemo } from 'react';

import portholeVideo from '@/assets/images/26_images/26-07/26-07-25/porthole.mp4';
import { calculateAngles } from '@/utils/hooks';
import { useMillisecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [portholeVideo];

const Clock =  () => {
  const time = useMillisecondClock();

  const {
    hour: hourAngle,
    minute: minuteAngle,
    second: secondAngle,
  } = calculateAngles(time, true); // Pass true for millisecond precision

  const offsets = useMemo(() => {
    const elapsed = time.getTime() / 1000; // Time in seconds

    // Horizontal sway (x-axis)
    const x = Math.sin(elapsed * 1.1) * 25 + Math.sin(elapsed * 2.7) * 10;

    // Vertical bounce (y-axis)
    const y = Math.cos(elapsed * 1.3) * 15 + Math.cos(elapsed * 3.1) * 7;

    // Rotation (rot)
    const rot = Math.sin(elapsed * 0.8) * 12 + Math.sin(elapsed * 2.2) * 5;

    return { x, y, rot };
  }, [time]);

  return (
    <main className={styles.container}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.backgroundVideo}
        src={portholeVideo}
      />
    
      <div
        className={styles.analogClock}
        style={{
          '--offset-x': `${offsets.x}vmin`,
          '--offset-y': `${offsets.y}vmin`,
          '--offset-rot': `${offsets.rot}deg`,
        } as React.CSSProperties}
      >
        <div className={styles.face}>
          <div className={styles.twelveMarker} />
          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ '--hand-angle': `${hourAngle}deg` } as React.CSSProperties}
          />
          <div
            className={`${styles.hand} ${styles.minuteHand}`}
            style={
              { '--hand-angle': `${minuteAngle}deg` } as React.CSSProperties
            }
          />
          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={
              { '--hand-angle': `${secondAngle}deg` } as React.CSSProperties
            }
          />
          <div className={styles.center} />
        </div>
      </div>
      {/* Accessible time element, hidden from view but available to screen readers */}
      <time dateTime={time.toISOString()} className={styles.semanticTime} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

const MemoizedClock = React.memo(Clock);
MemoizedClock.displayName = 'Clock_2026_07_24';

export default MemoizedClock;
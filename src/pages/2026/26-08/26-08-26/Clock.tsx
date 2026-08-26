import { useClockAngles } from '@/hooks/useClockAngles';
import { useSecondClock, useVisibilitySchedule } from '@/utils/hooks';
import React, { memo } from 'react';

import tornadoVideo from '@/assets/images/26_images/26-08/26-08-26/mud.webm';
import styles from './Clock.module.css';

export const assets: string[] = [tornadoVideo];

const QUADRANT_TRANSFORMS = [
  'none',
  'scaleX(-1) translateX(0.5px)',
  'scaleY(-1) translateY(0.5px)',
  'scale(-1) translate(0.5px, 0.5px)',
];

const ClockComponent = () => {
  const visible = useVisibilitySchedule();
  const time = useSecondClock();
  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  return (
    <main className={styles.container}>
      <div className={styles.videoWrapper}>
        {QUADRANT_TRANSFORMS.map((transform, index) => (
          <video
            key={index}
            className={styles.video}
            style={{ '--quadrant-transform': transform } as React.CSSProperties}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src={tornadoVideo} type="video/webm" />
          </video>
        ))}
      </div>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div
        className={`${styles.analogClock}${visible ? ` ${styles.visible}` : ''}`}
      >
        <div className={styles.clockFace}>
          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ transform: `translateX(-50%) rotate(${minAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `translateX(-50%) rotate(${secAngle}deg)` }}
          />
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_26';

export default MemoizedClock;

import { useClockAngles } from '@/hooks/useClockAngles';
import { useSecondClock } from '@/utils/hooks';
import React, { useEffect, useState } from 'react';

import tornadoVideo from '@/assets/images/26_images/26-08/26-08-26/mud.webm';
import styles from './Clock.module.css';

export const assets: string[] = [tornadoVideo];

const QUADRANT_TRANSFORMS = [
  'var(--top-left-transform)',
  'var(--top-right-transform)',
  'var(--bottom-left-transform)',
  'var(--bottom-right-transform)',
] as const;

const ClockComponent = () => {
  const [visible, setVisible] = useState(false);
  const time = useSecondClock();
  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    const tick = () => {
      showTimer = setTimeout(() => setVisible(true), 2500);
      hideTimer = setTimeout(() => setVisible(false), 6500);
    };

    tick();
    const interval = setInterval(tick, 11000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

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

      <div className={`${styles.analogClock} ${visible ? styles.visible : ''}`}>
        <div className={styles.clockFace}>
          <div className={`${styles.hand} ${styles.hourHand}`} style={{ transform: `rotate(${hourAngle}deg)` }} />
          <div className={`${styles.hand} ${styles.minuteHand}`} style={{ transform: `rotate(${minAngle}deg)` }} />
          <div className={`${styles.hand} ${styles.secondHand}`} style={{ transform: `rotate(${secAngle}deg)` }} />
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_20';

export default MemoizedClock;

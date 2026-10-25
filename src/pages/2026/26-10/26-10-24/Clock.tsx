import { useState } from 'react';

import SRTime from '@/components/SRTime';
import { useClockAngles } from '@/hooks/useClockAngles';
import { useSmoothClock } from '@/utils/hooks';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-24/stadium.webm';

import styles from './Clock.module.css';

export const assets = [backgroundVideo];

const Clock_26_10_24 = () => {
  const time = useSmoothClock(16);
  const { hourAngle, minAngle } = useClockAngles(time);
  const [initialSecondHand] = useState(() => ({
    timestamp: time.getTime(),
    angle: (time.getSeconds() + time.getMilliseconds() / 1000) * 6,
  }));
  const secondHandAngle =
    initialSecondHand.angle +
    (time.getTime() - initialSecondHand.timestamp) * 0.006;

  return (
    <main className={styles.container}>
      <video
        className={styles.backgroundVideo}
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <SRTime time={time} />

      <div className={styles.dial} aria-hidden="true">
        <div className={styles.face}>
          <span
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `rotate(${hourAngle}deg)` }}
          />
          <span
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ transform: `rotate(${minAngle}deg)` }}
          />
          <span
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `rotate(${secondHandAngle}deg)` }}
          />
        </div>
      </div>
    </main>
  );
};

Clock_26_10_24.displayName = 'Clock_26_10_24';

export default Clock_26_10_24;

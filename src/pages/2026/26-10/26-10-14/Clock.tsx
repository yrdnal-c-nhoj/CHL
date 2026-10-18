import SRTime from '@/components/SRTime';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo, type CSSProperties } from 'react';

import witchVideo from '@/assets/images/26_images/26-10/26-10-14/witch.webm';

import styles from './Clock.module.css';

export const assets = [witchVideo];

const Clock_26_10_14 = () => {
  const time = useSmoothClock(16);

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const milliseconds = time.getMilliseconds();

    const seconds = time.getSeconds() + milliseconds / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    return {
      hourAngle: hours * 30,
      minuteAngle: minutes * 6,
      secondAngle: seconds * 6,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <video
        src={witchVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.clockFace}>
        <div
          className={styles.handWrapper}
          style={{ '--angle': `${hourAngle}deg` } as CSSProperties}
        >
          <div className={styles.hourHand} />
        </div>
        <div
          className={styles.handWrapper}
          style={{ '--angle': `${minuteAngle}deg` } as CSSProperties}
        >
          <div className={styles.minuteHand} />
        </div>
        <div
          className={styles.handWrapper}
          style={{ '--angle': `${secondAngle}deg` } as CSSProperties}
        >
          <div className={styles.secondHand} />
        </div>
        <div className={styles.center} />
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_14.displayName = 'Clock_26_10_14';

export default Clock_26_10_14;

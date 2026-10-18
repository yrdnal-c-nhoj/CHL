import SRTime from '@/components/SRTime';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo, type CSSProperties } from 'react';

import witchVideo from '@/assets/images/26_images/26-10/26-10-14/witch.webm';
import hourImage from '@/assets/images/26_images/26-10/26-10-14/hour.webp';
import minuteImage from '@/assets/images/26_images/26-10/26-10-14/minute.webp';

import styles from './Clock.module.css';

export const assets = [witchVideo, hourImage, minuteImage];

const Clock_26_10_14 = () => {
  const time = useSmoothClock(16);

  const { hourAngle, minuteAngle } = useMemo(() => {
    const milliseconds = time.getMilliseconds();

    const seconds = time.getSeconds() + milliseconds / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    return {
      hourAngle: hours * 30,
      minuteAngle: minutes * 6,
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
          <img
            src={hourImage}
            alt=""
            className={styles.hourHand}
            aria-hidden="true"
          />
        </div>
        <div
          className={styles.handWrapper}
          style={{ '--angle': `${minuteAngle}deg` } as CSSProperties}
        >
          <img
            src={minuteImage}
            alt=""
            className={styles.minuteHand}
            aria-hidden="true"
          />
        </div>
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_14.displayName = 'Clock_26_10_14';

export default Clock_26_10_14;

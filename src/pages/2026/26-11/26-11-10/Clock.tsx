import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import backgroundVideo from '@/assets/images/26_images/26-11/26-11-10/eventhorizon.mp4';

import styles from './Clock.module.css';

export const assets = [backgroundVideo];

const Clock_26_11_10 = () => {
  const time = useSmoothClock(50);
  const milliseconds = time.getMilliseconds();
  const seconds = time.getSeconds() + milliseconds / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6;
  const hourAngle = hours * 30;

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <SRTime time={time} />
      <div className={styles.clock} aria-hidden="true">
        <div className={styles.face}>
          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }}
          />
        </div>
      </div>
    </main>
  );
};

Clock_26_11_10.displayName = 'Clock_26_11_10';

export default Clock_26_11_10;

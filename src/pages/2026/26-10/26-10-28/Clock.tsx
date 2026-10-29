import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-28/rave.mp4';

export const assets = [backgroundVideo];

const Clock_26_10_28 = () => {
  const time = useSmoothClock(16);

  const hourAngle = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;
  const minuteAngle = (time.getMinutes() + time.getSeconds() / 60) * 6;
  const secondAngle = (time.getSeconds() + time.getMilliseconds() / 1000) * 6;

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className={styles.dial} aria-hidden="true">
        <div className={styles.face}>
          <div
            className={styles.hand}
            style={{ transform: `rotate(${hourAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ transform: `rotate(${minuteAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `rotate(${secondAngle}deg)` }}
          />
        </div>
      </div>
      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_28.displayName = 'Clock_26_10_28';
export default Clock_26_10_28;

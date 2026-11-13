import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import whitebullVideo from '@/assets/images/26_images/26-11/26-11-13/whitebull.mp4';
import europaImage from '@/assets/images/26_images/26-11/26-11-13/europa.webp';
import frameImage from '@/assets/images/26_images/26-11/26-11-13/frame.webp';

import styles from './Clock.module.css';

export const assets = [whitebullVideo, europaImage, frameImage];

const Clock_26_11_13 = () => {
  const time = useSmoothClock(50);

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6;
  const hourAngle = hours * 30;

  return (
    <main className={styles.container}>
      <video
        className={styles.backgroundVideo}
        src={whitebullVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      />

      <div
        className={styles.europaLayer}
        style={
          { '--europa-image': `url(${europaImage})` } as React.CSSProperties
        }
        aria-hidden="true"
      />

      <img
        className={styles.frameLayer}
        src={frameImage}
        alt=""
        aria-hidden="true"
      />

      <SRTime time={time} />

      <div className={styles.clock} aria-hidden="true">
        <div className={styles.face}>
          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ '--angle': `${hourAngle}deg` } as React.CSSProperties}
          />

          <div
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ '--angle': `${minuteAngle}deg` } as React.CSSProperties}
          />

          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ '--angle': `${secondAngle}deg` } as React.CSSProperties}
          />
        </div>
      </div>
    </main>
  );
};

Clock_26_11_13.displayName = 'Clock_26_11_13';

export default Clock_26_11_13;

import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

import bgVideo from '@/assets/images/26_images/26-11/26-11-15/tree.webm';
import hourHandImg from '@/assets/images/26_images/26-11/26-11-15/hour.webp';
import minuteHandImg from '@/assets/images/26_images/26-11/26-11-15/minute.webp';
import secondHandImg from '@/assets/images/26_images/26-11/26-11-15/second.webp';

export const assets = [bgVideo, hourHandImg, minuteHandImg, secondHandImg];

const Clock_26_11_15 = () => {
  const time = useSmoothClock(16);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  const hourDeg = (hours + minutes / 60 + seconds / 3600) * 30;
  const minuteDeg = (minutes + seconds / 60 + milliseconds / 60000) * 6;
  const secondDeg = (seconds + milliseconds / 1000) * 6;

  return (
    <main className={styles.container}>
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <SRTime time={time} />
      <div className={styles.clockFace} aria-hidden="true">
        <img
          src={minuteHandImg}
          alt=""
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ '--deg': `${minuteDeg}deg` } as React.CSSProperties}
        />
        <img
          src={hourHandImg}
          alt=""
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ '--deg': `${hourDeg}deg` } as React.CSSProperties}
        />

        <img
          src={secondHandImg}
          alt=""
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ '--deg': `${secondDeg}deg` } as React.CSSProperties}
        />
      </div>
    </main>
  );
};

Clock_26_11_15.displayName = 'Clock_26_11_15';

export default Clock_26_11_15;

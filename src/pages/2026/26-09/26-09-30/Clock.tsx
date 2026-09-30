import { useMemo } from 'react';
import SRTime from '@/components/SRTime';
import { useSmoothClock } from '@/utils/hooks';
import reindeerVideo from '@/assets/images/26_images/26-09/26-09-30/reindeer.webm';
import styles from './Clock.module.css';

export const assets = [reindeerVideo];

const Clock_26_09_30 = () => {
  const time = useSmoothClock(16);

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const ms = time.getMilliseconds();

    const seconds = time.getSeconds() + ms / 1000;
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
        src={reindeerVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.clockFace} aria-hidden="true">
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={
            {
              '--angle': `${hourAngle}deg`,
            } as React.CSSProperties
          }
        />

        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={
            {
              '--angle': `${minuteAngle}deg`,
            } as React.CSSProperties
          }
        />

        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={
            {
              '--angle': `${secondAngle}deg`,
            } as React.CSSProperties
          }
        />

      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_30.displayName = 'Clock_26_09_30';

export default Clock_26_09_30;

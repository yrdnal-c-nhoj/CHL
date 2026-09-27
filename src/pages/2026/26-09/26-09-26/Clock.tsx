import { useClockAngles } from '@/hooks/useClockAngles';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-25/intersection.webm';
import styles from './Clock.module.css';

export const assets = [backgroundVideo];

const Clock = () => {
  const time = useSmoothClock(50);
  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  return (
    <main className={styles.container}>
      <video
        className={styles.backgroundLayer}
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      />

      <div className={styles.analogClock} aria-hidden="true">
        <div className={styles.clockFace} />
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
        <div className={styles.centerDot} />
      </div>

      <SRTime time={time} />
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_09_26';

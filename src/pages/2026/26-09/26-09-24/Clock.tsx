import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-24/dux.webm';
import styles from './Clock.module.css';

export const assets = [backgroundVideo];

const CENTER = 100;

const AnalogClock = ({ time }: { time: Date }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  return (
    <div className={styles.analogClock}>
      <svg viewBox="0 0 200 200" className={styles.svg}>
        <line
          x1={CENTER} y1={CENTER} x2={CENTER} y2="62"
          className={`${styles.hand} ${styles.hourHand}`}
          transform={`rotate(${hourDeg} ${CENTER} ${CENTER})`}
        />
        <line
          x1={CENTER} y1={CENTER} x2={CENTER} y2="36"
          className={`${styles.hand} ${styles.minuteHand}`}
          transform={`rotate(${minuteDeg} ${CENTER} ${CENTER})`}
        />
        <line
          x1={CENTER} y1={CENTER} x2={CENTER} y2="26"
          className={`${styles.hand} ${styles.secondHand}`}
          transform={`rotate(${secondDeg} ${CENTER} ${CENTER})`}
        />
      </svg>
    </div>
  );
};

const Clock_26_09_24 = () => {
  const time = useClock();

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <video
        className={styles.backgroundVideoLeft}
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <video
        className={styles.backgroundVideoRight}
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <AnalogClock time={time} />
    </main>
  );
};

Clock_26_09_24.displayName = 'Clock_26_09_24';
export default Clock_26_09_24;

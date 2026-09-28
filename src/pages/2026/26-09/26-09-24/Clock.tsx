import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-24/dux.webm';
import styles from './Clock.module.css';

export const assets = [backgroundVideo];

const CENTER = 100;

const AnalogClock = ({ time }: { time: Date }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();
  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = (seconds + milliseconds / 1000) * 6;

  return (
    <div className={styles.analogClock}>
      <svg viewBox="0 0 200 200" className={styles.svg}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 30;
          return (
            <line
              key={`tick-${i}`}
              x1={100}
              y1={1}
              x2={100}
              y2={30}
              className={styles.tick}
              transform={`rotate(${angle} ${CENTER} ${CENTER})`}
            />
          );
        })}
        <line
          x1={CENTER} y1={CENTER} x2={CENTER} y2="68"
          className={`${styles.hand} ${styles.hourHand}`}
          transform={`rotate(${hourDeg} ${CENTER} ${CENTER})`}
        />
        <line
          x1={CENTER} y1={CENTER} x2={CENTER} y2="49"
          className={`${styles.hand} ${styles.minuteHand}`}
          transform={`rotate(${minuteDeg} ${CENTER} ${CENTER})`}
        />
        <line
          x1={CENTER} y1={CENTER} x2={CENTER} y2="40"
          className={`${styles.hand} ${styles.secondHand}`}
          transform={`rotate(${secondDeg} ${CENTER} ${CENTER})`}
        />
      </svg>
    </div>
  );
};

const Clock_26_09_24 = () => {
  const time = useSmoothClock(50);

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

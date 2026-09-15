import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-12/oz2.webm?url';
import styles from './Clock.module.css';

export const assets = [backgroundVideo];

const MARKERS = Array.from({ length: 12 }, (_, i) => ({
  angle: i * 30,
  isMajor: i % 3 === 0,
}));

const NUMBERS = [
  { value: 12, angle: 0 },
  { value: 3, angle: 90 },
  { value: 6, angle: 180 },
  { value: 9, angle: 270 },
];

const Clock_26_09_08 = () => {
  const time = useSmoothClock();

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  const hourDeg = ((hours % 12) + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = (seconds + milliseconds / 1000) * 6;

  return (
    <main className={styles.container}>
      <video
        className={styles.backgroundVideo}
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      />

      <SRTime time={time} />

      <div className={styles.clockFace}>
        {MARKERS.map(({ angle, isMajor }) => (
          <div
            key={angle}
            className={isMajor ? styles.markerMajor : styles.markerMinor}
            style={{ transform: `rotate(${angle}deg)` }}
          />
        ))}

        {NUMBERS.map(({ value, angle }) => (
          <div
            key={value}
            className={styles.number}
            style={{
              transform: `rotate(${angle}deg) translateY(-118px) rotate(-${angle}deg)`,
            }}
          >
            {value}
          </div>
        ))}

        <div
          className={styles.hourHand}
          style={{ transform: `rotate(${hourDeg}deg)` }}
        />
        <div
          className={styles.minuteHand}
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        />
        <div
          className={styles.secondHand}
          style={{ transform: `rotate(${secondDeg}deg)` }}
        />

        <div className={styles.centerCap} />
      </div>
    </main>
  );
};

Clock_26_09_08.displayName = 'Clock_26_09_08';
export default Clock_26_09_08;
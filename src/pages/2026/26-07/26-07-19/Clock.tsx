import { useClockTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';

// Conforms to the project standard of exporting assets, even if empty.
export const assets: string[] = [];

const SweepClock = () => {
  // Use the project's standardized hook for timekeeping.
  const time = useClockTime('ms');

  // 1. Seconds calculations (Continuous sweep)
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const secondDegrees = (seconds / 60) * 360;

  // 2. Minutes calculations (Continuous sweep based on minutes + seconds elapsed)
  const minutes = time.getMinutes() + seconds / 60;
  const minuteDegrees = (minutes / 60) * 360;

  // 3. Hours calculations (Continuous sweep based on 12-hour cycle + minutes elapsed)
  const hours = (time.getHours() % 12) + minutes / 60;
  const hourDegrees = (hours / 12) * 360;

  const isoTime = time.toISOString();

  return (
    <main className={styles.container}>
      <time dateTime={isoTime} className={styles.aspectWrapper}>
        {/* LAYER 1: OUTER RING - SECONDS (Full Size) */}
        <div
          className={`${styles.ring} ${styles.secondsRing}`}
          style={{
            background: `conic-gradient(from ${secondDegrees}deg, #FA5D28 0deg, #2C4402 360deg, transparent 33deg)`,
          }}
        />

        {/* LAYER 2: MIDDLE RING - MINUTES (Scaled down slightly) */}
        <div
          className={`${styles.ring} ${styles.minutesRing}`}
          style={{
            background: `conic-gradient(from ${minuteDegrees}deg, #0B0B84 0deg, #E3ADA3 360deg, transparent 4deg)`,
          }}
        />

        {/* LAYER 3: INNER RING - HOURS (Smallest inner layer) */}
        <div
          className={`${styles.ring} ${styles.hoursRing}`}
          style={{
            background: `conic-gradient(from ${hourDegrees}deg, #D3A2F6 0deg,  #5E5001  360deg, transparent 6deg)`,
          }}
        />

        {/* CENTER MATTE (Optional: Cleans up the center core so it looks like rings) */}
        <div className={`${styles.ring} ${styles.centerMatte}`} />
      </time>
    </main>
  );
};

export default SweepClock;
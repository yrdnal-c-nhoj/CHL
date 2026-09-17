import { useSmoothClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-16/world.webm';
import styles from './Clock.module.css';

export const assets: string[] = [backgroundVideo];

const TOTAL_TILES = 48; // 8 x 6 grid

const Clock_26_09_16 = () => {
  const time = useSmoothClock(50);

  const hourAngle = useMemo(
    () => ((time.getHours() % 12) + time.getMinutes() / 60) * 30,
    [time]
  );
  const minuteAngle = useMemo(
    () => (time.getMinutes() + time.getSeconds() / 60) * 6,
    [time]
  );
  const secondAngle = useMemo(
    () => (time.getSeconds() + time.getMilliseconds() / 1000) * 6,
    [time]
  );

  const tiles = useMemo(
    () => Array.from({ length: TOTAL_TILES }, (_, i) => i),
    []
  );

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.tiledClocks}>
        {tiles.map((id) => (
          <div key={id} className={styles.tileClock}>
            <div
              className={styles.tileHand}
              style={{ transform: `rotate(${hourAngle}deg)` }}
            />
            <div
              className={`${styles.tileHand} ${styles.tileHandMinute}`}
              style={{ transform: `rotate(${minuteAngle}deg)` }}
            />
            <div
              className={`${styles.tileHand} ${styles.tileHandSecond}`}
              style={{ transform: `rotate(${secondAngle}deg)` }}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

Clock_26_09_16.displayName = 'Clock_26_09_16';
export default React.memo(Clock_26_09_16);
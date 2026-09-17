import { useSmoothClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-16/world.webm';
import styles from './Clock.module.css';

export const assets: string[] = [backgroundVideo];

const COLS = 8;
const ROWS = 6;

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

  const centerRow = Math.floor(ROWS / 2);
  const centerCol = Math.floor(COLS / 2);

  const tiles = useMemo(() => {
    const positions: { id: number; row: number; col: number }[] = [];
    let id = 0;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const rowDist = Math.abs(r - centerRow);
        const colDist = Math.abs(c - centerCol);
        const distance = rowDist + colDist;
        positions.push({ id: id++, row: r, col: c, distance });
      }
    }

    return positions.sort((a, b) => a.distance - b.distance);
  }, []);

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
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={styles.tileClock}
            style={{
              gridRow: tile.row + 1,
              gridColumn: tile.col + 1,
            }}
          >
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

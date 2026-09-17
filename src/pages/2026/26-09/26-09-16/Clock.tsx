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

  // Build every cell and sort so the center clock is first,
  // then the rings expand outward (no overlap because of the grid)
  const tiles = useMemo(() => {
    const centerCol = (COLS - 1) / 2;
    const centerRow = (ROWS - 1) / 2;

    const positions: {
      id: number;
      col: number;
      row: number;
      distance: number;
      zIndex: number;
    }[] = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const colOffset = c - centerCol;
        const rowOffset = r - centerRow;
        const distance = Math.abs(colOffset) + Math.abs(rowOffset);

        positions.push({
          id: r * COLS + c,
          col: c + 1,          // 1-based for CSS grid
          row: r + 1,
          distance,
          zIndex: Math.max(0, 10 - Math.floor(distance)),
        });
      }
    }

    // Center first → then rings expand outward
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
              gridColumn: tile.col,
              gridRow: tile.row,
              zIndex: tile.zIndex,
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
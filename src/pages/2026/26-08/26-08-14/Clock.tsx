import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';
// 1. Asset Exports (for preloading)
import fontUrl from '@/assets/fonts/26fonts/26-08-14-halo.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-08/26-08-14/angel.mp4';

export const assets = [backgroundImage, fontUrl];

// 2. Font Configuration
const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_14',
    fontUrl,
  },
];

// Grid dimensions for tiling
const GRID_ROWS = 3;
const GRID_COLS = 3;
const TILE_COUNT = GRID_ROWS * GRID_COLS;

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the canonical hook to get time that updates every second.
  const time = useSecondClock();

  useSuspenseFontLoader(fontConfigs);

  // Memoize the formatted time to prevent recalculating on every render.
  const { hours, minutes, seconds } = useMemo(() => ({
    hours: String(time.getHours()).padStart(2, '0'),
    minutes: String(time.getMinutes()).padStart(2, '0'),
    seconds: String(time.getSeconds()).padStart(2, '0'),
  }), [time]);

  return (
    <main className={styles.container}>
      {/* Tiled Background Video Container */}
      <div
        className={styles.tiledBackgroundContainer}
        style={{
          '--grid-cols': GRID_COLS,
          '--grid-rows': GRID_ROWS,
        } as React.CSSProperties}
      >
        {Array.from({ length: TILE_COUNT }).map((_, index) => (
          <video
            key={index}
            className={styles.tiledVideo}
            src={backgroundImage}
            autoPlay
            loop
            muted
            playsInline
          />
        ))}
      </div>

      {/* Semantic <time> element for accessibility */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      {/* Digital clock display */}
      <div className={styles.digitalClock}>
        <span className={styles.digit}>{hours[0]}</span>
        <span className={styles.digit}>{hours[1]}</span>
        <span className={styles.separator}>:</span>
        <span className={styles.digit}>{minutes[0]}</span>
        <span className={styles.digit}>{minutes[1]}</span>
        <span className={styles.separator}>:</span>
        <span className={styles.digit}>{seconds[0]}</span>
        <span className={styles.digit}>{seconds[1]}</span>
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_14';

export default MemoizedClock;
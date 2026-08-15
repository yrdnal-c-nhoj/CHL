import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports (for preloading)
// NOTE: Please replace these placeholder paths with your actual assets.
import fontUrl from '@/assets/fonts/26fonts/26-08-14-halo.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-08/26-08-14/angel.mp4';

export const assets = [backgroundImage, fontUrl];

// 2. Font Configuration
const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_08_13', fontUrl },
];

// The desired size for each video tile in pixels.
const TILE_SIZE = 250;

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the millisecond hook for a smooth, sweeping second hand.
  // 16ms interval targets ~60fps for continuous motion.
  const time = useMillisecondClock(16);

  // Load fonts via Suspense
  useSuspenseFontLoader(fontConfigs);

  const [dimensions, setDimensions] = useState({ cols: 1, rows: 1 });

  // Update grid dimensions on window resize
  useEffect(() => {
    const updateGrid = () => {
      setDimensions({
        cols: Math.ceil(window.innerWidth / TILE_SIZE),
        rows: Math.ceil(window.innerHeight / TILE_SIZE),
      });
    };
    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, []);

  // Format time for the digital display
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  // Memoize the grid of tiles, each containing a video and a clock.
  const gridItems = useMemo(() => {
    const total = dimensions.cols * dimensions.rows;
    return Array.from({ length: total }, (_, i) => (
      <div key={i} className={styles.tile}>
        <video
          className={styles.tileVideo}
          src={backgroundImage}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.clockContainer}>
          <div className={styles.digitalClock}>
            {hours.split('').map((digit, i) => (
              <span key={`h-${i}`} className={styles.digit}>{digit}</span>
            ))}
            <span className={styles.separator}>:</span>
            {minutes.split('').map((digit, i) => (
              <span key={`m-${i}`} className={styles.digit}>{digit}</span>
            ))}
            <span className={styles.separator}>:</span>
            {seconds.split('').map((digit, i) => (
              <span key={`s-${i}`} className={styles.digit}>{digit}</span>
            ))}
          </div>
        </div>
      </div>
    ));
  }, [dimensions.cols, dimensions.rows, hours, minutes, seconds]);

  return (
    <main
      className={styles.container}
      style={
        {
          '--tile-size': `${TILE_SIZE}px`,
          '--grid-cols': dimensions.cols,
        } as React.CSSProperties
      }
    >
      <div className={styles.backgroundGrid}>{gridItems}</div>
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_14';

export default MemoizedClock;
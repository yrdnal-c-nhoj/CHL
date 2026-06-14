import clockFont from '@/assets/fonts/26_fonts/26-06-11.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-06/26-06-11/ukulele.webp';
import { useClockTime } from '@/hooks/useClockTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './Clock.module.css';

/**
 * Clock Component for 2026-06-11
 * Features a 6-digit grid layout over a tiled background.
 */
export const assets = [backgroundImage, clockFont];

const Clock: React.FC = () => {
  const time = useClockTime();
  const tileSize = 80; // Size in pixels
  const [dimensions, setDimensions] = useState({ cols: 1, rows: 1 });

  // Handle window resizing to fill the background
  useEffect(() => {
    const updateGrid = () => {
      setDimensions({
        cols: Math.ceil(window.innerWidth / tileSize) + 1,
        rows: Math.ceil(window.innerHeight / tileSize) + 1,
      });
    };
    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, [tileSize]);


  // Replace these with the specific characters you picked out for your font mapping
  const numbers = useMemo(
    () => ['c', 'X', 'L', 'Y', 'F', 'H', 'U', 'M', 'W', 'T'],
    []
  );

  // Standardized font loading to ensure 'ClockFont_26_06_11' is available
  const fontConfigs = useMemo(
    () => [
      {
        fontFamily: 'ClockFont_26_06_11',
        fontUrl: clockFont,
      },
    ],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  // Format time into 6 individual digits (HHMMSS) to match the CSS grid
  const digits = useMemo(() => {
    const hh = time.getHours().toString().padStart(2, '0');
    const mm = time.getMinutes().toString().padStart(2, '0');
    const ss = time.getSeconds().toString().padStart(2, '0');
    return (hh + mm + ss).split('').map((digit) => numbers[parseInt(digit)]);
  }, [time, numbers]);

  // Memoize tiles to prevent re-calculating on every clock tick
  const backgroundTiles = useMemo(() => {
    const tiles = [];
    const total = dimensions.cols * dimensions.rows;
    for (let i = 0; i < total; i++) {
      const row = Math.floor(i / dimensions.cols);
      const col = i % dimensions.cols;
      tiles.push(
        <div
          key={i}
          className={styles.tile}
          style={{
            '--tile-img': `url("${backgroundImage}")`,
            '--sx': col % 2 === 1 ? '-1' : '1',
            '--sy': row % 2 === 1 ? '-1' : '1',
          } as React.CSSProperties}
        />
      );
    }
    return tiles;
  }, [dimensions, backgroundImage]);

  return (
    <main
      className={styles.container}
      style={{ 
        '--tile-size': `${tileSize}px`,
        '--grid-cols': String(dimensions.cols),
        '--grid-rows': String(dimensions.rows),
      } as React.CSSProperties}
    >
      <div className={styles.backgroundGrid}>
        {backgroundTiles}
      </div>

      <div className={styles.clockFace}>
        <time
          className={styles.digitalGrid}
          dateTime={time.toISOString()}
        >
          {digits.map((digit, index) => (
            <div 
              key={index} 
              className={styles.cell}
              aria-hidden="true"
            >
              {digit}
            </div>
          ))}
        </time>
      </div>
    </main>
  );
};

export default Clock;
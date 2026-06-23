import clockFont from '@/assets/fonts/26fonts/26-06-21.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-06/26-06-21/ukulele.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

/**
 * Clock Component for 2026-06-21
 * Features a 6-digit grid layout over a tiled, mirrored background.
 */
export const assets = [backgroundImage, clockFont];

const containerStyle: CSSProperties = {
  position: 'relative',
  width: '100vw',
  height: '100dvh',
  overflow: 'hidden',
  backgroundColor: '#111',
  display: 'grid',
  placeItems: 'center',
};

const backgroundGridStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(var(--grid-cols), var(--tile-size))',
  gridTemplateRows: 'repeat(var(--grid-rows), var(--tile-size))',
  zIndex: 0,
};

const tileStyle: CSSProperties = {
  backgroundImage: 'var(--tile-img)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transform: 'scale(var(--sx), var(--sy))',
};

const clockFaceStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  placeItems: 'center',
};

const digitalGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: '1vw',
  color: 'white',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
};

const cellStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 'clamp(10vw, 15vh, 150px)',
  lineHeight: 1,
  userSelect: 'none',
};

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
        fontFamily: 'ClockFont_26_06_21',
        fontUrl: clockFont,
      },
    ],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  // Format time into 6 individual digits (HHMMSS) to match the CSS grid
  // We use the floor of the timestamp to ensure digits only recalculate once per second
  const secondTimestamp = Math.floor(time.getTime() / 1000);
  const digits = useMemo(() => {
    const d = new Date(secondTimestamp * 1000);
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    const ss = d.getSeconds().toString().padStart(2, '0');
    return (hh + mm + ss).split('').map((digit) => numbers[parseInt(digit)]);
  }, [secondTimestamp, numbers]); // Correctly depends on `numbers`

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
          style={{
            ...tileStyle,
            '--tile-img': `url("${backgroundImage}")`,
            '--sx': col % 2 === 1 ? '-1' : '1',
            '--sy': row % 2 === 1 ? '-1' : '1',
          } as CSSProperties}
        />
      );
    }
    return tiles;
  }, [dimensions]);

  return (
    <main style={{
        ...containerStyle,
        '--tile-size': `${tileSize}px`,
        '--grid-cols': String(dimensions.cols),
        '--grid-rows': String(dimensions.rows),
      } as CSSProperties}>
      <div style={backgroundGridStyle}>
        {backgroundTiles}
      </div>

      <div style={clockFaceStyle}>
        <time
          dateTime={time.toISOString()}
          style={{
            ...digitalGridStyle,
            fontFamily: 'ClockFont_26_06_21',
          }}
        >
          {digits.map((digit, index) => (
            <div key={index} style={cellStyle} aria-hidden="true">
              {digit}
            </div>
          ))}
        </time>
      </div>
    </main>
  );
};

export default Clock;
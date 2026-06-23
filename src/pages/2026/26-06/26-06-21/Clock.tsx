import clockFont from '@/assets/fonts/26fonts/26-06-21.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-06/26-06-21/birdhaus.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

export const assets = [backgroundImage, clockFont];

// Constant — no reason to live inside the component
const TILE_SIZE = 80;

const NUMBERS = ['N', 'm', '1', 'R', 't', 'F', '8', 'Q', 'E', 'v'] as const;

const FONT_CONFIGS = [{ fontFamily: 'ClockFont_26_06_21', fontUrl: clockFont }];

// --- Static styles ---

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
  justifyContent: 'center',
  alignContent: 'center',
  zIndex: 0,
};

const tileStyle: CSSProperties = {
  backgroundImage: 'var(--tile-img)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transform: 'scale(var(--sx), var(--sy))',
};

const digitalGridStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateRows: 'repeat(6, 1fr)',
  gap: '2vh',
  color: '#111111',
  textShadow: '0 0 20px rgba(205, 245, 135, 0.99)',
};

const cellStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 'clamp(10vw, 15vh, 150px)',
  lineHeight: 1,
  userSelect: 'none',
};

// --- Component ---

const Clock: React.FC = () => {
  const time = useClockTime();
  const [dimensions, setDimensions] = useState({ cols: 1, rows: 1 });

  useEffect(() => {
    const update = () =>
      setDimensions({
        cols: Math.ceil(window.innerWidth / TILE_SIZE) + 1,
        rows: Math.ceil(window.innerHeight / TILE_SIZE) + 1,
      });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useSuspenseFontLoader(FONT_CONFIGS);

  const digits = useMemo(() => {
    const d = new Date(Math.floor(time.getTime() / 1000) * 1000);
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    const ss = d.getSeconds().toString().padStart(2, '0');
    return (hh + mm + ss).split('').map((ch) => NUMBERS[parseInt(ch)]);
  }, [time]);

  const backgroundTiles = useMemo(() => {
    const total = dimensions.cols * dimensions.rows;
    return Array.from({ length: total }, (_, i) => {
      const row = Math.floor(i / dimensions.cols);
      const col = i % dimensions.cols;
      return (
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
    });
  }, [dimensions]);

  return (
    <main
      style={{
        ...containerStyle,
        '--tile-size': `${TILE_SIZE}px`,
        '--grid-cols': String(dimensions.cols),
        '--grid-rows': String(dimensions.rows),
      } as CSSProperties}
    >
      <div style={backgroundGridStyle}>{backgroundTiles}</div>

      <time
        dateTime={time.toISOString()}
        style={{ ...digitalGridStyle, fontFamily: 'ClockFont_26_06_21' }}
      >
        {digits.map((digit, i) => (
          <div key={i} style={cellStyle} aria-hidden="true">
            {digit}
          </div>
        ))}
      </time>
    </main>
  );
};

export default Clock;
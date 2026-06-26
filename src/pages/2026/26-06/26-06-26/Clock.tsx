import backgroundImage from '@/assets/images/26_images/26-06/26-06-26/sword.webp';
import urnImage from '@/assets/images/26_images/26-06/26-06-26/urn.webp';
import { useClockTime } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

export const assets = [backgroundImage, urnImage];

// Constant — no reason to live inside the component
const TILE_WIDTH = 150;
const TILE_HEIGHT = 220;

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
  gridTemplateColumns: 'repeat(var(--grid-cols), var(--tile-width))',
  gridTemplateRows: 'repeat(var(--grid-rows), var(--tile-height))',
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

const middleLayerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `url("${urnImage}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  zIndex: 1,
};

const timeStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  color: '#CFDFF07D',
  textShadow: '0 0 20px rgba(15, 4, 73, 0.99)',
  fontSize: '14vh',
  lineHeight: 1,
  userSelect: 'none',
  fontFamily: "'Cardo', serif",
  letterSpacing: '0.05em',
  mixBlendMode: 'overlay',
};

// --- Component ---

const Clock: React.FC = () => {
  const time = useClockTime('ms');
  const [dimensions, setDimensions] = useState({ cols: 1, rows: 1 });

  useEffect(() => {
    const update = () =>
      setDimensions({
        cols: Math.ceil(window.innerWidth / TILE_WIDTH) + 1,
        rows: Math.ceil(window.innerHeight / TILE_HEIGHT) + 1,
      });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const timeString = useMemo(() => {
    const d = new Date(Math.floor(time.getTime() / 1000) * 1000);
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    const ss = d.getSeconds().toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }, [time]);

  const rotationAngle = useMemo(() => {
    const secondsWithMs =
      time.getSeconds() + time.getMilliseconds() / 1000;
    return -(secondsWithMs * 6); // -360 degrees over 60 seconds
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
            '--sx': '-1',
            '--sy': '-1',
          } as CSSProperties}
        />
      );
    });
  }, [dimensions]);

  return (
    <main
      style={{
        ...containerStyle,
        '--tile-width': `${TILE_WIDTH}px`,
        '--tile-height': `${TILE_HEIGHT}px`,
        '--grid-cols': String(dimensions.cols),
        '--grid-rows': String(dimensions.rows),
      } as CSSProperties}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cardo:wght@700&display=swap');`}
      </style>

      <div style={backgroundGridStyle}>{backgroundTiles}</div>

      <div
        style={{ ...middleLayerStyle, transform: `rotate(${rotationAngle}deg)` }}
      />

      <time dateTime={time.toISOString()} style={timeStyle}>
        {timeString}
      </time>
    </main>
  );
};

export default Clock;
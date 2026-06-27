import fontUrl from '@/assets/fonts/26fonts/26-06-26.otf?url';
import backgroundImage from '@/assets/images/26_images/26-06/26-06-26/sword.webp';
import urnImage from '@/assets/images/26_images/26-06/26-06-26/urn.webp';
import windflowerVideo from '@/assets/images/26_images/26-06/26-06-26/windflower.mp4?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

export const assets = [backgroundImage, urnImage, windflowerVideo, fontUrl];

// Constant — no reason to live inside the component
const FONT_FAMILY = 'ClockFont_26_06_26';
const fontConfigs: FontConfig[] = [
  {
    fontFamily: FONT_FAMILY,
    fontUrl,
  },
];

const TILE_WIDTH = 50;
const TILE_HEIGHT = 70;

// --- Static styles ---

const videoStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 1,
  filter: 'brightness(0.7)',
  opacity: 0.5,
};

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
  zIndex: 2,
};

const timeStyle: CSSProperties = {
  position: 'absolute', // Absolute positioning matches the true bounding space of the container
  inset: 0,             // Spans full container width/height
  zIndex: 3,
  color: '#BCDBFBB7',
  textShadow: '0 1px 2px rgba(5, 2, 20, 0.99)',
  fontSize: '10vh',
  lineHeight: 1,
  userSelect: 'none',
  fontFamily: `'${FONT_FAMILY}', serif`,
  mixBlendMode: 'overlay',
  display: 'flex',       // Centers child elements flawlessly
  justifyContent: 'center',
  alignItems: 'center',
};

const digitBoxStyle: CSSProperties = {
  width: '5vh',          // Sized appropriately for numbers
  textAlign: 'center',
  display: 'inline-block',
};

const colonBoxStyle: CSSProperties = {
  width: '2vh',          // Thinner bounding box ensures colons don't cause visual shift
  textAlign: 'center',
  display: 'inline-block',
};

// --- Component ---

const Clock: React.FC = () => {
  const time = useClockTime(); 
  const [dimensions, setDimensions] = useState({ cols: 1, rows: 1 });
  const [rotationAngle, setRotationAngle] = useState(0);

  useSuspenseFontLoader(fontConfigs);

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

  // Animation loop for smooth rotation
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      const now = new Date();
      const secondsWithMs = now.getSeconds() + now.getMilliseconds() / 1000;
      const angle = -(secondsWithMs * 6); // -360 degrees over 60 seconds
      setRotationAngle(angle);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const timeString = useMemo(() => {
    const hh = time.getHours().toString().padStart(2, '0');
    const mm = time.getMinutes().toString().padStart(2, '0');
    const ss = time.getSeconds().toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
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
      <video
        src={windflowerVideo}
        style={videoStyle}
        autoPlay
        loop
        muted
        playsInline
      />

      <div style={backgroundGridStyle}>{backgroundTiles}</div>

      <div
        style={{ ...middleLayerStyle, transform: `rotate(${rotationAngle}deg)` }}
      />

      <time dateTime={time.toISOString()} style={timeStyle}>
        {timeString.split('').map((char, index) => (
          <span 
            key={index} 
            style={char === ':' ? colonBoxStyle : digitBoxStyle}
          >
            {char}
          </span>
        ))}
      </time>
    </main>
  );
};

export default Clock;
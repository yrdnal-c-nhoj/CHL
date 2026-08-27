import fontUrl from '@/assets/fonts/26fonts/26-06-26.otf?url';
import backgroundImage from '@/assets/images/26_images/26-06/26-06-26/sword.webp';
import urnImage from '@/assets/images/26_images/26-06/26-06-26/urn.webp';
import windflowerVideo from '@/assets/images/26_images/26-06/26-06-26/windflower.mp4?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect, useMemo, useState, memo } from 'react';
import styles from './Clock.module.css';

export const assets = [backgroundImage, urnImage, windflowerVideo, fontUrl];

const FONT_FAMILY = 'ClockFont_26_06_26';
const fontConfigs: FontConfig[] = [
  {
    fontFamily: FONT_FAMILY,
    fontUrl,
  },
];

const TILE_WIDTH = 50;
const TILE_HEIGHT = 70;

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
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  zIndex: 2,
};

const timeStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 3,
  color: '#BCDBFBB7',
  textShadow: '0 1px 2px rgba(5, 2, 20, 0.99)',
  fontSize: '10dvh',
  lineHeight: 1,
  userSelect: 'none',
  fontFamily: `'${FONT_FAMILY}', serif`,
  mixBlendMode: 'overlay',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const digitBoxStyle: CSSProperties = {
  width: '5dvh',
  textAlign: 'center',
  display: 'inline-block',
};

const colonBoxStyle: CSSProperties = {
  width: '2dvh',
  textAlign: 'center',
  display: 'inline-block',
};

const Clock =  () => {
  const time = useSecondClock();
  const [dimensions, setDimensions] = useState({ cols: 1, rows: 1 });
  const [rotationAngle, setRotationAngle] = useState(0);

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

  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const tick = () => {
      setRotationAngle((prev) => (prev + 1) % 360);
      timerRef.current = setTimeout(tick, 50);
    };
    timerRef.current = setTimeout(tick, 50);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useSuspenseFontLoader(fontConfigs);

  const timeString = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
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
    <main className={styles.container} style={{
      ...containerStyle,
      '--tile-width': `${TILE_WIDTH}px`,
      '--tile-height': `${TILE_HEIGHT}px`,
      '--grid-cols': String(dimensions.cols),
      '--grid-rows': String(dimensions.rows),
    } as CSSProperties}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

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

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_06_26';
export default MemoizedClock;

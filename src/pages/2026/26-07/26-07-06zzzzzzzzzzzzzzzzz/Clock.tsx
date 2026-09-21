import type { FontConfig } from '@/types/clock';
import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { memo } from 'react';
import styles from './Clock.module.css';

const m1 = new URL('../../../../assets/images/26_images/26-07/26-07-07/3.webp', import.meta.url).href;
const tile = new URL('../../../../assets/images/26_images/26-07/26-07-07/1.webp', import.meta.url).href;
const m3 = new URL('../../../../assets/images/26_images/26-07/26-07-07/2.webp', import.meta.url).href;
const m4 = new URL('../../../../assets/images/26_images/26-07/26-07-07/4.webp', import.meta.url).href;

const fontUrl = new URL('../../../../assets/fonts/26fonts/26-07-07.ttf', import.meta.url).href;

const IMAGE_CONFIG = [
  { src: m1, maxCount: 6 },
  { src: tile, maxCount: 3 },
  { src: m3, maxCount: 3 },
  { src: m4, maxCount: 3 },
];

const ASSET_POOL = IMAGE_CONFIG.flatMap((config) =>
  Array.from({ length: config.maxCount }, () => config.src)
);

export const assets = [m1, m3, m4, tile];

interface ImageData {
  id: number;
  src: string;
  style: React.CSSProperties;
}

const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont_26_07_07', fontUrl }];

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

// Standalone function to generate randomized image properties safely
const createRandomImageData = (src: string, id: number): ImageData => {
  const size = Math.random() * 25 + 15;
  const rotation = Math.random() * 360;
  const flip = id % 2 === 0 ? 'scaleX(-1)' : '';

  return {
    id,
    src,
    style: {
      left: `${Math.random() * 85 - 5}%`,
      top: `${Math.random() * 85 - 5}%`,
      width: `${size}vmin`,
      transform: `rotate(${rotation}deg) ${flip}`,
      zIndex: id,
    },
  };
};

const analogStyles: { [key: string]: React.CSSProperties } = {
  clock: {
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    border: '4px solid #eee',
    position: 'relative',
    zIndex: 10,
  },
  face: { width: '100%', height: '100%', position: 'relative' },
  number: {
    position: 'absolute',
    fontFamily: 'ClockFont_26_07_07, sans-serif',
    fontSize: '10dvh',
    color: '#3B053F',
    transform: 'translate(-50%, -50%)',
    userSelect: 'none',
  },
  num12: { top: '12%', left: '50%' },
  num3: { top: '50%', left: '88%' },
  num6: { top: '88%', left: '50%' },
  num9: { top: '50%', left: '12%' },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    backgroundColor: '#4750D5',
  },
  hourHand: { width: '6px', height: '60px', marginLeft: '-3px' },
  minuteHand: { width: '4px', height: '90px', marginLeft: '-2px' },
  secondHand: {
    width: '2px',
    height: '110dvh',
    marginLeft: '-1px',
    backgroundColor: '#f44336',
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12dvh',
    height: '12dvh',
    opacity: 0.3,
    borderRadius: '50%',
    backgroundColor: '#f44336',
    transform: 'translate(-50%, -50%)',
  },
};

const vtecStyles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    zIndex: 5,
    backgroundPosition: 'center',
    backgroundSize: '15dvh',
  },
  vtecImage: {
    position: 'absolute',
    objectFit: 'contain',
    filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.5))',
  },
};

const VTEC = () => {
  const time = useSmoothClock();
  const idCounter = useRef(0);
  const isMobile = useIsMobile();

  // Initialize state using standalone helper to avoid TDZ issues
  const [visibleImages, setVisibleImages] = useState(() =>
    ASSET_POOL.map((src) => createRandomImageData(src, idCounter.current++))
  );

  useSuspenseFontLoader(fontConfigs);

  // Clock Hand Rotations
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() + minutes / 60;

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = (minutes / 60) * 360;
  const hourDegrees = (hours / 12) * 360;

  const cycleImage = useCallback(() => {
    setVisibleImages((prev) => {
      if (prev.length === 0) return prev;

      const next = [...prev];
      const replaceIndex = Math.floor(Math.random() * next.length);
      const randomSrc = ASSET_POOL[Math.floor(Math.random() * ASSET_POOL.length)];

      next[replaceIndex] = createRandomImageData(randomSrc, idCounter.current++);
      return next;
    });
  }, []);

  // Cycle images on second change (replaces setInterval)
  useEffect(() => {
    cycleImage();
  }, [time.getSeconds(), cycleImage]);

  return (
    <div
      style={{
        ...vtecStyles.container,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-start',
        paddingLeft: isMobile ? 0 : '5vw',
      }}
    >
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${tile})`,
          backgroundPosition: 'center',
          backgroundSize: '45dvh',
          filter: 'saturate(4) contrast(2.2) brightness(0.8)',
        }}
      />

      <div style={analogStyles.clock}>
        <div style={analogStyles.face}>
          {/* Clock Numbers */}
          <div style={{ ...analogStyles.number, ...analogStyles.num12 }}>12</div>
          <div style={{ ...analogStyles.number, ...analogStyles.num3 }}>3</div>
          <div style={{ ...analogStyles.number, ...analogStyles.num6 }}>6</div>
          <div style={{ ...analogStyles.number, ...analogStyles.num9 }}>9</div>

          {/* Clock Hands */}
          <div
            style={{
              ...analogStyles.hand,
              ...analogStyles.hourHand,
              transform: `rotate(${hourDegrees}deg)`,
            }}
          />
          <div
            style={{
              ...analogStyles.hand,
              ...analogStyles.minuteHand,
              transform: `rotate(${minuteDegrees}deg)`,
            }}
          />
          <div
            style={{
              ...analogStyles.hand,
              ...analogStyles.secondHand,
              transform: `rotate(${secondDegrees}deg)`,
            }}
          />
          <div style={analogStyles.centerDot} />
        </div>
      </div>

      {visibleImages.map((img) => (
        <img
          key={img.id}
          src={img.src}
          alt=""
          className={styles.vtecImage}
          style={{ ...img.style, ...vtecStyles.vtecImage }}
        />
      ))}
    </div>
  );
};

const MemoizedVTEC = memo(VTEC);
MemoizedVTEC.displayName = 'Clock_26_07_06';

export default MemoizedVTEC;

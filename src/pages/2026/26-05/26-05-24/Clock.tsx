import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import React, { useLayoutEffect, useMemo, useState } from 'react';

// Image paths in public folder
import customFont_2025_1206 from '@/assets/fonts/26fonts/26-05-24.ttf?url';
import tileImg from '@/assets/images/26_images/26-05/26-05-24/rhino.webp';
import bgImage from '@/assets/images/26_images/26-05/26-05-24/rhino3.jpg';
import rhino4 from '@/assets/images/26_images/26-05/26-05-24/rhino4.webp';

// BTS: Export assets for the preloading pipeline
export const assets = [tileImg, bgImage, rhino4];

// ---------------- INTERFACES ----------------
interface Viewport {
  width: number;
  height: number;
}

interface ClockHandProps {
  type: 'hour' | 'minute' | 'second';
  rotation: number;
}

// ---------------- CONFIGURATION ----------------
const CLOCK_CONFIG = {
  TILE_SIZE_VMIN: 20,
  HANDS: {
    hour: { width: '2vmin', height: '20vmin', zIndex: 9, color: '#333333' },
    minute: { width: '1.5vmin', height: '30vmin', zIndex: 10, color: '#333333' },
    second: { width: '0.8vmin', height: '35vmin', zIndex: 11, color: '#413F3F' },
  },
  FONT_NAME: 'CustomClockFont',
} as const;

export const fontConfigs = [
  {
    fontFamily: CLOCK_CONFIG.FONT_NAME,
    fontUrl: customFont_2025_1206,
  },
];

// ---------------- SUB-COMPONENTS ----------------

/**
 * Renders the border tiles around the screen edges
 */
const BorderTiles: React.FC<{ viewport: Viewport }> = ({ viewport }) => {
  const vmin = Math.min(viewport.width, viewport.height);
  const tileSizePx = (CLOCK_CONFIG.TILE_SIZE_VMIN / 100) * vmin;
  
  const horizontalCount = Math.ceil(viewport.width / tileSizePx) + 1;
  const verticalCount = Math.ceil(viewport.height / tileSizePx) + 1;

  const renderTileStrip = (count: number, rotation: number, style: React.CSSProperties) => (
    <div style={{ position: 'absolute', display: 'flex', zIndex: 3, ...style }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ height: `${CLOCK_CONFIG.TILE_SIZE_VMIN}vmin`, width: `${CLOCK_CONFIG.TILE_SIZE_VMIN}vmin` }}>
          <div style={{
            height: '100%', width: '100%', backgroundImage: `url(${tileImg})`,
            backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
            transform: `rotate(${rotation}deg)`
          }} />
        </div>
      ))}
    </div>
  );

  return (
    <>
      {renderTileStrip(horizontalCount, 180, { top: 0, width: '100%' })}
      {renderTileStrip(horizontalCount, 0, { bottom: 0, width: '100%' })}
      {renderTileStrip(verticalCount, 90, { left: 0, height: '100%', flexDirection: 'column' })}
      {renderTileStrip(verticalCount, 270, { right: 0, height: '100%', flexDirection: 'column' })}
    </>
  );
};

const ClockHand: React.FC<ClockHandProps> = ({ type, rotation }) => {
  const config = CLOCK_CONFIG.HANDS[type];
  return (
    <div style={{
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      width: config.width,
      height: config.height,
      backgroundColor: config.color,
      borderRadius: '0.5vmin',
      transform: `translateX(-50%) rotate(${rotation}deg)`,
      transformOrigin: 'bottom center',
      zIndex: config.zIndex,
      // filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))',
      pointerEvents: 'none',
      willChange: 'transform',
    }} />
  );
};

const ClockNumerals: React.FC = () => {
  return (
    <>
      {[...Array(12)].map((_, i) => {
        const num = i + 1;
        const angle = (num - 3) * 30 * (Math.PI / 180);
        const radius = 42;
        return (
          <div key={num} style={{
            position: 'absolute',
            left: `calc(50% + ${radius * Math.cos(angle)}%)`,
            top: `calc(50% + ${radius * Math.sin(angle)}%)`,
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(3rem, 6vmin, 5rem)',
            fontFamily: `${CLOCK_CONFIG.FONT_NAME}, sans-serif`,
            color: '#333333',
            textShadow: '-1px -2px 0px rgba(170, 189, 241, 0.83)',
            userSelect: 'none',
            zIndex: 5,
          }}>
            {num}
          </div>
        );
      })}
    </>
  );
};

// ---------------- MAIN COMPONENT ----------------

export default function AnalogClock() {
  const time = useClockTime();
  
  // Load custom font using the project's suspense loader
  useSuspenseFontLoader(fontConfigs);

  const [viewport, setViewport] = useState<Viewport>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useLayoutEffect(() => {
    const handleResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    const totalHours = time.getHours() + time.getMinutes() / 60 + time.getSeconds() / 3600;
    const totalMinutes = time.getMinutes() + time.getSeconds() / 60;
    const totalSeconds = time.getSeconds() + time.getMilliseconds() / 1000;
    return {
      hourDeg: totalHours * 30,
      minuteDeg: totalMinutes * 6,
      secondDeg: totalSeconds * 6,
    };
  }, [time]);

  // Component Styles
  const outerContainerStyle: React.CSSProperties = {
    height: '100dvh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    touchAction: 'none',
    overflow: 'hidden',
  };

  const clockContainerStyle: React.CSSProperties = {
    width: 'min(80vmin, 90vw)',
    height: 'min(80vmin, 90vw)',
    position: 'relative',
    zIndex: 10,
  };

  return (
    <div style={outerContainerStyle}>
      {/* Tiled Overlay Layer (rhino4 tiled above bgImage) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${rhino4})`,
          backgroundRepeat: 'repeat',
          backgroundSize: `${CLOCK_CONFIG.TILE_SIZE_VMIN}vmin ${CLOCK_CONFIG.TILE_SIZE_VMIN}vmin`,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.6, // Subtle blending
        }}
      />

      <BorderTiles viewport={viewport} />

      {/* Clock Face */}
      <div style={clockContainerStyle}>
        <ClockNumerals />

        {/* Clock Hands */}
        <ClockHand type="hour" rotation={hourDeg} />
        <ClockHand type="minute" rotation={minuteDeg} />
        <ClockHand type="second" rotation={secondDeg} />
        
        {/* Center Nut/Cap */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '3vmin',
          height: '3vmin',
          backgroundColor: '#222',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 12,
          boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }} />
      </div>
    </div>
  );
}

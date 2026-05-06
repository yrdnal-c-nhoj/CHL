import React, { useEffect, useState, useMemo } from 'react';

import shapesFont from '@/assets/fonts/2026/26-05-05-dino.ttf';
import clockImage from '@/assets/images/2026/26-05/26-05-05/cff51a084d0399311c75440615fa4a4f-ezgif.com-resize.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ShapesFont',
    fontUrl: shapesFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

// Move static styles outside to prevent re-allocation on every second update
const clockWrapperStyle: React.CSSProperties = {
  width: '100vw',
  height: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
};

const backgroundStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${clockImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  zIndex: -2,
};

const Clock: React.FC = () => {
  // Load fonts via Suspense-compatible loader
  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();
  const [isMobile, setIsMobile] = useState(false); // Start false for hydration safety

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Set actual value on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const timeString = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return pad(time.getHours()) + pad(time.getMinutes()) + pad(time.getSeconds());
  }, [time]);

  const digits = timeString.split('');

  const clockContainerStyle: React.CSSProperties = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)',
    gridTemplateRows: isMobile ? 'repeat(3, 1fr)' : '1fr',
  }), [isMobile]);

  const digitStyle: React.CSSProperties = useMemo(() => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'ShapesFont', monospace",
      fontSize: isMobile ? '14vh' : '12vw',
      lineHeight: 0.69,
      WebkitUserSelect: 'none',
      userSelect: 'none',
      overflow: 'hidden',
      color: '#ff6b35',
      textShadow: `
        3px 3px 0px #000,
        -1px -1px 0px #000,  
        1px -1px 0px #000,
        -1px 1px 0px #000,
        1px 1px 0px #000,
        0 0 20px rgba(255, 107, 53, 0.8),
        0 0 40px rgba(255, 107, 53, 0.4),
        inset 0 0 20px rgba(0, 0, 0, 0.3)
      `,
      filter: `
        contrast(1.3) 
        brightness(1.1) 
        saturate(1.2)
        drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))
      `,
      transform: 'skew(-2deg)',
      fontWeight: '900',
      letterSpacing: '0.05em',
      height: isMobile ? '33.3vh' : '100dvh',
      width: isMobile ? '50vw' : '16.66vw',
      minWidth: isMobile ? '50vw' : '16.66vw',
      maxWidth: isMobile ? '50vw' : '16.66vw',
      boxSizing: 'border-box',
      position: 'relative',
  }), [isMobile]);

  return (
    <div style={clockWrapperStyle} aria-hidden="true">
      <div style={backgroundStyle} />
      <time 
        dateTime={time.toISOString()} 
        aria-label={`Current time is ${time.toLocaleTimeString()}`}
        style={clockContainerStyle}
      >
        {digits.map((digit, index) => (
          <div key={index} style={digitStyle}>
            {digit}
          </div>
        ))}
      </time>
    </div>
  );
};

export default Clock;

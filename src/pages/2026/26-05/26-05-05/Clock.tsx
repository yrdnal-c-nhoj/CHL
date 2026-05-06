import React, { useEffect } from 'react';
import { useSecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import shapesFont from '@/assets/fonts/2026/26-05-05-dino.ttf';
import shapesImage from '@/assets/images/2026/26-03/26-03-21/shapes.webp';

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

const Clock: React.FC = () => {
  // Load fonts via Suspense-compatible loader
  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();

  const pad = (n: number) => String(n).padStart(2, '0');
  const digits = (
    pad(time.getHours()) +
    pad(time.getMinutes()) +
    pad(time.getSeconds())
  ).split('');

  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    backgroundColor: '#0a6703',
    zIndex: -2,
  };

  const clockContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)',
    gridTemplateRows: isMobile ? 'repeat(3, 1fr)' : '1fr',
  };

  const digitStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'ShapesFont', monospace",
    fontSize: isMobile ? '14vh' : '12vw',
    lineHeight: 0.69,
    WebkitUserSelect: 'none',
    userSelect: 'none',
    overflow: 'hidden',
    backgroundImage: `url(${shapesImage})`,
    backgroundSize: isMobile ? '80%' : '50%',
    backgroundPosition: 'center',
    filter: 'grayscale(100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    height: isMobile ? '33.3vh' : '100dvh',
    width: isMobile ? '50vw' : '16.66vw',
    minWidth: isMobile ? '50vw' : '16.66vw',
    maxWidth: isMobile ? '50vw' : '16.66vw',
    boxSizing: 'border-box',
  };

  return (
    <div style={clockWrapperStyle}>
      <div style={backgroundStyle} />
      <div style={clockContainerStyle}>
        {digits.map((digit, index) => (
          <div key={index} style={digitStyle}>
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;

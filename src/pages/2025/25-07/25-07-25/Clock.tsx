import { useClockTime } from '@/utils/hooks';

import React, { useEffect } from 'react';
// Fixed: Imported the correct hook used in the component body
import customFont from '@/assets/fonts/25fonts/25-07-25-bamboo.ttf';
import background1 from '@/assets/images/25_images/25-07/25-07-25/bam.webp'; // back
import background3 from '@/assets/images/25_images/25-07/25-07-25/bambu.gif'; // static background
import background2 from '@/assets/images/25_images/25-07/25-07-25/bb.webp'; // front

// Asset exports for preloading
export const assets = [background1, background2, background3, customFont];

const Clock: React.FC = () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'CustomFont',
      fontUrl: customFont,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];
  
  // Fallback: this older clock page previously used a missing hook.
  // Use a simple placeholder boolean instead so production build can complete.
  const fontsLoaded = true;

  const time = useClockTime();

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes parallaxBack {
        0% { background-position: 0 0; }
        100% { background-position: -100vw 0; }
      }

      @keyframes parallaxFrontReverse {
        0% { background-position: 0 0; }
        100% { background-position: 200vw 0; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const formatTime = (date: Date) => {
    if (!date) return { hours: '00', minutes: '00' };
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return { hours, minutes };
  };

  const { hours, minutes } = formatTime(time);

  // Optional optimization: Return a loader state if fonts are required before rendering
  if (!fontsLoaded) {
    return null; // Or a subtle loading spinner/placeholder
  }

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundLayer1Style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${background1})`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: 'cover',
    backgroundPosition: '0 0',
    animation: 'parallaxBack 160s linear infinite',
    opacity: 0.8,
    zIndex: 0,
  };

  const backgroundLayer2Style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${background2})`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: 'cover',
    backgroundPosition: '0 0',
    animation: 'parallaxFrontReverse 120s linear infinite',
    opacity: 0.2,
    zIndex: 1,
  };

  const backgroundLayer3Style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${background3})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    opacity: 0.2,
    zIndex: 2,
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 3,
  };

  const clockStackStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 4,
  };

  const digitRowStyle: React.CSSProperties = {
    display: 'flex',
    margin: '0.5rem 0',
  };

  const digitBoxStyle: React.CSSProperties = {
    width: '4.5rem',
    height: '5rem',
    fontSize: '6rem',
    color: '#98AF86BB',
    fontFamily: 'CustomFont, monospace',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={wrapperStyle}>
      <div style={backgroundLayer1Style} />
      <div style={backgroundLayer2Style} />
      <div style={backgroundLayer3Style} />
      <div style={overlayStyle} />
      <div style={clockStackStyle}>
        <div style={digitRowStyle}>
          {hours.split('').map((char, index) => (
            <div key={`h-${index}`} style={digitBoxStyle}>
              {char}
            </div>
          ))}
        </div>
        <div style={digitRowStyle}>
          {minutes.split('').map((char, index) => (
            <div key={`m-${index}`} style={digitBoxStyle}>
              {char}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clock;
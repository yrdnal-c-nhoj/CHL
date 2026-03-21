import React, { useState, useEffect, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import backgroundImage from '../../../assets/images/25-05/25-05-27/dot.jpg';
import dotsFont from '../../../assets/fonts/25-05-27-dots.otf?url';


const Clock: React.FC = () => {
  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'dotsFont',
      fontUrl: dotsFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);
  useSuspenseFontLoader(fontConfigs);

  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const formatTimeParts = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    hours = hours % 12 || 12;
    hours = hours.toString();

    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTimeParts(time);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100dvh',
    width: '100vw',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '0.1rem' : '0.1rem',
    overflow: 'hidden',
  };

  const unitStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.1rem',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const digitBoxStyle: React.CSSProperties = {
    width: '9rem',
    height: '9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11rem',
    fontFamily: "'dotsFont', monospace",
    borderRadius: '0.2em',
    color: 'rgb(4, 2, 109)',

    textShadow: `
      #f6320b 1px 1px 20px,
      #94f00b -1px 1px 20px,
      #f72808 1px -1px 20px,
      #a5f507 -1px -1px 20px
    `,
  };

  const renderTimeUnit = (value) => (
    <div style={unitStyle}>
      {[...value].map((digit, i) => (
        <div key={i} style={digitBoxStyle}>
          {digit}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          opacity: 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Static Background Layer */}
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            filter: 'hue-rotate(50deg)',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            opacity: 0.6, // Adjust to your preference
          }}
        />

        {/* Foreground Clock */}
        <div style={{ ...containerStyle, position: 'relative', zIndex: 1 }}>
          {renderTimeUnit(hours)}
          {renderTimeUnit(minutes)}
          {renderTimeUnit(seconds)}
        </div>
      </div>
    </>
  );
}

export default Clock;

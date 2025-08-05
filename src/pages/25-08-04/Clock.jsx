import { useState, useEffect, useMemo } from 'react';
import bgImage from './shrub.jpg';      // Your background image file
import myFont from './Tr.ttf';          // Your custom font file

// Because you can’t use @font-face with dynamic URL inside JSX style tag,
// create a CSS file for your font or use a workaround below.

const getRandomPosition = () => ({
  top: `${Math.random() * 80 + 10}%`,
  left: `${Math.random() * 80 + 10}%`,
});

const getRandomTilt = () => ({
  transform: `rotate(${Math.random() * 20 - 10}deg)`,
});

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [fadeIndex, setFadeIndex] = useState(0);

  // Generate clocks positions only once
  const clocks = useMemo(() =>
    Array.from({ length: 10 }, () => ({
      position: getRandomPosition(),
      tilt: getRandomTilt(),
    })), []
  );

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update fade index every 2 seconds
  useEffect(() => {
    const fadeTimer = setInterval(() => {
      setFadeIndex((i) => (i + 1) % clocks.length);
    }, 2000);
    return () => clearInterval(fadeTimer);
  }, [clocks.length]);

  // Calculate opacity for smooth fade transition across clocks
  const getOpacity = (i) => {
    const totalClocks = clocks.length;
    let diff = i - fadeIndex;
    if (diff < 0) diff += totalClocks;

    if (diff <= 5) {
      return diff / 5;
    } else {
      return 1 - (diff - 5) / 4;
    }
  };

  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <>
      {/* Inject custom font via style tag - workaround */}
      <style>{`
        @font-face {
          font-family: 'MyCustomFont';
          src: url(${myFont}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        body, html, #root {
          margin: 0; padding: 0; height: 100%;
          background: black;
          overflow: hidden;
        }
      `}</style>

      {/* Background image with filters */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5,
            filter: 'saturate(1.2) brightness(0.55) contrast(2.3)',
            zIndex: 0,
          }}
        />
      </div>

      {/* Clocks container */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          zIndex: 10,
          pointerEvents: 'none',
          backgroundColor: 'transparent',
          fontFamily: `'MyCustomFont', Arial, sans-serif`,
        }}
      >
        {clocks.map(({ position, tilt }, index) => {
          const opacity = getOpacity(index);
          return (
            <time
              key={index}
              style={{
                position: 'absolute',
                display: 'flex',
                color: '#E9F2D7FF',
                fontSize: '1.0rem',
                transition: 'opacity 10s linear',
                opacity,
                ...position,
                ...tilt,
                pointerEvents: 'none',
                textShadow: '0 0 5px rgba(0,0,0,0.7)',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
              aria-live="polite"
            >
              <span>{hours}</span>
              <span>{minutes}</span>
            </time>
          );
        })}
      </div>
    </>
  );
};

export default DigitalClock;

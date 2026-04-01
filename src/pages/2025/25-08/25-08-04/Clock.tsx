import { useState, useEffect, useMemo, useRef } from 'react';
import { useMultipleFontLoader } from '../../../../utils/fontLoader';
import bgImage from '../../../../assets/images/2025/25-08/25-08-04/shrub.jpeg'; // Your background image file
import myFont from '../../../../assets/fonts/25-08-04-Tr.ttf'; // Your custom font file

const getRandomPosition = () => ({
  top: `${Math.random() * 80 + 10}%`,
  left: `${Math.random() * 80 + 10}%`,
});

const getRandomTilt = () => ({
  transform: `rotate(${Math.random() * 20 - 10}deg)`,
});

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [fadeIndex, setFadeIndex] = useState<number>(0);
  const [fontLoaded, setFontLoaded] = useState(false);
  const componentId = useRef(`multi-clock-${Date.now()}`);

  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'Tr',
      fontUrl: myFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  // Update fontLoaded state when fontsLoaded changes
  useEffect(() => {
    setFontLoaded(fontsLoaded);
  }, [fontsLoaded]);

  // Font loading handled by useMultipleFontLoader

  const clocks = useMemo(
    () =>
      Array.from({ length: 10 }, () => ({
        position: getRandomPosition(),
        tilt: getRandomTilt(),
      })),
    [],
  );

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // faster fade change → 1s instead of 2s
  useEffect(() => {
    const fadeTimer = setInterval(() => {
      setFadeIndex((i) => (i + 1) % clocks.length);
    }, 1000);
    return () => clearInterval(fadeTimer);
  }, [clocks.length]);

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
      {/* Font loading handled by useMultipleFontLoader */}

      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100dvh',
          margin: 0,
          padding: 0,
          background: 'black',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(0.3) brightness(0.45) contrast(1.5)',
            zIndex: 0,
          }}
        />
      </div>

      {/* Clocks */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 10,
          pointerEvents: 'none',
          backgroundColor: 'transparent',
          fontFamily: fontLoaded ? 'Tr, Arial, sans-serif' : 'Arial, sans-serif',
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
                transition: 'opacity 2s linear', // faster fade
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

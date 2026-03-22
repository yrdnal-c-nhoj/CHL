import React, { useState, useEffect, useMemo } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import { useMillisecondClock } from '../../../utils/useSmoothClock';
import paperflowerVideo from '../../../assets/images/26-03/26-03-02/paperflower.mp4';
import paperFont from '../../../assets/fonts/26-03-03-paper.ttf';

const AnalogClock: React.FC = () => {
  const fontConfigs = [
    {
      fontFamily: 'PaperFont',
      fontUrl: paperFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  const time = useMillisecondClock();
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      const isPortrait = h > w;

      setDimensions(
        isPortrait
          ? { width: w * 0.8, height: h * 0.6 }
          : { width: w * 0.6, height: h * 0.8 },
      );
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width, height } = dimensions;
  const cx = width / 2;
  const cy = height / 2;

  const timeData = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours();

    return {
      sec: (s + ms / 1000) * 6,
      min: (m + s / 60) * 6,
      hr: ((h % 12) + m / 60) * 30,
    };
  }, [time]);

  // Helper for Oval placement
  const getPos = (angleDegrees, inset = 40) => {
    const rad = (angleDegrees - 90) * (Math.PI / 180);
    return {
      x: cx + (width / 2 - inset) * Math.cos(rad),
      y: cy + (height / 2 - inset) * Math.sin(rad),
    };
  };

  return (
    <div style={{ width, height, position: 'relative', pointerEvents: 'none' }}>
      <style>{`
        /* Font loading handled by useMultipleFontLoader */
        .clock-hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom center;
          transition: transform 0.05s linear;
        }
      `}</style>

      {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
        const pos = getPos(i * 30);
        return (
          <div
            key={num}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
              fontFamily: 'PaperFont, sans-serif',
              fontSize: `${Math.min(width, height) * 0.15}px`,
              background: 'linear-gradient(135deg, #ff69b4, #ffe4e1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))',
            }}
          >
            {num}
          </div>
        );
      })}

      <div
        className="clock-hand"
        style={{
          width: 14,
          height: height * 0.25,
          background: 'linear-gradient(to top, #ff69b4, #ffb6c1)',
          clipPath: 'path("M7 0 C 15 10, 15 25, 7 45 C -1 25, -1 10, 7 0")', // Organic leaf shape
          transform: `translateX(-50%) rotate(${timeData.hr}deg)`,
          zIndex: 3,
        }}
      />

      <div
        className="clock-hand"
        style={{
          width: 10,
          height: height * 0.38,
          background: 'linear-gradient(to top, #E4DADB, #EF4B9D)',
          clipPath: 'path("M5 0 C 12 15, 22 45, 5 60 C -2 45, -2 15, 5 0")',
          transform: `translateX(-50%) rotate(${timeData.min}deg)`,
          zIndex: 4,
        }}
      />

      <div
        className="clock-hand"
        style={{
          width: 2,
          height: height * 0.45,
          backgroundColor: '#52B652',
          boxShadow: '0 0 8px rgba(69, 144, 69, 0.8)',
          transform: `translateX(-50%) rotate(${timeData.sec}deg)`,
          zIndex: 5,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 12,
          height: 12,
          backgroundColor: '#ff69b4',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          border: '2px solid #fff',
        }}
      />
    </div>
  );
};

const Clock: React.FC = () => {
  return (
    <main
      style={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          // ADDED FILTERS HERE:
          // hue-rotate(90deg) changes the colors (0-360)
          // saturate(1.5) increases color intensity (1 is default)
          filter: 'hue-rotate(-195deg) saturate(150%) brightness(0.8)',
        }}
      >
        <source src={paperflowerVideo} type="video/mp4" />
      </video>

      <div style={{ zIndex: 10 }}>
        <AnalogClock />
      </div>
    </main>
  );
};

export default Clock;

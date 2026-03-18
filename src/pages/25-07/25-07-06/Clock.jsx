import React, { useEffect, useState } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';
import polFont from '../../../assets/fonts/25-07-06-pol.otf';
import polarisGif from '../../../assets/images/25-07/25-07-06/polaris.gif';

const CLOCK_NUMBERS = [
  { num: '12', top: '5%', left: '50%' },
  { num: '1', top: '16%', left: '78%' },
  { num: '2', top: '30%', left: '89%' },
  { num: '3', top: '50%', left: '95%' },
  { num: '4', top: '70%', left: '89%' },
  { num: '5', top: '84%', left: '78%' },
  { num: '6', top: '94%', left: '50%' },
  { num: '7', top: '84%', left: '22%' },
  { num: '8', top: '70%', left: '11%' },
  { num: '9', top: '50%', left: '5%' },
  { num: '10', top: '30%', left: '11%' },
  { num: '11', top: '16%', left: '22%' },
];

const Clock = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Font loading
    const font = new FontFace('pol', `url(${polFont}) format('opentype')`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontLoaded(true);
      })
      .catch((err) => console.error('Font load failed', err));

    // Time update
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate rotations
  const minutes = time.getMinutes();
  const hours = time.getHours();
  const minRotation = minutes * 6;
  const hrRotation = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        width: '100vw',
        backgroundColor: 'rgb(3, 3, 61)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <img
        src={polarisGif}
        alt="Background"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '60vmin',
          height: '60vmin',
          transform: 'translate(-50%, -50%)',
          filter: 'brightness(140%) saturate(30%)',
          zIndex: 1,
          animation: 'slow-rotate 60s linear infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        className="clock"
        style={{
          position: 'relative',
          width: '80vmin',
          height: '80vmin',
          borderRadius: '50%',
          zIndex: 2,
        }}
      >
        <div
          className="hand hour-hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '0.3rem',
            height: '30%',
            backgroundColor: '#6a6c70',
            borderRadius: '4.8rem',
            transformOrigin: 'bottom center',
            transform: `rotate(${hrRotation}deg)`,
            pointerEvents: 'none',
            zIndex: 6,
          }}
        />
        <div
          className="hand minute-hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '0.2rem',
            height: '45%',
            backgroundColor: '#5d5f64',
            borderRadius: '4.3rem',
            transformOrigin: 'bottom center',
            transform: `rotate(${minRotation}deg)`,
            pointerEvents: 'none',
            zIndex: 6,
          }}
        />

        {CLOCK_NUMBERS.map(({ num, top, left }) => (
          <div
            key={num}
            className="number"
            style={{
              position: 'absolute',
              fontFamily: fontLoaded ? 'pol' : 'Arial, Helvetica, sans-serif',
              fontSize: '3.2rem',
              color: 'rgb(3, 3, 61)',
              textShadow: '#0f5c7a 0.3rem 0.3rem, #0f5c7a -0.3rem -0.3rem',
              width: '3.2rem',
              height: '3.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translate(-50%, -50%)',
              top,
              left,
            }}
          >
            {num}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slow-rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1.5); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default Clock;

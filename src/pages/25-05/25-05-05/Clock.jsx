import React, { useEffect, useState } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';
import mapFont from '../../../assets/fonts/25-05-05-Map.ttf';

const WarholGraveCamClock = () => {
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime({
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0'),
      });
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inject font-face once
  useEffect(() => {
    // Check if font is already loaded
    if (document.fonts.check('12px "Map"')) {
      return;
    }

    // Method 1: FontFace API
    const font = new FontFace('Map', `url(${mapFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    }).catch((error) => {
      console.error('Font loading failed:', error);
      // Method 2: CSS injection as fallback
      if (!document.getElementById('map-font-style')) {
        const style = document.createElement('style');
        style.id = 'map-font-style';
        style.innerHTML = `
          @font-face {
            font-family: 'Map';
            src: url(${mapFont}) format('truetype');
          }
        `;
        document.head.appendChild(style);
      }
    });
  }, []);

  const digitStyle = {
    color: '#ef1337',
    fontFamily: "'Map', sans-serif", // removed !important from inline style
    fontSize: '6rem',
    width: '3rem',
    height: '6rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '2rem',
    textAlign: 'center',
    boxSizing: 'border-box',
    userSelect: 'none',
  };

  return (
    <>
      {/* Ensure CSS @font-face + class that can use !important */}
      <style>{`
        @font-face {
          font-family: 'Map';
          src: url(${mapFont}) format('truetype');
          font-display: swap;
        }
        .digit { font-family: 'Map', sans-serif !important; }
      `}</style>

      <iframe
        src="https://www.youtube.com/embed/JHpJvvn9hvk?autoplay=1&mute=1"
        title="Live YouTube Stream"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100dvh',
          border: 'none',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2vmin',
        }}
      >
        {Object.values(time).map((unit, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5vmin' }}>
            {unit.split('').map((digit, j) => (
              <div key={j} className="digit" style={digitStyle}>
                {digit}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default WarholGraveCamClock;

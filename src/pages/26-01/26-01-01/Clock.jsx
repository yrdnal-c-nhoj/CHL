import React, { useEffect, useState } from 'react';

// Assets
import analogFontUrl from '../../../assets/fonts/26-01-31-cond.ttf?url';
import analogBgImage from '../../../assets/clocks/26-01-31/rain.webp';

const STYLE_CONFIG = {
  tickColor: '#F1F0F18F',
  // faceOverlayColor: 'rgba(0, 0, 0, 0.25)',
  centerDotColor: '#5F5B5B8C',
};

const AnalogClockTemplate = () => {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  // Load custom font
  useEffect(() => {
    const font = new FontFace('BorrowedAnalog', `url(${analogFontUrl})`);
    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontReady(true);
      })
      .catch(() => setFontReady(true));
  }, []);

  // Time ticker
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculations
  const s = time.getSeconds();
  const m = time.getMinutes() + s / 60;
  const h = (time.getHours() % 12) + m / 60;

  const rotations = {
    sec: (s / 60) * 360,
    min: (m / 60) * 360,
    hour: (h / 12) * 360,
  };

  // Styles
  const styles = {
    container: {
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      backgroundImage: `url(${analogBgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: fontReady ? "'BorrowedAnalog', system-ui, sans-serif" : 'system-ui, sans-serif',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      // background: STYLE_CONFIG.faceOverlayColor,
    },
    face: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80vmin',
      height: '80vmin',
    },
    hand: {
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      transformOrigin: '50% 100%',
      borderRadius: '999px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      
      <div style={styles.face}>
        {/* Numerals */}
        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
          const angle = (num / 12) * 2 * Math.PI;
          const radius = 40; // percent
          return (
            <div
              key={num}
              style={{
                position: 'absolute',
                left: `${50 + radius * Math.sin(angle)}%`,
                top: `${50 - radius * Math.cos(angle)}%`,
                transform: 'translate(-50%, -50%)',
                color: STYLE_CONFIG.tickColor,
                fontSize: '8vh',
                textShadow: '0 0.2rem 0.5rem rgba(0,0,0,0.8)',
              }}
            >
              {num}
            </div>
          );
        })}

        {/* Hands */}
        <div style={{ 
          ...styles.hand, 
          width: '1vmin', height: '22vmin', 
          background: 'linear-gradient(to top, #A5A2A2, #A6A3A3)',
          transform: `translate(-50%, 0) rotate(${rotations.hour}deg)`,
          boxShadow: '0 0.2rem 0.5rem rgba(0,0,0,0.5)'
        }} />
        
        <div style={{ 
          ...styles.hand, 
          width: '0.8vmin', height: '30vmin', 
          background: 'linear-gradient(to top, #908C8C, #B1AFAF)',
          transform: `translate(-50%, 0) rotate(${rotations.min}deg)`,
          boxShadow: '0 0.2rem 0.4rem rgba(0,0,0,0.4)'
        }} />
        
        <div style={{ 
          ...styles.hand, 
          width: '0.4vmin', height: '34vmin', 
          background: '#8F8C8C',
          transform: `translate(-50%, 0) rotate(${rotations.sec}deg)`,
          zIndex: 1
        }} />

        {/* Center Pin */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1.5vmin',
          height: '1.5vmin',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: STYLE_CONFIG.centerDotColor,
          boxShadow: '0 0.2rem 0.5rem rgba(0,0,0,0.5)',
          zIndex: 2
        }} />
      </div>
    </div>
  );
};

export default AnalogClockTemplate;
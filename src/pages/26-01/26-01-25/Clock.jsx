import React, { useEffect, useState } from 'react';

// Assets - Keep these paths as per your project structure
import analogMirageFont from '../../../assets/fonts/25-09-10-lava.otf?url';
import analogBgImage from '../../../assets/clocks/26-01-25/mirage.webp';

const AnalogClockTemplate = () => {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    const font = new FontFace('BorrowedAnalog', `url(${analogMirageFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontReady(true);
    }).catch(() => setFontReady(true));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  // --- Animation & Styles ---
  const fadeInOutKeyframes = `
    @keyframes fadeInOut {
      0% { opacity: 0.05; }
      50% { opacity: 0.2; }
      100% { opacity: 0.08; }
    }
  `;

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundImage: `url(${analogBgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#000',
    fontFamily: fontReady ? "'BorrowedAnalog', system-ui, sans-serif" : 'system-ui, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const faceContainerStyle = {
    position: 'relative',
    width: '80vmin',
    height: '80vmin',
    borderRadius: '50%',
    animation: 'fadeInOut 8s ease-in-out infinite alternate',
  };

  const handBaseStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: '50% 100%',
    backgroundColor: 'transparent', // The hand itself is invisible
    borderRadius: '999px',
  };

  const numberStyle = (index) => {
    const angle = (index * 30) * (Math.PI / 180);
    const radius = 35; // vmin
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%) translate(${Math.sin(angle) * radius}vmin, ${-Math.cos(angle) * radius}vmin)`,
      fontSize: '5vmin',
      color: 'transparent', // Text is invisible
      textShadow: '0 0 8px rgba(255, 255, 255, 0.7)', // Only shadow shows
      userSelect: 'none'
    };
  };

  return (
    <div style={containerStyle}>
      <style>{fadeInOutKeyframes}</style>
      
      <div style={faceContainerStyle}>
        {/* Hour Markers (1-12) */}
        {[...Array(12)].map((_, i) => (
          <div key={i + 1} style={numberStyle(i + 1)}>
            {i + 1}
          </div>
        ))}

        {/* Hour Hand Shadow */}
        <div style={{
          ...handBaseStyle,
          width: '1.5vmin',
          height: '25vmin',
          filter: 'drop-shadow(0 0 10px rgba(252, 238, 199, 0.9))',
          transform: `translate(-50%, 0) rotate(${hourDeg}deg)`,
          zIndex: 2,
        }} />
        
        {/* Minute Hand Shadow */}
        <div style={{
          ...handBaseStyle,
          width: '1vmin',
          height: '35vmin',
          filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.6))',
          transform: `translate(-50%, 0) rotate(${minuteDeg}deg)`,
          zIndex: 3,
        }} />

        {/* Center Pin Shadow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '3vmin',
          height: '3vmin',
          backgroundColor: 'transparent',
          borderRadius: '50%',
          filter: 'drop-shadow(0 0 5px white)',
          transform: 'translate(-50%, -50%)',
          zIndex: 4
        }} />
      </div>
    </div>
  );
};

export default AnalogClockTemplate;
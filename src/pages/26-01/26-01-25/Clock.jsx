import React, { useEffect, useState } from 'react';

// Assets
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

  // --- Animation Logic ---
  const fadeInOutKeyframes = `
    @keyframes fadeInOut {
      0% { opacity: 0; }
      10% { opacity: 0.05; }
      20% { opacity: 0.1; }
      30% { opacity: 0.02; }
      40% { opacity: 0; }
      50% { opacity: 0.08; }
      60% { opacity: 0.12; }
      70% { opacity: 0.02; }
      80% { opacity: 0.1; }
      90% { opacity: 0.0; }
      100% { opacity: 0.04; }
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
    backgroundColor: '#000', // Solid back for when it's invisible
    fontFamily: fontReady ? "'BorrowedAnalog', system-ui, sans-serif" : 'system-ui, sans-serif',
  };

  const faceContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '110vmin',
    height: '110vmin',
    borderRadius: '50%',
    // Apply animation here: 3 seconds duration, ease-in-out, infinite loop, alternates direction
    animation: 'fadeInOut 13s ease-in-out infinite alternate',
  };

  const handBaseStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: '50% 100%',
    borderRadius: '999px',
  };

  return (
    <div style={containerStyle}>
      {/* Injecting keyframes into the head */}
      <style>{fadeInOutKeyframes}</style>
      
      <div style={faceContainerStyle}>
        {/* Hour Hand */}
        <div style={{
          ...handBaseStyle,
          width: '1.2vmin',
          height: '20vmin',
          background: 'linear-gradient(to top, #888787, #FFFFFFA0, #FCEEC7D8)',
          transform: `translate(-50%, 0) rotate(${hourDeg}deg)`,
          zIndex: 2,
        }} />
        
        {/* Minute Hand */}
        <div style={{
          ...handBaseStyle,
          width: '0.8vmin',
          height: '35vmin',
          background: 'linear-gradient(to top, #ADADAD, #FFFFFFAD, #F8EED5F4)',
          transform: `translate(-50%, 0) rotate(${minuteDeg}deg)`,
          zIndex: 3,
        }} />
      </div>
    </div>
  );
};

export default AnalogClockTemplate;
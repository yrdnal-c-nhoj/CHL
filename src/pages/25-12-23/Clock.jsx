import React, { useState, useEffect } from 'react';
import symJpg from '../../assets/clocks/25-12-23/sym.jpg';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!document.getElementById('google-font-space-mono')) {
      const link = document.createElement('link');
      link.id = 'google-font-space-mono';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Space+Mono&display=swap';
      document.head.appendChild(link);
    }

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${symJpg})`,
    backgroundSize: '30px 15px',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    fontFamily: '"Space Mono", monospace',
  };

  const centerLineStyle = {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: '5px',
    backgroundColor: '#F5D9D9',
    zIndex: 10, // Sits on top of all clock layers
    transform: 'translateX(-50%)',
  };

  const Layer = ({ value, size, zIndex, opacity }) => {
    const digits = value.split('');
    
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: size,
        zIndex: zIndex,
        opacity: opacity,
        color: '#F5D9D9',
        pointerEvents: 'none',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {/* Symmetrical squeeze: margins move digits toward the center line */}
        <span style={{ marginRight: '-0.12em' }}>{digits[0]}</span>
        <span style={{ marginLeft: '-0.12em' }}>{digits[1]}</span>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      {/* The 1px Center Guide Line */}
      <div style={centerLineStyle} />

      {/* Clock Layers */}
      <Layer value={seconds} size="80vh" zIndex={1} opacity={0.8} />
      <Layer value={minutes} size="50vh" zIndex={2} opacity={0.9} />
      <Layer value={hours} size="25vh" zIndex={3} opacity={1} />
    </div>
  );
};

export default DigitalClock;
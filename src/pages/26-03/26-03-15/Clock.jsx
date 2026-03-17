import React, { useState, useEffect, useMemo } from 'react';
import './Clock.css';

const Clock = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    const timeInterval = setInterval(() => setTime(new Date()), 1000);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timeInterval);
    };
  }, []);

  // Format time into parts
  const t = useMemo(() => {
    let hours = time.getHours(); // Keep 24-hour format
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const fH = hours.toString().padStart(2, '0'); // Always 2 digits with leading zeros
    const fM = minutes.toString().padStart(2, '0');
    const fS = seconds.toString().padStart(2, '0');

    return { 
      h1: fH[0], h2: fH[1], 
      m1: fM[0], m2: fM[1], 
      s1: fS[0], s2: fS[1], 
      seconds 
    };
  }, [time]);

  // Memoize the shadow string to avoid redundant string concatenation
  const dynamicShadow = useMemo(() => {
    const angleRad = ((t.seconds / 60) * 360 * Math.PI) / 180;
    let layers = [];
    for (let i = 1; i <= 120; i++) { 
      const x = Math.round(Math.cos(angleRad) * i * 3); 
      const y = Math.round(Math.sin(angleRad) * i * 3);
      const opacity = Math.max(0, 1 - (i / 120));
      layers.push(`${x}px ${y}px 0 rgba(0,0,0,${opacity * 0.4})`); 
    }
    return layers.join(', ');
  }, [t.seconds]);

  // Styles
  const containerStyle = {
    minHeight: '100dvh',
    background: 'radial-gradient(circle at center, rgba(221, 131, 131, 0) 0%, rgba(221, 131, 131, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    border: '5px solid #000000',
    boxSizing: 'border-box'
  };

  const digitBox = {
    display: 'inline-block',
    width: windowWidth < 600 ? '12vw' : '10vw',
    textAlign: 'center',
    verticalAlign: 'baseline'
  };

  const textBase = {
    fontFamily: '"26-03-15-shadow", "Avant Garde", Avantgarde, "Century Gothic", CenturyGothic, "AppleGothic", sans-serif',
    color: '#DD8383',
    textShadow: dynamicShadow,
    transition: 'text-shadow 0.5s ease-out',
    fontSize: windowWidth < 600 ? '44vw' : '36vw',
    margin: '0'
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <div style={digitBox}><span style={textBase}>{t.h1}</span></div>
          <div style={digitBox}><span style={textBase}>{t.h2}</span></div>
           <div style={digitBox}><span style={textBase}>{t.m1}</span></div>
          <div style={digitBox}><span style={textBase}>{t.m2}</span></div>
          <div style={digitBox}><span style={textBase}>{t.s1}</span></div>
          <div style={digitBox}><span style={textBase}>{t.s2}</span></div>
        </div>
    </div>
  );
};

export default Clock;
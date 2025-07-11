import React, { useEffect, useState } from 'react';
import suvFont from './suv.ttf';
import suvImage from './suv.gif';
import suvBackground from './suvx.jpg';

const Clock = () => {
  const [time, setTime] = useState({
    h: '00',
    m: '00',
    s: '00',
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const pad = (num) => num.toString().padStart(2, '0');
      setTime({
        h: pad(now.getHours()),
        m: pad(now.getMinutes()),
        s: pad(now.getSeconds()),
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const fontFace = `
    @font-face {
      font-family: 'suv';
      src: url(${suvFont}) format('truetype');
    }
  `;

  const bodyStyle = {
    margin: 0,
    height: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    background: '#670a53',
    fontFamily: 'suv, sans-serif',
    fontSize: '10vw',
    padding: '2vw',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const clockStyle = {
    position: 'relative',
    left: '60vw',
    top: '48vh',
    color: 'rgb(234, 235, 233)',
    textShadow: '#090802 0.1rem 0.1rem',
    display: 'flex',
    fontSize: '1rem',
    textAlign: 'left',
    zIndex: 2,
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: "'tnum'",
    lineHeight: 1,
    gap: 0,
  };

  const spanStyle = {
    display: 'block',
    textAlign: 'left',
  };

  const bgStyle1 = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${suvImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'brightness(160%) saturate(90%) hue-rotate(30deg)',
    zIndex: 2,
    pointerEvents: 'none',
    transform: 'scaleX(-1)',
  };

  const bgStyle2 = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${suvBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'brightness(300%) saturate(30%) hue-rotate(30deg)',
    zIndex: 1,
    pointerEvents: 'none',
  };

  return (
    <div style={bodyStyle}>
      <style>{fontFace}</style>
      <div style={bgStyle2}></div>
      <div style={bgStyle1}></div>
      <div style={clockStyle}>
        <span style={spanStyle}>{time.h}</span>
        <span style={spanStyle}>{time.m}</span>
        <span style={spanStyle}>{time.s}</span>
      </div>
    </div>
  );
};

export default Clock;

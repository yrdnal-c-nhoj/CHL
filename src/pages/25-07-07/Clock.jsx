import React, { useEffect, useState } from 'react';
import suvFont from './suv.ttf';
import suvImage from './suv.gif';
import suvBackground from './suvx.jpg';

const Clock = () => {
  const [time, setTime] = useState({
    h: '00',
    m: '00',
    ampm: 'AM',
  });

  useEffect(() => {
    const font = new FontFace('suv', `url(${suvFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12;

      setTime({
        h: String(hours).padStart(2, '0'),
        m: String(minutes).padStart(2, '0'),
        ampm,
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    margin: 0,
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    background: '#7E8280FF',
    fontFamily: 'suv, sans-serif',
    padding: '0vw',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const clockStyle = {
    position: 'fixed',
    left: '200px',
    top: '51vh',
    transform: 'translateY(-50%)',
    display: 'flex',
    textAlign: 'left',
    zIndex: 2,
    lineHeight: 1,
    gap: '0rem',
  };

  const spanStyle = {
    fontFamily: 'suv, sans-serif',
    display: 'block',
    fontSize: '1.1rem',
    color: 'transparent',
    backgroundImage: `
      linear-gradient(
        145deg,
        #ffffff 0%,
        #d0d0d0 25%,
        #b0b0b0 50%,
        #eeeeee 70%,
        #999999 100%
      )
    `,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: `
      0.05rem 0.05rem 0.1rem rgba(255, 255, 255, 0.8),
      -0.05rem -0.05rem 0.1rem rgba(0, 0, 0, 0.4),
      0.05rem -0.05rem 0.03rem rgba(255, 255, 255, 0.3),
      -0.05rem 0.05rem 0.03rem rgba(0, 0, 0, 0.3),
      0 0 0.1rem rgba(255, 255, 255, 0.4)
    `,
    fontWeight: 900,
    letterSpacing: '-0.1rem',
  };

 const bgImageStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundImage: `url(${suvImage})`,
  backgroundPosition: 'right bottom',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'auto 100vh', // ensures full vertical fit
  filter: 'brightness(160%) saturate(190%) hue-rotate(30deg)',
  zIndex: 2,
  pointerEvents: 'none',
  transform: 'scaleX(-1)',
};


  const bgImage2Style = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${suvBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'brightness(100%) saturate(120%)',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={bgImage2Style} />
      <div style={bgImageStyle} />
      <div id="clock" style={clockStyle}>
        <span style={spanStyle}>{time.h}</span>
        <span style={spanStyle}>{time.m}</span>
        <span style={spanStyle}>{time.ampm}</span>
      </div>
    </div>
  );
};

export default Clock;

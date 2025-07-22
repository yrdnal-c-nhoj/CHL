import React, { useEffect, useState } from 'react';
import suvFont from './suv.ttf';
import suvImage from './images/suv.gif';
import suvBackground from './images/suvx.jpg';

const Clock = () => {
  const [time, setTime] = useState({
    h: '00',
    m: '00',
    ampm: 'AM',
  });

  useEffect(() => {
    // Inject font
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
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    background: '#378a69',
    fontFamily: 'suv, sans-serif',
    fontSize: '10vw',
    padding: '0vw',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const clockStyle = {
    position: 'fixed',
    right: '30vw',
    top: '51vh',
    transform: 'translateY(-50%)',
    color: 'rgb(226, 224, 234)',
    textShadow: '#090802 0.1rem 0.1rem, #f3f3ee -0.1rem 0rem',
    display: 'flex',
    fontSize: '0.8rem',
    textAlign: 'left',
    zIndex: 2,
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: "'tnum'",
    lineHeight: 1,
    opacity: 0.8,
    gap: 0,
  };

  const spanStyle = {
    display: 'block',
    textAlign: 'left',
  };

  const ampmStyle = {
    marginLeft: '0vw',
    fontSize: '0.8em',
    alignSelf: 'flex-end',
  };

  const bgImageStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${suvImage})`,
    backgroundPosition: 'left',
    backgroundRepeat: 'no-repeat',
    filter: 'brightness(160%) saturate(90%) hue-rotate(30deg)',
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
    filter: 'brightness(300%) saturate(30%) hue-rotate(30deg)',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={bgImage2Style} />
      <div style={bgImageStyle} />
      <div id="clock" style={clockStyle}>
        <span style={spanStyle}>{time.h}</span>
        <span style={spanStyle}>{time.m}</span>
        <span style={{ ...spanStyle, ...ampmStyle }}>{time.ampm}</span>
      </div>
    </div>
  );
};

export default Clock;

import React, { useEffect, useState } from 'react';
import bgImage from './cis.jpg';
import cisFont from './cis.ttf';

const CistercianClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const font = new FontFace('cis', `url(${cisFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });

    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => n.toString().padStart(2, '0');

  const containerStyle = {
    margin: 0,
    background: 'rgb(34, 4, 4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100dvh',
    width: '100vw',
    textAlign: 'center',
    overflow: 'hidden',
  };

  const clockStyle = {
    fontFamily: 'cis',
    color: 'rgb(244, 239, 231)',
    textShadow: '#0b0a0a -0.1rem -0.1rem',
    display: 'flex',
    flexDirection: window.innerWidth >= 768 ? 'row' : 'column',
    gap: '2rem',
    fontSize: '4rem',
    zIndex: 4,
  };

const bgStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh', // Use exactly 100vh to match the viewport
  backgroundImage: `url(${bgImage})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',           // Ensures it stretches to cover the whole viewport
  backgroundPosition: 'center',      // Keeps the image centered
  zIndex: 1,
  filter: 'contrast(140%) brightness(120%) saturate(30%)',
};

  return (
    <div style={containerStyle}>
      <div style={bgStyle} />

      <div style={clockStyle}>
        <div>{pad(time.getHours())}</div>
        <div>{pad(time.getMinutes())}</div>
        <div>{pad(time.getSeconds())}</div>
      </div>
    </div>
  );
};

export default CistercianClock;

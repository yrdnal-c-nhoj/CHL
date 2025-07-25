import React, { useEffect, useState } from 'react';
import backgroundImg from './bay01s52djxo1_400.webp';
import bayFont from './bay.ttf';

const Clock = () => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now
        .toLocaleTimeString('en-GB', { hour12: false })
        .replace(/:/g, ':');
      setTimeStr(time);
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.body}>
      <style>
        {`
          @font-face {
            font-family: 'bay';
            src: url(${bayFont}) format('truetype');
          }
        `}
      </style>



     
      <img src={backgroundImg} alt="background" style={styles.bgimage} />

      <div style={styles.clock}>
        {timeStr.split('').map((char, index) => (
          <div
            key={index}
            style={char === ':' ? styles.colon : styles.digit}
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    margin: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  clock: {
    display: 'flex',
    backgroundColor: '#514e4e',
    borderRadius: '0.6rem',
    // boxShadow: '0 0.4rem 1rem rgba(215, 220, 234, 0.5)',
    zIndex: 5,
  },
  digit: {
    width: '2.9rem',
    height: '4rem',
    fontFamily: 'bay, monospace',
    fontSize: '4rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #60ff04, hsl(219, 82%, 65%))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0.4rem',
    userSelect: 'none',
  },
  colon: {
    width: '0.9rem',
    height: '4rem',
    fontFamily: 'Roboto Mono, monospace',
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #60ff04, hsl(219, 82%, 65%))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0.4rem',
    userSelect: 'none',
  },
  bgimage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '150vw',
    height: '150vh',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    opacity: 0.3,
    transformOrigin: 'center center',
  },
};

export default Clock;

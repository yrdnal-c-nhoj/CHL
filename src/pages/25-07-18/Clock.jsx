import React, { useEffect, useState } from 'react';
import bgImage from './558074085193-ezgif.com-optiwebp-1.webp';
import xrayFontUrl from './xray.ttf';

const HospitalClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const font = new FontFace('xray', `url(${xrayFontUrl})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
    });

    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
      setTime(`${h}:${m}:${s}.${ms}`);
    };

    const interval = setInterval(updateClock, 50);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.body}>
      <div style={styles.machine}>
        <div style={{ ...styles.screen, backgroundImage: `url(${bgImage})` }}>
          <div style={styles.flickerOverlay} />
          <div style={styles.clock}>
            {time.split('').map((char, i) => (
              <span key={i} style={styles.digit}>{char}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    height: '100vh',
    background: '#313131FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
  },
  machine: {
    background: '#575656',
    border: '1.5rem solid #9a9595',
    borderRadius: '2rem',
    padding: '2rem',
    boxShadow: 'inset 0 0 6vh #000, 0 0 3vh rgba(0,255,255,0.1), 0 0 8vh rgba(0,255,255,0.2)',
    width: '80vw',
    maxWidth: '90rem',
    height: '60vh',
    maxHeight: '50rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
  },
  screen: {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    flexGrow: 1,
    margin: '1rem 0',
    border: '0.3rem solid rgb(201, 204, 204)',
    borderRadius: '1rem',
    position: 'relative',
    boxShadow: '0 0 1.5rem #9ca1a1, inset 0 0 6rem rgba(0,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  clock: {
    display: 'flex',
    gap: '0.2rem',
    fontSize: '6vw',
    fontFamily: 'xray, monospace',
    color: '#d4dcdc',
    textShadow: '0 0 0.4rem #ebf0f0, 0 0 1.2rem #f1dddd, 0 0 2.4rem #c5caca',
    animation: 'pulse 1s infinite',
    zIndex: 2,
    position: 'relative',
  },
  digit: {
    display: 'inline-block',
    minWidth: '1ch',
    textAlign: 'center',
  },
  flickerOverlay: {
    content: "''",
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    background: `repeating-linear-gradient(
      to bottom,
      rgba(184, 190, 190, 0.03),
      rgba(0, 255, 255, 0.03) 1px,
      transparent 1px,
      transparent 3px
    )`,
    pointerEvents: 'none',
    animation: 'flicker 0.3s infinite alternate',
    zIndex: 1,
  },
};

export default HospitalClock;

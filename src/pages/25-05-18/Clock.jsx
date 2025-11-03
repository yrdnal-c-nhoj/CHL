import React, { useEffect, useState } from 'react';
import bluFont from './blu.otf'; // local font
import image1 from './8mMt.gif'; // bottom layer
import image2 from './13966281486_Volantis_Tumblr.gif'; // middle layer
import image3 from './bloo.gif'; // top layer

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (unit) => String(unit).padStart(2, '0');
  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  return (
    <div style={styles.container}>
      {/* Inject the font via <style> */}
      <style>
        {`
          @font-face {
            font-family: 'blu';
            src: url('${bluFont}') format('opentype');
            font-display: swap;
          }
        `}
      </style>

      {/* Background images */}
      <img src={image1} alt="bg1" style={styles.image1} />
      <img src={image2} alt="bg2" style={styles.image2} />
      <img src={image3} alt="bg3" style={styles.image3} />

      {/* Clock digits */}
      <div style={styles.clock}>
        <span style={styles.digit}>{hours[0]}</span>
        <span style={styles.digit}>{hours[1]}</span>
        <span style={styles.digit}>{minutes[0]}</span>
        <span style={styles.digit}>{minutes[1]}</span>
        <span style={styles.digit}>{seconds[0]}</span>
        <span style={styles.digit}>{seconds[1]}</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
    background: 'black',
    fontFamily: `'blu', monospace`,
  },
  clock: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    gap: '0.5rem',
    zIndex: 10,
  },
  digit: {
    fontSize: '19vh',
    lineHeight: '19vh',
    width: '6vw',
    textAlign: 'center',
    color: '#6BBAE8FF',
    textShadow: '0 0 20px #fff, 0 0 30px #00f, 0 0 40px #0ff',
    userSelect: 'none',
    fontVariantNumeric: 'tabular-nums',
  },
  image1: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: 1,
    opacity: 0.8,
    transform: 'scaleX(-1) scaleY(-1)',
    filter: 'contrast(150%) brightness(150%)',
  },
  image2: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: 2,
    opacity: 0.4,
    transform: 'scaleX(-1) scaleY(-1)',
  },
  image3: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: 3,
    opacity: 0.3,
    transform: 'scaleX(-1)',
  },
};

export default Clock;

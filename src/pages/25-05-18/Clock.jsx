import React, { useEffect, useState } from 'react';
import bluFont from './blu.otf';
import image1 from './8mMt.gif';
import image2 from './13966281486_Volantis_Tumblr.gif';
import image3 from './bloo.gif';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (unit) => String(unit).padStart(2, '0');
  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  return (
    <div style={styles.container}>
      <style>
        {`
          @font-face {
            font-family: 'blu';
            src: url(${bluFont}) format('opentype');
            font-display: swap;
          }

          html, body, #root {
            margin: 0;
            padding: 0;
            height: 100dvh;
            width: 100vw;
            overflow: hidden;
            background: black;
            font-family: 'blu', monospace;
          }

          .clock {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            z-index: 10;
          }

          .digit {
            font-size: 19vh;
            width: 6vw;
            height: 10vh;
            text-align: center;
            color: #7BC8C8FF;
            line-height: 10vh;
            text-shadow: 0 0 10px #fff, 0 0 20px #00f, 0 0 30px #0ff;
            user-select: none;
            font-variant-numeric: tabular-nums;
          }

          }
        `}
      </style>

      <img src={image1} alt="bg1" style={styles.image1} />
      <img src={image2} alt="bg2" style={styles.image2} />
      <img src={image3} alt="bg3" style={styles.image3} />

      <div className="clock" style={styles.clock}>
        <span className="digit">{hours[0]}</span>
        <span className="digit">{hours[1]}</span>
        <span className="digit">{minutes[0]}</span>
        <span className="digit">{minutes[1]}</span>
        <span className="digit">{seconds[0]}</span>
        <span className="digit">{seconds[1]}</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    position: 'relative',
    background: 'black',
  },
  clock: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  image1: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '300vw',
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

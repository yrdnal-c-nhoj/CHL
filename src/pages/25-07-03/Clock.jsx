import { useEffect, useRef } from 'react';
import rocketGif from './rocket.gif';
import rockFont from './rock.ttf';

const Clock = () => {
  const clockRef = useRef(null);

  useEffect(() => {
    const font = new FontFace('rock', `url(${rockFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });

    const updateClock = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      const ms = now.getMilliseconds().toString().padStart(3, '0');
      if (clockRef.current) {
        clockRef.current.textContent = `T-${h}:${m}:${s}.${ms}`;
      }
      requestAnimationFrame(updateClock);
    };

    requestAnimationFrame(updateClock);
  }, []);

  const containerStyle = {
    margin: 0,
    padding: 0,
    height: '100dvh',
    width: '100vw',
    backgroundImage: `url(${rocketGif})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const clockStyle = {
    fontFamily: 'rock',
    color: 'rgb(255, 0, 47)',
    fontSize: '1.8rem',
  };

  return (
    <div style={containerStyle}>
      <div id="clock" ref={clockRef} style={clockStyle}></div>
    </div>
  );
};

export default Clock;

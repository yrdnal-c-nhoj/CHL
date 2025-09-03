import React, { useEffect, useState } from 'react';
import stretchFont from './stretch.ttf';

const StretchClock = () => {
  const [time, setTime] = useState({ hours: '', minutes: '', seconds: '' });

  useEffect(() => {
    const font = new FontFace('stretch', `url(${stretchFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds();

      setTime((prev) => ({
        hours: prev.hours !== hours.toString() ? hours.toString() : prev.hours,
        minutes: prev.minutes !== minutes ? minutes : prev.minutes,
        seconds: prev.seconds !== seconds.toString() ? seconds.toString() : prev.seconds,
      }));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const clockStyle = {
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'repeating-linear-gradient(335deg, #07bb4f 0, #e51a8a 0.2px, transparent 0, transparent 50%)',
    backgroundSize: '1.1vw 1.1vw',
    backgroundColor: '#bbcdc4',
    position: 'relative',
    fontSize: '4rem',
  };

  const baseTimeUnitStyle = (color, opacity, zIndex) => ({
    fontFamily: 'stretch',
    position: 'absolute',
    width: '100%',
    height: '100%',
    fontSize: '7rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    textAlign: 'center',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    color,
    opacity,
    zIndex,
  });

  const spanStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'scale(3.5, 2) skew(30deg)',
    width: '100%',
    height: '100%',
    lineHeight: 1,
  };

  return (
    <div style={clockStyle}>
      <div style={baseTimeUnitStyle('#090213', 1, 1)}>
        <span
          key={time.hours}
          style={spanStyle}
          className="morph"
        >
          {time.hours}
        </span>
      </div>
      <div style={baseTimeUnitStyle('#76f705', 0.8, 2)}>
        <span
          key={time.minutes}
          style={spanStyle}
          className="morph"
        >
          {time.minutes}
        </span>
      </div>
      <div style={baseTimeUnitStyle('#eefa03', 0.6, 3)}>
        <span
          key={time.seconds}
          style={spanStyle}
          className="morph"
        >
          {time.seconds}
        </span>
      </div>
      <style>{`
        @keyframes morph {
          0% {
            transform: scale(3.5, 2) skew(40deg) rotateX(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(3.0, 1.5) skew(20deg) rotateX(45deg);
            opacity: 0.5;
          }
          100% {
            transform: scale(3.5, 2) skew(30deg) rotateX(0deg);
            opacity: 1;
          }
        }

        .morph {
          animation: morph 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default StretchClock;

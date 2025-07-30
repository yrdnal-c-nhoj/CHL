import React, { useEffect, useRef } from 'react';
import bgImage from './bad.png';
import hourImg from './ba.png';
import minuteImg from './ba.png';
import secondImg from './ba.png';
import fontUrl from './Oswald.ttf';

const AnalogClock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const font = new FontFace('CustomFont', `url(${fontUrl})`);
    font.load().then(() => {
      document.fonts.add(font);
    });

    const updateClock = () => {
      const now = new Date();
      const hr = now.getHours() % 12;
      const min = now.getMinutes();
      const sec = now.getSeconds();
      const ms = now.getMilliseconds();

      const hourAngle = (hr + min / 60 + sec / 3600) * 30; // 360/12
      const minuteAngle = (min + sec / 60 + ms / 60000) * 6; // 360/60
      const secondAngle = (sec + ms / 1000) * 6;

      if (hourRef.current) hourRef.current.style.transform = `rotate(${hourAngle}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteAngle}deg)`;
      if (secondRef.current) secondRef.current.style.transform = `rotate(${secondAngle}deg)`;

      requestAnimationFrame(updateClock);
    };

    requestAnimationFrame(updateClock);
  }, []);

  const wrapperStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'CustomFont, sans-serif',
  };

  const clockStyle = {
    position: 'relative',
    width: '60vw',
    height: '60vw',
    maxWidth: '90vh',
    maxHeight: '90vh',
  };

  const handStyle = (width, height, zIndex) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width,
    height,
    transformOrigin: '50% 100%',
    transform: 'rotate(0deg)',
    zIndex,
    pointerEvents: 'none',
  });

  return (
    <div style={wrapperStyle}>
      <div style={clockStyle}>
        <img ref={hourRef} src={hourImg} alt="hour" style={handStyle('3vw', '20vw', 2)} />
        <img ref={minuteRef} src={minuteImg} alt="minute" style={handStyle('2.5vw', '28vw', 3)} />
        <img ref={secondRef} src={secondImg} alt="second" style={handStyle('1vw', '35vw', 4)} />
      </div>
    </div>
  );
};

export default AnalogClock;

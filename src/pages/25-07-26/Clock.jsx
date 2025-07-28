import React, { useEffect, useRef, useState } from 'react';
import bg1 from './tum.gif';
import bg2 from './tum2.gif';
import myFontUrl from './sec.ttf';

const PrimaryColorClock = () => {
  const secondHandRef = useRef(null);
  const minHandRef = useRef(null);
  const hourHandRef = useRef(null);

  const COLORS = ['#CB0BEDFF', '#25E90CFF', '#F58E0FFF'];
  const [numberColors, setNumberColors] = useState(() =>
    Array.from({ length: 12 }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
  );

  // Clock hand movement
  useEffect(() => {
    const setDate = () => {
      const now = new Date();

      const seconds = now.getSeconds();
      const secondsDegrees = ((seconds / 60) * 360) + 90;
      secondHandRef.current.style.transform = `rotate(${secondsDegrees}deg)`;

      const mins = now.getMinutes();
      const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
      minHandRef.current.style.transform = `rotate(${minsDegrees}deg)`;

      const hour = now.getHours();
      const hourDegrees = ((hour / 12) * 360) + ((mins / 60) * 30) + 90;
      hourHandRef.current.style.transform = `rotate(${hourDegrees}deg)`;
    };

    setDate();
    const clockInterval = setInterval(setDate, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Color changer
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setNumberColors(
        Array.from({ length: 12 }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
      );
    }, 1000);
    return () => clearInterval(colorInterval);
  }, []);

  const fontFace = `
    @font-face {
      font-family: 'MyFont';
      src: url(${myFontUrl}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `;

  const styleTag = <style>{fontFace}</style>;

  const containerStyle = {
    height: '100vh',
    width: '100vw',
    margin: 0,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(234, 119, 10)',
    position: 'relative',
    fontFamily: 'MyFont, sans-serif',
  };

  const bgStyle1 = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '150vw',
    height: '150vh',
    backgroundImage: `url(${bg1})`,
    backgroundRepeat: 'repeat',
    backgroundSize: '59vh 12vw',
    backgroundAttachment: 'fixed',
    zIndex: 1,
    pointerEvents: 'none',
    opacity: 0.8,
    filter: 'hue-rotate(-320deg)',
    transform: 'rotate(178deg)',
  };

  const bgStyle2 = {
    ...bgStyle1,
    transform: 'rotate(182deg)',
  };

  const centerContainerStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 5,
  };

  const clockStyle = {
    width: '12rem',
    height: '12rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const baseHandStyle = {
    position: 'absolute',
    top: '50%',
    right: '50%',
    transformOrigin: '100%',
    transitionTimingFunction: 'cubic-bezier(0.1, 2.7, 0.58, 1)',
  };

  const secondHandStyle = {
    ...baseHandStyle,
    height: '4vh',
    width: '400%',
    background: '#b503fb',
    zIndex: 18,
  };

  const minHandStyle = {
    ...baseHandStyle,
    height: '9vh',
    width: '100%',
    background: '#f76f07',
    zIndex: 11,
  };

  const hourHandStyle = {
    ...baseHandStyle,
    height: '11vh',
    width: '72%',
    background: '#09dd09',
    zIndex: 18,
  };

  const numberStyle = (i) => {
    const angle = (i - 3) * (Math.PI / 6);
    const radius = 5.5;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    return {
      position: 'absolute',
      top: `calc(50% + ${y}rem)`,
      left: `calc(50% + ${x}rem)`,
      transform: 'translate(-50%, -50%)',
      fontSize: '3.2rem',
      fontWeight: 'bold',
      color: numberColors[i - 1],
      fontFamily: 'MyFont, sans-serif',
      zIndex: 19,
      transition: 'color 0.3s ease',
    };
  };

  return (
    <>
      {styleTag}
      <div style={containerStyle}>
        <div style={bgStyle1}></div>
        <div style={bgStyle2}></div>

        <div style={centerContainerStyle}>
          <div style={clockStyle}>
            {[...Array(12)].map((_, i) => (
              <div key={i + 1} style={numberStyle(i + 1)}>
                {i + 1}
              </div>
            ))}
            <div ref={minHandRef} style={minHandStyle} />
            <div ref={hourHandRef} style={hourHandStyle} />
            <div ref={secondHandRef} style={secondHandStyle} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PrimaryColorClock;

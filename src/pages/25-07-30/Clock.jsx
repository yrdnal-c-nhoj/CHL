import React, { useEffect, useState } from 'react';
import clockBg from './ca.gif';
import fullBg from './ca.gif';
import myFont from './Cam.ttf'; // Import font

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  // Inject @font-face as a scoped <style> tag
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'CustomFont';
        src: url(${myFont}) format('truetype');
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getRotationStyles = () => {
    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = time.getHours() % 12 + minutes / 60;

    return {
      hourStyle: {
        transform: `rotate(${(360 / 12) * hours}deg)`,
      },
      minuteStyle: {
        transform: `rotate(${(360 / 60) * minutes}deg)`,
      },
      secondStyle: {
        transform: `rotate(${(360 / 60) * seconds}deg)`,
      },
    };
  };

  const { hourStyle, minuteStyle, secondStyle } = getRotationStyles();

  const wrapperStyle = {
    height: '100dvh',
    width: '100vw',
    backgroundImage: `url(${fullBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const clockContainer = {
    position: 'relative',
    width: '80vmin',
    height: '80vmin',
    borderRadius: '50%',
    backgroundImage: `url(${clockBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const handCommon = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    transition: 'transform 0.05s linear',
  };

  const hourHand = {
    ...handCommon,
    height: '20%',
    width: '4.5%',
    background: '#5C7461FF',
    zIndex: 3,
    ...hourStyle,
  };

  const minuteHand = {
    ...handCommon,
    height: '30%',
    width: '3%',
   background: '#B9A68CFF',
    zIndex: 2,
    ...minuteStyle,
  };

  const secondHand = {
    ...handCommon,
    height: '40%',
    width: '0.5%',
   background: '#454745FF',
    zIndex: 1,
    ...secondStyle,
  };

  const centerDot = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0%',
    height: '0%',
    background: '#F48208FF',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 5,
  };

  const numberStyle = (n) => {
    const angle = (n - 3) * (Math.PI * 2) / 12;
    const radius = 38;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return {
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)',
      fontSize: '7rem',
      color: '#7E8A73FF',
      opacity: 0.4,
      textShadow: '0 0 0.5rem black',
      fontFamily: 'CustomFont, sans-serif',
    };
  };

  return (
    <div style={wrapperStyle}>
      <div style={clockContainer}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={numberStyle(i + 1)}>
            {i + 1}
          </div>
        ))}
        <div style={hourHand}></div>
        <div style={minuteHand}></div>
        <div style={secondHand}></div>
        <div style={centerDot}></div>
      </div>
    </div>
  );
};

export default Clock;

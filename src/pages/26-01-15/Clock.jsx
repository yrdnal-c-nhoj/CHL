import React, { useEffect, useState } from 'react';
import fullBg from "../../assets/clocks/26-01-15/sph.gif";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 60fps update for smooth movement
    const interval = setInterval(() => setTime(new Date()), 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  const getRotationStyles = () => {
    const ms = time.getMilliseconds();
    const seconds = time.getSeconds() + ms / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    return {
      hourStyle: { transform: `translateX(-50%) rotate(${(360 / 12) * hours}deg)` },
      minuteStyle: { transform: `translateX(-50%) rotate(${(360 / 60) * minutes}deg)` },
      secondStyle: { transform: `translateX(-50%) rotate(${(360 / 60) * seconds}deg)` },
    };
  };

  const { hourStyle, minuteStyle, secondStyle } = getRotationStyles();

  // STYLES
  const wrapperStyle = {
    height: '100dvh',
    width: '100vw',
    backgroundColor: '#EA1111', // The bright red base
    backgroundImage: `url(${fullBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'multiply', // Blends image with the red color
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const clockContainer = {
    position: 'relative',
    width: '75vmin',
    height: '75vmin',
    borderRadius: '50%',
    border: '0px solid rgba(255,255,255,0.2)', // Optional: subtle ring
  };

  const handCommon = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '4px',
  };

  const hourHand = {
    ...handCommon,
    height: '17%',
    width: '1%',
    background: '#F20505', // Changed to white for better contrast on red
    zIndex: 3,
    ...hourStyle,
  };

  const minuteHand = {
    ...handCommon,
    height: '30%',
    width: '0.5%',
    background: '#FC0404',
    zIndex: 2,
    ...minuteStyle,
  };



  return (
    <div style={wrapperStyle}>
      <div style={clockContainer}>
        {/* Hands */}
        <div style={hourHand}></div>
        <div style={minuteHand}></div>

      </div>
    </div>
  );
};

export default Clock;
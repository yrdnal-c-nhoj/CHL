import React, { useState, useEffect } from 'react';
import CustomFont from './mem.ttf'; // your font file
import bgImage from './mem.gif'; // your background image

export default function MessyClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  let hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // 12-hour format without leading zeros
  hours = hours % 12 || 12;

  const formatNumber = (num) => num.toString().padStart(2, '0');

  const clockStyle = {
    fontFamily: `'CustomFont', sans-serif`,
    fontSize: '20vh', // very large, scales with viewport height
    color: '#B6C8C9FF', // golden color for drama
    textShadow: '1px 0 2rem #350342FF, 0 3px 4rem #AF0404FF', // dramatic glow
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100dvh',
    width: '100vw',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(0.3rem) brightness(0.6) contrast(1.8)', // filter only on background
    overflow: 'hidden',
    transform: 'skew(-10deg, 5deg) scaleX(1.2) scaleY(1.1)', // distort/stretch digits
  };

  const timeString = `${hours}:${formatNumber(minutes)}`;

  return (
    <div style={clockStyle}>
      <style>
        {`@font-face {
            font-family: 'CustomFont';
            src: url(${CustomFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
        }`}
      </style>
      {timeString}
    </div>
  );
}

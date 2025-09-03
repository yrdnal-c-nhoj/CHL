import React, { useEffect, useState } from 'react';
import customFont from './gol.ttf'; // Import your custom font
import backgroundImage from './go.gif';

const Clock = () => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getFormattedTime = () => {
    let h = time.getHours() % 12;
    if (h === 0) h = 12;
    const m = time.getMinutes();
    return `${h}${m.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      height: '100dvh',
      width: '100vw',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: 'CustomFont, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <style>
        {`
          @font-face {
            font-family: 'CustomFont';
            src: url(${customFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
      <div style={{ fontSize: '4rem', color: '#F0ECD8FF', textShadow: '0 0 1rem black' }}>
        {getFormattedTime()}
      </div>
    </div>
  );
};

export default Clock;

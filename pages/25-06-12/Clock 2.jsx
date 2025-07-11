import React, { useEffect, useState } from 'react';
import bgImage from './auth.jpg';
import cattleFont from './cattle.ttf';

const CattleBrandClock = () => {
  const [time, setTime] = useState({ hours: 12, minutes: '00' });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();

      hours = hours % 12 || 12;
      const minStr = minutes.toString().padStart(2, '0');
      setTime({ hours, minutes: minStr });
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const style = {
    '@font-face': [
      {
        fontFamily: 'cattle',
        src: `url(${cattleFont}) format('truetype')`,
      },
    ],
  };

  return (
    <div style={{ fontSize: '1rem', margin: 0, height: '100vh', width: '100vw', fontFamily: 'cattle' }}>
      <style>
        {`
          @font-face {
            font-family: 'cattle';
            src: url(${cattleFont}) format('truetype');
          }
        `}
      </style>

      <img
        src={bgImage}
        alt="Background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '120vw',
          height: '110vh',
          backgroundRepeat: 'repeat',
          zIndex: 1,
        }}
      />


      

      <div
        style={{
          position: 'relative',
          right: '-65vw',
          bottom: '-60vh',
          fontSize: '4rem',
          display: 'flex',
          fontFamily: 'cattle',
          alignItems: 'baseline',
          color: '#331a00',
          textShadow: `
            0 0 0.0625rem #000,
            0 0 0.1875rem #2b1a00,
            0.0625rem 0.0625rem 0 rgba(255, 180, 100, 0.2),
            -0.0625rem -0.0625rem 0 rgba(255, 180, 100, 0.2),
            0 0 0.625rem rgba(50, 30, 10, 0.8)
          `,
          zIndex: 2,
          transform: 'rotate(-8deg)',
        }}
      >
        <div id="hours">{time.hours}</div>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              position: 'relative',
              top: '-1.2rem',
              right: '-0.4rem',
              transform: 'rotate(90deg)',
              textAlign: 'center',
            }}
          >
            {time.minutes[0]}
          </div>
          <div
            style={{
              position: 'relative',
              top: '1.5rem',
              right: '2.6rem',
              transform: 'rotate(45deg)',
              textAlign: 'center',
            }}
          >
            {time.minutes[1]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CattleBrandClock;

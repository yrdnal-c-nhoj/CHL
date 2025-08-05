import React, { useEffect } from 'react';
import fibFont from './fib.otf';
import fibImage from './fib.gif';

const FibonacciClock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      const secondDeg = (seconds / 60) * 360;
      const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
      const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

      document.querySelector('.second-hand').style.transform = `rotate(${secondDeg}deg)`;
      document.querySelector('.minute-hand').style.transform = `rotate(${minuteDeg}deg)`;
      document.querySelector('.hour-hand').style.transform = `rotate(${hourDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const fontFace = `
    @font-face {
      font-family: 'fib';
      src: url(${fibFont}) format('opentype');
    }
  `;

  const numbers = [
    { angle: 30, value: '0' },
    { angle: 60, value: '1' },
    { angle: 90, value: '1' },
    { angle: 120, value: '2' },
    { angle: 150, value: '3' },
    { angle: 180, value: '5' },
    { angle: 210, value: '8' },
    { angle: 240, value: '13' },
    { angle: 270, value: '21' },
    { angle: 300, value: '34' },
    { angle: 330, value: '55' },
    { angle: 0, value: '89' },
  ];

  return (
    <div style={{
      margin: 0,
      height: '100vh',
      width: '100vw',
      backgroundColor: '#cac7c7',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <style>{fontFace}</style>
      <img
        src={fibImage}
        alt="background"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150vmax',
          height: '150vmax',
          objectFit: 'cover',
          filter: 'contrast(0.3) brightness(1.6) saturate(0.2)',
          zIndex: 1,
          animation: 'slow-rotate 60s linear infinite',
          transformOrigin: 'center center',
          transform: 'translate(-50%, -50%) scale(-1, -1)',
        }}
      />
      <div style={{
        width: '40vh',
        height: '40vh',
        borderRadius: '50%',
        position: 'relative',
        zIndex: 3,
      }}>
        {numbers.map(({ angle, value }, i) => (
          <div
            key={i}
            className="number"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `rotate(${angle}deg)`,
              transformOrigin: 'center',
              fontFamily: 'fib',
              fontSize: '1.7rem',
              color: '#171715',
              textShadow: '0.15rem 0.04rem #f1c72f',
            }}
          >
            <div style={{
              position: 'absolute',
              transform: 'translate(-50%, -21vh)',
            }}>
              {value}
            </div>
          </div>
        ))}

        <div className="hand hour-hand" style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '0.7vh',
          height: '6.5vh',
          backgroundColor: '#191918',
          transformOrigin: 'bottom',
          borderRadius: '0.3vh',
          filter: 'drop-shadow(0.15rem 0.04rem rgb(231, 196, 23))',
        }} />
        <div className="hand minute-hand" style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '0.5vh',
          height: '13vh',
          backgroundColor: '#191918',
          transformOrigin: 'bottom',
          borderRadius: '0.25vh',
          filter: 'drop-shadow(0.15rem 0.04rem rgb(231, 196, 23))',
        }} />
        <div className="hand second-hand" style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '0.2vh',
          height: '8vh',
          backgroundColor: 'transparent',
          transformOrigin: 'bottom',
          borderRadius: '0.2vh',
          filter: 'drop-shadow(0.15rem 0.04rem rgb(231, 196, 23))',
        }} />
        <div style={{
          width: '2.6vh',
          height: '2.6vh',
          borderRadius: '50%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.1,
          backgroundColor: '#000',
        }}></div>
      </div>
      <style>{`
        @keyframes slow-rotate {
          0% { transform: translate(-50%, -50%) scale(-1, -1) rotate(0deg); }
          100% { transform: translate(-50%, -50%) scale(-1, -1) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FibonacciClock;

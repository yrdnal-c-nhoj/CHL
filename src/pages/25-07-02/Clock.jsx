import React, { useEffect } from 'react';
import bakFont from './bak.ttf';    
import backgroundGif from './bk.gif';

const Clock = () => {
  useEffect(() => {
    const font = new FontFace('bak', `url(${bakFont})`);
    document.fonts.add(font);
    font.load();

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

      document.querySelectorAll('.number').forEach(number => {
        const numberAngle = parseFloat(number.getAttribute('data-angle'));
        const angleDiff = Math.abs(secondDeg - numberAngle);
        const isNear = angleDiff < 5 || angleDiff > 355;

        if (isNear && !number.classList.contains('spin')) {
          number.classList.add('spin');
          setTimeout(() => {
            number.classList.remove('spin');
            number.style.transform = `translate(-50%, -50%) scaleX(-1)`;
          }, 5000);
        }
      });
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    position: 'relative',
    minHeight: '100vh',
    minWidth: '100vh',
    margin: 0,
    backgroundColor: '#4f4d4d',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const clockStyle = {
    width: '70vh',
    height: '70vh',
    borderRadius: '50%',
    position: 'relative',
    transform: 'scaleX(-1)',
    perspective: '1000px',
    zIndex: 2, 
  };

  const handStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
  };

  const numbers = [
    { top: '10%', left: '50%', angle: 0, label: '12' },
    { top: '15.86%', left: '74.13%', angle: 30, label: '1' },
    { top: '30.86%', left: '85.86%', angle: 60, label: '2' },
    { top: '50%', left: '90%', angle: 90, label: '3' },
    { top: '69.14%', left: '85.86%', angle: 120, label: '4' },
    { top: '84.14%', left: '74.13%', angle: 150, label: '5' },
    { top: '90%', left: '50%', angle: 180, label: '6' },
    { top: '84.14%', left: '25.87%', angle: 210, label: '7' },
    { top: '69.14%', left: '14.14%', angle: 240, label: '8' },
    { top: '50%', left: '10%', angle: 270, label: '9' },
    { top: '30.86%', left: '14.14%', angle: 300, label: '10' },
    { top: '15.86%', left: '25.87%', angle: 330, label: '11' },
  ];

  return (
    <div style={containerStyle}>
      <img
        src={backgroundGif}
        alt="background"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          transform: 'scale(1.2)',
          transformOrigin: 'center center',
        }}
      />
   
      <div className="clock" style={clockStyle}>
        <div className="hand hour-hand" style={{ ...handStyle, width: '0.4rem', height: '6rem', background: '#634a05' }}></div>
        <div className="hand minute-hand" style={{ ...handStyle, width: '0.3rem', height: '8rem', background: '#b97c03' }}></div>
        <div className="hand second-hand" style={{ ...handStyle, width: '0.2rem', height: '9rem', background: 'rgb(148, 3, 3)' }}></div>
        <div
          className="center"
          style={{
            width: '2rem',
            height: '2rem',
            background: '#cda343',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scaleX(-1)',
          }}
        >

        </div>
        {numbers.map(({ top, left, angle, label }) => (
          <div
            key={label}
            className="number"
            data-angle={angle}
            style={{
              position: 'absolute',
              top,
              left,
              fontSize: '2.5rem',
              fontFamily: 'bak, sans-serif',
              textAlign: 'center',
              color: 'hsl(274, 96%, 18%)',
              textShadow: '#F63409FF 1px 1px',
              lineHeight: '2rem',
              transform: 'translate(-50%, -50%) scaleX(-1)',
              transformStyle: 'preserve-3d',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes spin3D {
            0% {
              transform: translate(-50%, -50%) scaleX(-1) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            }
            50% {
              transform: translate(-50%, -50%) scaleX(-1) rotateX(720deg) rotateY(720deg) rotateZ(720deg);
            }
            100% {
              transform: translate(-50%, -50%) scaleX(-1) rotateX(1440deg) rotateY(1440deg) rotateZ(1440deg);
            }
          }
          .number.spin {
            animation: spin3D 5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Clock;

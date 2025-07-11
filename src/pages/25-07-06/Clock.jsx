import React, { useEffect } from 'react';
import polFont from './pol.otf';
import polarisGif from './polaris.gif';

const Clock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      const secDeg = seconds * 6;
      const minDeg = minutes * 6 + seconds * 0.1;
      const hourDeg = (hours % 12) * 30 + minutes * 0.5;

      const sec = document.querySelector('.second-hand');
      const min = document.querySelector('.minute-hand');
      const hr = document.querySelector('.hour-hand');

      if (sec && min && hr) {
        sec.style.transform = `rotate(${secDeg}deg)`;
        min.style.transform = `rotate(${minDeg}deg)`;
        hr.style.transform = `rotate(${hourDeg}deg)`;
      }
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  const fontFace = `
    @font-face {
      font-family: 'pol';
      src: url(${polFont}) format('opentype');
    }
  `;

  const numbers = [
    { num: '12', top: '10vh', left: '50vw' },
    { num: '1', top: '18vh', left: '76vw' },
    { num: '2', top: '34vh', left: '89vw' },
    { num: '3', top: '50vh', left: '94vw' },
    { num: '4', top: '66vh', left: '89vw' },
    { num: '5', top: '82vh', left: '76vw' },
    { num: '6', top: '90vh', left: '50vw' },
    { num: '7', top: '82vh', left: '24vw' },
    { num: '8', top: '66vh', left: '11vw' },
    { num: '9', top: '50vh', left: '6vw' },
    { num: '10', top: '34vh', left: '11vw' },
    { num: '11', top: '18vh', left: '24vw' }
  ];

  return (
    <div style={{
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'rgb(3, 3, 61)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <style>{fontFace}</style>

      <img
        src={polarisGif}
        alt="Background"
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          width: '50vw',
          height: '50vh',
          filter: 'brightness(140%) saturate(30%)',
          zIndex: 1,
          animation: 'slow-rotate 60s linear infinite',
          transform: 'translate(-50%, -50%) rotate(0deg)',
          transformOrigin: 'center center',
          pointerEvents: 'none',
        }}
      />

      <div
        className="clock"
        style={{
          position: 'relative',
          top: '0.3vh',
          left: '-0.3vw',
          width: '80vmin',
          height: '80vmin',
          borderRadius: '50%',
          zIndex: 2,
        }}
      >
        <div
          className="hand hour-hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '0.3rem',
            height: '30%',
            backgroundColor: '#6a6c70',
            borderRadius: '4.8rem',
            transformOrigin: 'bottom center',
            transform: 'rotate(0deg)',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        />
        <div
          className="hand minute-hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '0.2rem',
            height: '45%',
            backgroundColor: '#5d5f64',
            borderRadius: '4.3rem',
            transformOrigin: 'bottom center',
            transform: 'rotate(0deg)',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        />
        <div
          className="hand second-hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '0.1rem',
            height: '48%',
            backgroundColor: '#aaa',
            borderRadius: '4rem',
            transformOrigin: 'bottom center',
            transform: 'rotate(0deg)',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        />

        {numbers.map(({ num, top, left }, i) => (
          <div
            key={i}
            className="number"
            style={{
              position: 'absolute',
              fontFamily: 'pol',
              fontSize: '3.2rem',
              color: 'rgb(3, 3, 61)',
              textShadow: '#0f5c7a 0.3rem 0.3rem, #0f5c7a -0.3rem -0.3rem',
              width: '2.2rem',
              height: '2.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translate(-50%, -50%)',
              top,
              left,
            }}
          >
            {num}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slow-rotate {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default Clock;

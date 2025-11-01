import React, { useEffect } from 'react';
import scorpImage from './sand.webp';
import hourHandImage from './giphy1-ezgif.com-rotate(2).gif';
import minuteHandImage from './giphy1-ezgif.com-rotate(1).gif';
import secondHandImage from './giphy1-ezgif.com-rotate(3).gif';
import bangFont_2025_11_01 from './bang.ttf'; // font variable includes today's date

export default function Clock() {
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      @font-face {
        font-family: 'bang';
        src: url(${bangFont_2025_11_01}) format('truetype');
      }
    `;
    document.head.appendChild(styleTag);

    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      const jitter = () => Math.random() * 2 - 1;
      const secondDeg = seconds * 6 + jitter() * 0.3;
      const minuteDeg = minutes * 6 + seconds / 10 + jitter() * 0.02;
      const hourDeg = hours * 30 + minutes / 2 + jitter() * 0.005;

      const secondScale = 1 + Math.sin(seconds * Math.PI / 30) * 0.05;
      const minuteScale = 1 + Math.sin(minutes * Math.PI / 30) * 0.03;
      const hourScale = 1 + Math.sin(hours * Math.PI / 6) * 0.02;

      const secondHand = document.querySelector('.second-hand');
      const minuteHand = document.querySelector('.minute-hand');
      const hourHand = document.querySelector('.hour-hand');

      if (secondHand) {
        secondHand.style.transform = `translate(-50%, 0) rotate(${secondDeg}deg) scaleY(${secondScale})`;
      }
      if (minuteHand) {
        minuteHand.style.transform = `translate(-50%, 0) rotate(${minuteDeg}deg) scaleY(${minuteScale})`;
      }
      if (hourHand) {
        hourHand.style.transform = `translate(-50%, 0) rotate(${hourDeg}deg) scaleY(${hourScale})`;
      }
    };

    const interval = setInterval(updateClock, 50);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  const numbers = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    rotation: i * 30,
  }));

  return (
    <div
      style={{
        fontFamily: 'bang, sans-serif',
        margin: 0,
        padding: 0,
        background: 'rgb(9,9,9)',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Rotated background filling the window */}
      <img
        src={scorpImage}
        alt="Background"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vh',
          height: '100vw',
          objectFit: 'cover',
          opacity: 0.7,
          filter: 'saturate(0.6) contrast(1.8)',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%) rotate(90deg)',
        }}
      />

      {/* Clock */}
      <div
        style={{
          position: 'relative',
          width: '90vmin',
          height: '90vmin',
          zIndex: 2,
        }}
      >
        {numbers.map((num) => (
          <div
            key={num.value}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              textAlign: 'center',
              fontSize: '16.5vmin',
              color: '#c5c53e',
              textShadow: '#09f745 0.1rem 0.1rem, #080808 -0.1rem 0.1rem',
              transform: `rotate(${num.rotation}deg)`,
              fontFamily: 'bang, sans-serif',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '100%',
                top: '5%',
              }}
            >
              {num.value}
            </div>
          </div>
        ))}

        {/* Hour Hand */}
        <div
          className="hour-hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom',
            zIndex: 4,
          }}
        >
          <img
            src={hourHandImage}
            alt="Hour Hand"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Minute Hand */}
        <div
          className="minute-hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom',
            zIndex: 5,
          }}
        >
          <img
            src={minuteHandImage}
            alt="Minute Hand"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Second Hand */}
        <div
          className="second-hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom',
            zIndex: 6,
          }}
        >
          <img
            src={secondHandImage}
            alt="Second Hand"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}

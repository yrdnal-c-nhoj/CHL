import React, { useEffect, useState } from 'react';
import horizonFontUrl from './hori.otf';
import layer1 from './images/4c558c5dbff1828f2b87582dc49526e8.gif';
import layer2 from './images/sdfwef.gif';
import layer3 from './images/ewfsdfsd.gif';

const HorizonClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');

      hours = hours % 12;
      if (hours === 0) hours = 12;

      const timeString = `${hours}${minutes}`;
      setTime(timeString);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100dvh', margin: 0, display: 'flex' }}>
      <style>
        {`
          @font-face {
            font-family: 'HorizonFont';
            src: url(${horizonFontUrl}) format '

(opentype)';
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      {/* Left half - Sky */}
      <div
        style={{
          width: '50vw',
          height: '100dvh',
          background: 'linear-gradient(to bottom, #87CEEB, #E0F7FA)', // Sky-like gradient
          position: 'fixed',
          left: 0,
          zIndex: 0,
        }}
      />

      {/* Right half - Non-sky (e.g., ground) */}
      <div
        style={{
          width: '50vw',
          height: '100dvh',
          background: 'linear-gradient(to bottom, #4A3721, #8B5A2B)', // Ground-like gradient
          position: 'fixed',
          right: 0,
          zIndex: 0,
        }}
      />

      {/* Background layers */}
      <div
        style={{
          width: '100vw',
          height: '100dvh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          overflow: 'hidden',
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 2,
        }}
      >
        <img
          src={layer1}
          alt="Layer 1"
          style={{ opacity: 0.5, width: '100%', height: '60vh', objectFit: 'cover' }}
        />
      </div>

      <div
        style={{
          width: '100vw',
          height: '100dvh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          overflow: 'hidden',
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <img
          src={layer2}
          alt="Layer 2"
          style={{ width: '100%', height: '70vh', objectFit: 'cover' }}
        />
      </div>

      <div
        style={{
          position: 'fixed',
          width: '100vw',
          height: '50vh',
          overflow: 'hidden',
          zIndex: 5,
        }}
      >
        <img
          src={layer3}
          alt="Layer 3"
          style={{ width: '100%', height: '150%' }}
        />
      </div>

      {/* Clock display */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          fontSize: '7rem',
          fontFamily: 'HorizonFont, sans-serif',
          background: 'linear-gradient(to bottom, rgb(136, 145, 95) 50%, rgb(78, 136, 183) 50%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          zIndex: 10,
          userSelect: 'none',
        }}
      >
        {time.padStart(4, ' ').split('').map((char, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              minWidth: '2.5rem',
              textAlign: 'center',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HorizonClock;
import React, { useEffect, useRef } from 'react';
import mobyFont from './moby.ttf';
import waves from './waves.gif';

const MobyDickClock = () => {
  const clockRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'Moby';
        src: url(${mobyFont}) format('truetype');
      }
    `;
    document.head.appendChild(style);

    const updateClock = () => {
      const clock = clockRef.current;
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false, // 24-hour format
        hour: 'numeric', // No leading zeros
        minute: 'numeric', // No leading zeros
      });
      clock.textContent = timeString;

      const randomX = Math.random() * (window.innerWidth - 100);
      const randomY = Math.random() * (window.innerHeight - 50);
      const randomSize = Math.random() * 8 + 2; // rem
      const randomOpacity = Math.random();

      clock.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomSize / 5})`;
      clock.style.opacity = randomOpacity;
      clock.style.fontSize = `${randomSize}rem`;
    };

    const interval = setInterval(updateClock, 2000);
    updateClock();

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#727B7BFF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        filter: 'brightness(300%) contrast(40%)',
        position: 'relative',
      }}
    >
      <div
        ref={clockRef}
        style={{
          fontFamily: 'Moby, cursive',
          color: '#a1b4b4',
          textShadow: '#ced4d4 0.1rem 0.1rem 0.2rem, #000404 -0.1rem -0.1rem 0.9rem',
          position: 'absolute',
          opacity: 0,
          transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
        }}
      />
      <img
        src={waves}
        alt="waves"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 6,
          opacity: 0.6,
          filter: 'brightness(180%) contrast(110%)',
          pointerEvents: 'none',
        }}
      />
   
    </div>
  );
};

export default MobyDickClock;
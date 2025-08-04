import React, { useEffect, useRef } from 'react';
import mobyFont from './moby.ttf';
import waves from './waves.gif';

const MobyDickClock = () => {
  const clockRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById('moby-font')) {
      const style = document.createElement('style');
      style.id = 'moby-font';
      style.innerHTML = `
        @font-face {
          font-family: 'Moby';
          src: url(${mobyFont}) format('truetype');
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-0.5rem); }
        }
      `;
      document.head.appendChild(style);
    }

    const getRandomOutsideCenter = (screenSize, padding, centerSize) => {
      const outerMin = padding;
      const outerMax = screenSize - padding;
      const centerMin = (screenSize - centerSize) / 2;
      const centerMax = (screenSize + centerSize) / 2;

      let value;
      do {
        value = outerMin + Math.random() * (outerMax - outerMin);
      } while (value > centerMin && value < centerMax);
      return value;
    };

    const animateClock = () => {
      const clock = clockRef.current;
      if (!clock) return;

      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      });
      clock.textContent = timeString;

      const randomX = getRandomOutsideCenter(window.innerWidth, 60, 300);
      const randomY = getRandomOutsideCenter(window.innerHeight, 40, 200);
      const randomSize = Math.random() * 8 + 2; // rem
      const randomOpacity = Math.random();
      const willHide = Math.random() < 0.3;

      clock.style.fontSize = `${randomSize}rem`;
      clock.style.transform = `translate(${randomX}px, ${randomY}px)`;
      clock.style.opacity = willHide ? 0 : Math.max(randomOpacity, 0.5);

      const nextDelay = Math.random() * 2000 + 1000;
      setTimeout(animateClock, nextDelay);
    };

    animateClock();
    return () => clearTimeout();
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
          transition: 'opacity 1s ease-in-out, transform 0.5s ease-in-out, font-size 0.5s ease-in-out',
          animation: 'float 4s ease-in-out infinite',
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

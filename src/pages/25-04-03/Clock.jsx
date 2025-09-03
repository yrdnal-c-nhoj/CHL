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

    const centerAvoidSize = { width: 300, height: 200 }; // px area to avoid center

    // Returns a random coordinate avoiding center rectangle
    const getRandomPosAvoidCenter = (max, avoidStart, avoidEnd) => {
      let pos;
      do {
        pos = Math.random() * max;
      } while (pos > avoidStart && pos < avoidEnd);
      return pos;
    };

    const moveClock = () => {
      const clock = clockRef.current;
      if (!clock) return;

      // Update time
      const now = new Date();
      clock.textContent = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      });

      // Calculate random X and Y avoiding center area
      const x = getRandomPosAvoidCenter(
        window.innerWidth,
        (window.innerWidth - centerAvoidSize.width) / 2,
        (window.innerWidth + centerAvoidSize.width) / 2
      );
      const y = getRandomPosAvoidCenter(
        window.innerHeight,
        (window.innerHeight - centerAvoidSize.height) / 2,
        (window.innerHeight + centerAvoidSize.height) / 2
      );

      // Random font size and opacity
      const fontSize = 2 + Math.random() * 6; // rem
      const opacity = Math.random() * 0.7 + 0.3;

      // Apply styles with smooth transition
      clock.style.transition = 'transform 2s ease-in-out, font-size 2s ease-in-out, opacity 2s ease-in-out';
      clock.style.transform = `translate(${x}px, ${y}px)`;
      clock.style.fontSize = `${fontSize}rem`;
      clock.style.opacity = opacity;

      // Next move after 2-4 seconds randomly
      const nextTime = 2000 + Math.random() * 2000;
      setTimeout(moveClock, nextTime);
    };

    // Initial position: place clock off-screen so first move slides it in
    const clock = clockRef.current;
    if (clock) {
      clock.style.position = 'absolute';
      clock.style.top = '0';
      clock.style.left = '0';
      clock.style.opacity = '0';
      clock.style.transform = 'translate(-500px, -500px)';
    }

    // Start animation loop
    moveClock();

    return () => clearTimeout();
  }, []);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#727B7BFF',
        filter: 'brightness(300%) contrast(40%)',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <div
        ref={clockRef}
        style={{
          fontFamily: 'Moby, cursive',
          color: '#a1b4b4',
          textShadow: '#ced4d4 0.1rem 0.1rem 0.2rem, #000404 -0.1rem -0.1rem 0.9rem',
          position: 'absolute',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: 0,
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

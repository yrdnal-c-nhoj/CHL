import React, { useEffect, useRef } from 'react';
import fontUrl from './bang.ttf';
import gif1 from './fw.gif';
import gif2 from './giphy (11).gif';
import gif3 from './84298.gif';

const FireworksClock = () => {
  const clockRef = useRef(null);

  useEffect(() => {
    const font = new FontFace('bang', `url(${fontUrl})`);
    font.load().then(() => {
      document.fonts.add(font);
    });
  }, []);

  useEffect(() => {
    const showClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5);
      const clock = clockRef.current;
      if (!clock) return;

      clock.innerHTML = '';
      clock.style.animation = 'none';
      void clock.offsetWidth;
      clock.style.animation = 'riseUp 1.5s ease-out forwards';

      for (const char of timeString) {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.color = getRandomBrightColor();
        span.style.fontSize = getRandomFontSize();
        span.style.fontWeight = 'bold';
        span.style.position = 'relative';
        span.style.display = 'inline-block';
        span.style.willChange = 'transform, opacity';
        span.style.textShadow = '0 0 0.5rem white';

        const { dx, dy, rot } = getRandomExplosionVector();
        span.style.setProperty('--dx', dx);
        span.style.setProperty('--dy', dy);
        span.style.setProperty('--rot', rot);
        clock.appendChild(span);
      }

      setTimeout(() => {
        for (const digit of clock.children) {
          digit.style.animation = 'explodeWild 1.5s ease-out forwards';
        }
      }, 1500);
    };

    showClock();
    const interval = setInterval(showClock, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRandomBrightColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 50%)`;
  };

  const getRandomFontSize = () => {
    return `${Math.floor(Math.random() * 2) + 4}rem`;
  };

  const getRandomExplosionVector = () => {
    const dx = `${(Math.random() - 0.5) * 80}vw`;
    const dy = `${(Math.random() - 0.5) * 80}vh`;
    const rot = `${Math.random() * 1440 - 720}deg`;
    return { dx, dy, rot };
  };

  const containerStyle = {
    fontFamily: 'bang, sans-serif',
    margin: 0,
    padding: 0,
    background: 'rgb(9, 9, 9)',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'relative',
  };

  const bgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.7,
    filter: 'saturate(1.3)',
    animation: 'pulse 3s infinite alternate ease-in-out',
    zIndex: 0,
  };

  const clockStyle = {
    display: 'flex',
    position: 'relative',
    zIndex: 50,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
  };

  return (
    <div style={containerStyle}>
      <img src={gif1} alt="bg1" style={bgStyle} />
      <img src={gif2} alt="bg2" style={bgStyle} />
      <img src={gif3} alt="bg3" style={bgStyle} />
      <div ref={clockRef} id="clock" style={clockStyle} />
      <style>{`
        @keyframes pulse {
          from {
            transform: scale(1);
            opacity: 0.6;
          }
          to {
            transform: scale(1.03);
            opacity: 0.75;
          }
        }

        @keyframes riseUp {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(-70vh);
          }
        }

        @keyframes explodeWild {
          0% {
            opacity: 1;
            transform: scale(1) translate(0, 0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: scale(5) translate(var(--dx), var(--dy)) rotate(var(--rot));
          }
        }
      `}</style>
    </div>
  );
};

export default FireworksClock;

import React, { useEffect, useRef } from 'react';
import boneFont from './bone.ttf';
import bone from './bone.png';
import bone1 from './bone1.png';
import bone2 from './bone2.png';
import bgImage from './bon.png';

const BoneClock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const numberContainerRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      const secondDeg = seconds * 6;
      const minuteDeg = minutes * 6 + seconds * 0.1;
      const hourDeg = (hours % 12) * 30 + minutes * 0.5;

      if (secondRef.current)
        secondRef.current.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
      if (minuteRef.current)
        minuteRef.current.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      if (hourRef.current)
        hourRef.current.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    };

    const placeClockNumbers = () => {
      const container = numberContainerRef.current;
      if (!container) return;

      const radius = 45; // percent of size
      for (let i = 1; i <= 12; i++) {
        const angle = (i - 3) * 30 * (Math.PI / 180);
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);

        const span = document.createElement('span');
        span.textContent = i;
        span.style.position = 'absolute';
        span.style.left = `${x}%`;
        span.style.top = `${y}%`;
        span.style.transform = 'translate(-50%, -50%)';
        span.style.fontSize = '3.5rem';
        span.style.fontFamily = 'bone, sans-serif';
        span.style.color = 'rgb(223, 213, 187)';
        span.style.textShadow = '#1b1b1a 1px 1px 0px, #141412 -1px -1px 0px';
        container.appendChild(span);
      }
    };

    placeClockNumbers();
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, background: '#757272', height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <style>{`
        @font-face {
          font-family: 'bone';
          src: url(${boneFont}) format('truetype');
        }

        .bgImage {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 200vw;
          height: 100dvh;
          z-index: 0;
          filter: brightness(120%);
          pointer-events: none;
        }
      `}</style>

      <img src={bgImage} className="bgImage" alt="background" />

      <div style={{
        position: 'relative',
        width: '15rem',
        height: '15rem',
        borderRadius: '50%',
        zIndex: 5,
      }}>
        <img src={bone2} ref={hourRef} className="hand-img" alt="hour hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%) rotate(0deg)',
            height: '4rem',
            zIndex: 3,
            pointerEvents: 'none',
          }} />

        <img src={bone1} ref={minuteRef} className="hand-img" alt="minute hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%) rotate(0deg)',
            height: '7rem',
            zIndex: 2,
            pointerEvents: 'none',
          }} />

        <img src={bone} ref={secondRef} className="hand-img" alt="second hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%) rotate(0deg)',
            height: '8rem',
            filter: 'brightness(0.8) contrast(1.3)',
            zIndex: 1,
            pointerEvents: 'none',
          }} />

        <div ref={numberContainerRef} style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }} />
      </div>
    </div>
  );
};

export default BoneClock;

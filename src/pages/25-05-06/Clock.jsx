import React, { useEffect, useRef } from 'react';
import './zzzz.ttf';
import './ccccc.ttf';
import './eee.ttf';
import './bbbbb.ttf';

const UnrulyClock = () => {
  const digitRefs = useRef([]);

  const fonts = [
    'zzzz',
    'ccccc',
    'eee',
    'bbbbb',
    'Impact',
    'Lucida Console',
    'Comic Sans MS',
  ];

  const animations = ['rotate', 'scale', 'fade', 'bounce', 'skew'];

  const getRandomFont = () => fonts[Math.floor(Math.random() * fonts.length)];

  const getRandomSize = () => `${Math.floor(Math.random() * 9) + 1}rem`;

  const getRandomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;

  const getRandomAnimation = () =>
    animations[Math.floor(Math.random() * animations.length)];

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const digits = [...h, ...m, ...s];

      digits.forEach((val, i) => {
        const el = digitRefs.current[i];
        if (!el) return;

        el.textContent = val;
        animations.forEach((anim) => el.classList.remove(anim));

        el.style.fontFamily = getRandomFont();
        el.style.fontSize = getRandomSize();
        el.style.color = getRandomColor();

        const anim = getRandomAnimation();
        void el.offsetWidth; // Force reflow
        el.classList.add(anim);
      });
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();

    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    background: '#3e3b3d',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100dvh',
    margin: 0,
    fontSize: '1rem',
  };

  const clockStyle = {
    display: 'flex',
    flexDirection: window.innerWidth >= 768 ? 'row' : 'column',
    gap: window.innerWidth >= 768 ? '4vw' : '0',
    width: '100vw',
    maxWidth: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const groupStyle = {
    display: 'flex',
    flexDirection: 'row',
  };

  const digitStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.5s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={clockStyle}>
        {['hour', 'minute', 'second'].map((group, gIdx) => (
          <div key={group} style={groupStyle}>
            {[0, 1].map((i) => {
              const idx = gIdx * 2 + i;
              return (
                <div
                  key={`${group}-${i}`}
                  ref={(el) => (digitRefs.current[idx] = el)}
                  style={digitStyle}
                  className="digit"
                >
                  0
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnrulyClock;

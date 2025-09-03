import React, { useEffect, useRef } from 'react';
import backFont from './back.ttf';

const BackslantClock = () => {
  const ids = ['h0', 'h1', 'm0', 'm1', 's0', 's1'];
  const trains = useRef({});
  const positions = useRef({});
  const lastDigits = useRef({});
  const targetOffsets = useRef({});
  const currentOffsets = useRef({});

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'back';
        src: url(${backFont}) format('truetype');
      }
      .digitTrain span {
        color: rgb(4, 95, 151);
        text-shadow: #f24e07 0.2rem 0.2rem 0;
      }
      .digitTrain span.active {
        color: #FF5500FF; /* Bright red for active digit */
        text-shadow: #080707FF 0.2rem 0.2rem 0;
      }
      .digitTrain span.leaving {
        transition: opacity 0.4s linear;
        opacity: 0;
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const createDigitLine = () => {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 50; i++) {
        const span = document.createElement('span');
        span.textContent = i % 10;
        frag.appendChild(span);
      }
      return frag;
    };

    ids.forEach(id => {
      const trainEl = document.getElementById(id + 'train');
      trainEl.appendChild(createDigitLine());
      trains.current[id] = trainEl;
      positions.current[id] = 0;
      lastDigits.current[id] = null;
      targetOffsets.current[id] = 0;
      currentOffsets.current[id] = 0;
    });

    const lerp = (a, b, t) => a + (b - a) * t;

    const getNextPosition = (id, digit) => {
      const train = trains.current[id];
      const currentPos = positions.current[id];
      const children = Array.from(train.children);
      for (let i = currentPos + 1; i < children.length; i++) {
        if (children[i].textContent === digit) return i;
      }
      for (let i = 0; i <= currentPos; i++) {
        if (children[i].textContent === digit) return i;
      }
      return currentPos;
    };

    const updateClock = () => {
      const now = new Date();
      const digits = [
        ...now.getHours().toString().padStart(2, '0'),
        ...now.getMinutes().toString().padStart(2, '0'),
        ...now.getSeconds().toString().padStart(2, '0'),
      ];

      digits.forEach((digit, i) => {
        const id = ids[i];
        const train = trains.current[id];

        if (digit !== lastDigits.current[id]) {
          Array.from(train.children).forEach(span => {
            if (!span.classList.contains('leaving')) span.classList.remove('active');
          });

          const oldSpan = train.querySelector('span.active');
          if (oldSpan) {
            oldSpan.classList.add('leaving');
            oldSpan.addEventListener(
              'animationend',
              () => oldSpan.classList.remove('leaving', 'active'),
              { once: true }
            );
          }

          positions.current[id] = getNextPosition(id, digit);
          const spanWidth = train.children[0].offsetWidth || 0;
          targetOffsets.current[id] = positions.current[id] * spanWidth;
          lastDigits.current[id] = digit;

          const newSpan = train.children[positions.current[id]];
          if (newSpan) newSpan.classList.add('active');
        }
      });

      ids.forEach(id => {
        const train = trains.current[id];
        currentOffsets.current[id] = lerp(currentOffsets.current[id], targetOffsets.current[id], 0.1);
        train.style.transform = `translateX(-${currentOffsets.current[id]}px)`;
      });

      requestAnimationFrame(updateClock);
    };

    updateClock();
  }, []);

  const formatDate = (offsetDays = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const y = String(date.getFullYear()).slice(-2);
    return `${m}/${d}/${y}`;
  };

  return (
    <div style={styles.body}>
      <div style={styles.wrapper}>
        <div style={styles.clock} role="timer" aria-label="Digital clock">
          {ids.map(id => (
            <div key={id} style={styles.clockRow}>
              <div id={`${id}train`} className="digitTrain" style={styles.digitTrain}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    padding: 0,
    height: '100dvh',
    width: '100vw',
    backgroundImage: 'linear-gradient(24deg, #211408 6.25%, #f3a64e 6.25%, #ea8007 25%, #fff 25%, #f9c2c2 31.25%, #e3630d 31.25%, #e3630d 50%, #211408 50%, #0b30ea 56.25%, #ed8917 56.25%, #ed8917 75%, #f60808 75%, #fff 81.25%, #e3630d 81.25%, #e3630d 100%)',
    backgroundSize: '6vw 2vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  wrapper: {
    transform: 'translateX(25vw)',
    animation: 'rotateClock 17s ease-in-out infinite',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clock: {
    fontFamily: 'back, monospace',
    display: 'flex',
    flexDirection: 'column',
  },
  clockRow: {
    display: 'flex',
    alignItems: 'center',
    height: '3rem',
    width: '100vw',
    padding: '0 1rem',
    boxSizing: 'border-box',
    position: 'relative',
  },
  digitTrain: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '3.5rem',
    whiteSpace: 'nowrap',
    transition: 'transform 0.4s linear',
  }
};

export default BackslantClock;
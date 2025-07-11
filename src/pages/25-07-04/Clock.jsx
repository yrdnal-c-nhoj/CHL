import React, { useEffect, useRef } from 'react';
import kalFont from './kal.ttf';
import bgImage from './7ZAx.webp';

const KaleidoscopeClock = () => {
  const SEGMENTS = 12;
  const colors = ['#ff0040', '#00ffff', '#ffff00', '#00ff00', '#ff8000', '#ff00ff', '#00bfff', '#ffffff', '#ffcc00', '#ff66cc', '#33ff33', '#3399ff'];

  const ringRefs = useRef([
    { hour: null, minute: null, second: null, hours: [], minutes: [], seconds: [], colorOffset: 0 },
    { hour: null, minute: null, second: null, hours: [], minutes: [], seconds: [], colorOffset: 6 }
  ]);

  useEffect(() => {
    for (let set of ringRefs.current) {
      for (let i = 0; i < SEGMENTS; i++) {
        const angle = i * (360 / SEGMENTS);

        const hour = document.createElement('div');
        hour.className = 'segment hour';
        hour.style.transform = `rotate(${angle}deg) translate(30vmin)`;
        set.hour.appendChild(hour);
        set.hours.push(hour);

        const minute = document.createElement('div');
        minute.className = 'segment minute';
        minute.style.transform = `rotate(${angle}deg) translate(20vmin)`;
        set.minute.appendChild(minute);
        set.minutes.push(minute);

        const second = document.createElement('div');
        second.className = 'segment second';
        second.style.transform = `rotate(${angle}deg) translate(10vmin)`;
        set.second.appendChild(second);
        set.seconds.push(second);
      }
    }

    const updateClock = () => {
      const now = new Date();
      const h = now.getHours() % 12 || 12;
      const m = now.getMinutes();
      const s = now.getSeconds();

      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      const ss = s.toString().padStart(2, '0');

      ringRefs.current.forEach((set, index) => {
        for (let i = 0; i < SEGMENTS; i++) {
          const colorIndex = (i + s + set.colorOffset) % colors.length;
          set.hours[i].textContent = hh;
          set.hours[i].style.color = colors[(colorIndex + 2) % colors.length];

          set.minutes[i].textContent = mm;
          set.minutes[i].style.color = colors[(colorIndex + 4) % colors.length];

          set.seconds[i].textContent = ss;
          set.seconds[i].style.color = colors[(colorIndex + 6) % colors.length];
        }
      });

      requestAnimationFrame(updateClock);
    };

    updateClock();
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, background: 'black', overflow: 'hidden', height: '100vh', fontFamily: 'kal' }}>
      <style>{`
        @font-face {
          font-family: 'kal';
          src: url(${kalFont}) format('truetype');
        }

        .kaleidoscope {
          z-index: 1;
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0.7;
        }

        .spin-cw {
          animation: spin-cw 60s linear infinite;
        }

        .spin-ccw {
          animation: spin-ccw 60s linear infinite;
        }

        .ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-style: preserve-3d;
        }

        .segment {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          pointer-events: none;
          mix-blend-mode: screen;
          transition: color 1s;
          font-size: 9vmin;
        }

        .hour {
          transform-origin: 0 0;
        }

        .minute {
          transform-origin: 0 0;
          font-size: 7vmin;
        }

        .second {
          transform-origin: 0 0;
          font-size: 5.5vmin;
        }

        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        .bgimage {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-image: url(${bgImage});
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          filter: brightness(50%);
          z-index: 1;
          pointer-events: none;
        }
      `}</style>

      <div className="bgimage"></div>

      <div className="kaleidoscope spin-cw">
        <div className="ring" ref={el => ringRefs.current[0].hour = el}></div>
        <div className="ring" ref={el => ringRefs.current[0].minute = el}></div>
        <div className="ring" ref={el => ringRefs.current[0].second = el}></div>
      </div>

      <div className="kaleidoscope spin-ccw">
        <div className="ring" ref={el => ringRefs.current[1].hour = el}></div>
        <div className="ring" ref={el => ringRefs.current[1].minute = el}></div>
        <div className="ring" ref={el => ringRefs.current[1].second = el}></div>
      </div>
    </div>
  );
};

export default KaleidoscopeClock;

import React, { useEffect } from 'react';
import kalFont from './kal.otf';
import bgImage from './7ZAx.webp';

const Clock = () => {
  useEffect(() => {
    const SEGMENTS = 12;
    const colors = [
      '#ff0040', '#045DF7FF', '#F9D108FF', '#00ff00',
      '#FC7B02FF', '#ff00ff', '#00bfff', '#ffffff',
      '#D0FF00FF', '#C12FFBFF', '#FAA404FF', '#12F5DBFF'
    ];

    const createRingSet = (prefix, offset) => {
      const set = {
        hour: document.getElementById(`${prefix}Hour`),
        minute: document.getElementById(`${prefix}Minute`),
        second: document.getElementById(`${prefix}Second`),
        ampm: document.getElementById(`${prefix}Ampm`),
        hours: [],
        minutes: [],
        seconds: [],
        ampms: [],
        colorOffset: offset,
      };

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

        const ampm = document.createElement('div');
        ampm.className = 'segment ampm';
        ampm.style.transform = `rotate(${angle}deg) translate(5vmin)`;
        set.ampm.appendChild(ampm);
        set.ampms.push(ampm);
      }

      return set;
    };

    const ringSets = [
      createRingSet('ring1', 0),
      createRingSet('ring2', 6),
    ];

    const updateClock = () => {
      const now = new Date();
      const h = now.getHours();
      const hour = h % 12 || 12;
      const minute = now.getMinutes();
      const second = now.getSeconds();
      const ampm = h >= 12 ? 'PM' : 'AM';

      const hourText = hour.toString().padStart(2, '0');
      const minuteText = minute.toString().padStart(2, '0');
      const secondText = second.toString().padStart(2, '0');

      for (const set of ringSets) {
        for (let i = 0; i < SEGMENTS; i++) {
          const colorIndex = (i + second + set.colorOffset) % colors.length;

          set.hours[i].textContent = hourText;
          set.hours[i].style.color = colors[(colorIndex + 2) % colors.length];

          set.minutes[i].textContent = minuteText;
          set.minutes[i].style.color = colors[(colorIndex + 4) % colors.length];

          set.seconds[i].textContent = secondText;
          set.seconds[i].style.color = colors[(colorIndex + 6) % colors.length];

          set.ampms[i].textContent = ampm;
          set.ampms[i].style.color = colors[(colorIndex + 8) % colors.length];
        }
      }

      requestAnimationFrame(updateClock);
    };

    updateClock();
  }, []);

  useEffect(() => {
    const font = new FontFace('kal', `url(${kalFont})`);
    font.load().then(f => document.fonts.add(f));
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, background: 'black', height: '100vh', overflow: 'hidden' }}>
      <img
        src={bgImage}
        alt="background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(210%) saturate(400%) hue-rotate(-190deg) blur(4px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div style={{
        position: 'absolute',
        top: '5px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '98%',
        display: 'flex',
        color: '#bebcbc',
        textShadow: '#141314 1px 0px',
        zIndex: 6,
      }}>
        <div style={{
          fontFamily: '"Roboto Slab", serif',
          fontSize: '2.8vh',
          position: 'absolute',
          top: '1px',
          right: '1px',
          letterSpacing: '0.1vh',
        }}>Cubist Heart Laboratories</div>
        <div style={{
          fontFamily: '"Oxanium", serif',
          fontSize: '2.8vh',
          fontStyle: 'italic',
          letterSpacing: '-0.1vh',
        }}>BorrowedTime</div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '5px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '98%',
        display: 'flex',
        color: '#bec2be',
        zIndex: 6,
      }}>
        <a href="../launchpad/" style={{ fontSize: '3vh', fontFamily: '"Nanum Gothic Coding", monospace' }}>07/03/25</a>
        <a href="../index.html" style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '4vh',
          lineHeight: '4vh',
          fontFamily: '"Oxanium", serif',
        }}>Kaleidoscope</a>
        <a href="../vegas/" style={{
          fontSize: '3vh',
          fontFamily: '"Nanum Gothic Coding", monospace',
          position: 'absolute',
          right: 0,
        }}>07/05/25</a>
      </div>

      {/* Clockwise */}
      <div className="kaleidoscope spin-cw" style={kaleidoscopeStyle}>
        <div id="ring1Hour" className="ring"></div>
        <div id="ring1Minute" className="ring"></div>
        <div id="ring1Second" className="ring"></div>
        <div id="ring1Ampm" className="ring"></div>
      </div>

      {/* Counter-Clockwise */}
      <div className="kaleidoscope spin-ccw" style={kaleidoscopeStyle}>
        <div id="ring2Hour" className="ring"></div>
        <div id="ring2Minute" className="ring"></div>
        <div id="ring2Second" className="ring"></div>
        <div id="ring2Ampm" className="ring"></div>
      </div>

      <style>{`
        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes spin-ccw {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }

        .kaleidoscope {
          font-family: 'kal';
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
        }

        .spin-cw {
          animation: spin-cw 45s linear infinite;
          opacity: 0.9;
        }

        .spin-ccw {
          animation: spin-ccw 90s linear infinite;
          opacity: 0.7;
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
          font-size: 4.5rem;
          transform-origin: 0 0;
        }

        .minute, .second {
          font-size: 2.4rem;
        }

        .ampm {
          font-size: 0.8rem;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        a:hover {
          color: #e8ecec;
          background-color: rgb(21, 0, 255);
        }
      `}</style>
    </div>
  );
};

const kaleidoscopeStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default Clock;

import React, { useEffect, useState } from 'react';
import penFontUrl from './Pen.ttf';

const PenmanshipClock = () => {
  const [timeString, setTimeString] = useState('--:--');
  const [ampm, setAmpm] = useState('--');
  const [gridSize, setGridSize] = useState({ columns: 1, rows: 1 });

  useEffect(() => {
    const font = new FontFace('Pen', `url(${penFontUrl})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
    });

    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampmVal = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      if (hours === 0) hours = 12;
      const paddedMinutes = String(minutes).padStart(2, '0');
      setTimeString(`${hours}:${paddedMinutes}`);
      setAmpm(ampmVal);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const resize = () => {
      const clockWidthVW = 18;
      const clockHeightVH = 8.2;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const columns = Math.ceil(100 / clockWidthVW);
      const rows = Math.ceil(100 / clockHeightVH);
      setGridSize({ columns, rows });
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const clocks = [];
  for (let i = 0; i < gridSize.columns * gridSize.rows; i++) {
    clocks.push(
      <div
        key={i}
        style={{
          fontFamily: 'Pen',
          fontSize: '7.6vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgb(116, 114, 120)',
        }}
      >
        &nbsp;&nbsp;&nbsp;{timeString}&nbsp;
        <span style={{ fontSize: '7.6vw', textTransform: 'lowercase' }}>{ampm}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        position: 'relative',
        backgroundColor: '#e8df92',
        fontFamily: 'sans-serif',
      }}
    >
      <style>{`
        @font-face {
          font-family: 'Pen';
          src: url(${penFontUrl}) format('truetype');
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

      {/* Top title bar */}
      <div
        style={{
          position: 'fixed',
          top: '0.5vh',
          width: '98vw',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          color: '#c20303',
          textShadow: '#f0f0ec 0.1vw 0px',
        }}
      >
        <div
          style={{
            fontFamily: 'Roboto Slab',
            fontSize: '2.8vh',
            letterSpacing: '0.1vh',
            position: 'absolute',
            right: '0.3vw',
          }}
        >
          Cubist Heart Laboratories
        </div>
        <div
          style={{
            fontFamily: 'Oxanium',
            fontSize: '2.8vh',
            fontStyle: 'italic',
            letterSpacing: '-0.1vh',
            position: 'relative',
            left: 0,
            zIndex: 15,
          }}
        >
          BorrowedTime
        </div>
      </div>

      {/* Bottom date bar */}
      <div
        style={{
          position: 'fixed',
          bottom: '0.5vh',
          width: '98vw',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: 10,
          color: '#c20303',
        }}
      >
        <a
          href="../sliding"
          style={{
            fontFamily: 'Nanum Gothic Coding',
            fontSize: '3vh',
          }}
        >
          07/10/25
        </a>
        <a
          href="../index.html"
          style={{
            fontFamily: 'Oxanium',
            fontSize: '4vh',
            lineHeight: '4vh',
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          Penmanship
        </a>
        <a
          href="../fibonacci/"
          style={{
            fontFamily: 'Nanum Gothic Coding',
            fontSize: '3vh',
          }}
        >
          07/12/25
        </a>
      </div>

      {/* Grid of clocks */}
      <div
        style={{
          display: 'grid',
          width: '100vw',
          height: '100vh',
          columnGap: '9vw',
          rowGap: '.1vh',
          gridTemplateColumns: `repeat(${gridSize.columns}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        {clocks}
      </div>
    </div>
  );
};

export default PenmanshipClock;

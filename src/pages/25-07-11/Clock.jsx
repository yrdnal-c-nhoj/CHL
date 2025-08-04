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

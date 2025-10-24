import React, { useEffect, useState, useMemo } from 'react';
import fontUrl from './gr.ttf';
import bgImage from './bg.gif'; // <-- import your image here

const Clockgrid = () => {
  const [time, setTime] = useState({
    hours: '',
    minutes: '',
    seconds: '',
    millis: '',
    ampm: '',
  });

  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const millis = Math.floor(now.getMilliseconds() / 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      setTime({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        millis: String(millis).padStart(2, '0'),
        ampm,
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 10);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const timeCharacters = useMemo(() => {
    const timeString =
      time.hours + time.minutes + time.seconds + time.millis + time.ampm;
    return timeString.toUpperCase().split('');
  }, [time]);

  const patternLength = timeCharacters.length;

  const CELL_VH = 10;
  const ROWS = Math.ceil(viewport.height / (CELL_VH / 100 * viewport.height)) + 2;
  const COLUMNS = Math.ceil(viewport.width / (CELL_VH / 100 * viewport.height)) + 2;
  const totalCells = ROWS * COLUMNS;
  const repeatCount = Math.ceil(totalCells / patternLength);
  const totalCharactersToRender = repeatCount * patternLength;

  const fontFace = `
    @font-face {
      font-family: 'mult';
      src: url(${fontUrl}) format('truetype');
    }
  `;

  const styles = {
  htmlBody: {
  margin: 0,
  padding: 0,
  height: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  backgroundImage: `url(${bgImage})`,
  backgroundRepeat: 'repeat',                     // tile the image
  backgroundSize: `${CELL_VH * 3}vh ${CELL_VH}vh`, // width = 3 digits, height = 1 digit
  backgroundPosition: 'center center',           // start tiling from the middle
  fontFamily: 'mult, monospace',
  position: 'relative',
},



    clockGrid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${COLUMNS}, ${CELL_VH}vh)`,
      gridTemplateRows: `repeat(${ROWS}, ${CELL_VH}vh)`,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      gap: '0',
    },

    characterCell: {
      color: 'rgb(237, 333, 93)',
      fontSize: `${CELL_VH * 1.35}vh`,
      display: 'flex',
      opacity: 0.55,
      justifyContent: 'center',
      alignItems: 'center',
      textTransform: 'uppercase',
      lineHeight: 1,
    },
  };

  const allCharacters = Array.from(
    { length: totalCharactersToRender },
    (_, i) => {
      const char = timeCharacters[i % patternLength];
      return (
        <div key={i} style={styles.characterCell}>
          {char}
        </div>
      );
    }
  );

  return (
    <div style={styles.htmlBody}>
      <style>{fontFace}</style>
      <div style={styles.clockGrid}>{allCharacters}</div>
    </div>
  );
};

export default Clockgrid;

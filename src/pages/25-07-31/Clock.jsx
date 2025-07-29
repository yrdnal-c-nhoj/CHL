import React, { useEffect, useState } from 'react';
import bg from './bay.jpeg';
import fontUrl from './bay.ttf';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const formatTime = (n) => n.toString().padStart(2, '0');

  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());

  const clockDigits = [...hours, ':', ...minutes];

  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    },
    clock: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      display: 'flex',
    },
    digitBox: {
      fontFamily: 'digital, monospace',
      fontSize: '2rem',
      color: '#70706FFF',
      textAlign: 'center',
    },
    colonBox: {
      fontSize: '4.5rem',

  lineHeight: '1rem', // or another value like '1', 'normal', etc.

      background: 'transparent',
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @font-face {
            font-family: 'digital';
            src: url(${fontUrl}) format('truetype');
          }
        `}
      </style>
      <div style={styles.clock}>
        {clockDigits.map((char, i) => (
          <div
            key={i}
            style={
              char === ':'
                ? { ...styles.digitBox, ...styles.colonBox }
                : styles.digitBox
            }
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;

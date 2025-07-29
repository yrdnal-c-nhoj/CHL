import React, { useEffect, useState } from 'react';
import bg from './bg.jpg';
import fontUrl from './digital.ttf';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const formatTime = (n) => n.toString().padStart(2, '0');

  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  const clockDigits = [...hours, ':', ...minutes, ':', ...seconds];

  const styles = {
    '@font-face': [
      {
        fontFamily: 'digital',
        src: `url(${fontUrl}) format("truetype")`,
      },
    ],
    container: {
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    clock: {
      display: 'flex',
      gap: '0.5rem',
    },
    digitBox: {
      fontFamily: 'digital, monospace',
      fontSize: '8rem',
      color: '#fff',
      background: 'rgba(0,0,0,0.6)',
      borderRadius: '0.5rem',
      padding: '0.5rem 1rem',
      lineHeight: '1',
      minWidth: '5rem',
      textAlign: 'center',
    },
    colonBox: {
      minWidth: '2rem',
      fontSize: '8rem',
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

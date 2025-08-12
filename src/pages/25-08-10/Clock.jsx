import React, { useState, useEffect } from 'react';
import orbitronFont from './laika.ttf'; // Yourquo vadis
import featuredImage from './Laika.jpeg'; // Your local image file

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    const ms = Math.floor(date.getMilliseconds() / 10)
      .toString()
      .padStart(2, '0');
    return `${h}${m}${s}${ms}`;
  };

  const splitTimeGroups = (date) => {
    const t = formatTime(date); // HHMMSSMS
    return [t.slice(0, 2), t.slice(2, 4), t.slice(4, 6), t.slice(6, 8)];
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#111010FF',
      fontFamily: `'Orbitron', monospace`,
      color: '#ff0000',
    },
    imageContainer: {
      width: '60%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100vh',
      objectFit: 'cover',
    },
    clockContainer: {
      width: '40%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    timeVertical: {
      fontWeight: 900,
      fontSize: '4rem',
      letterSpacing: '0.25rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      userSelect: 'none',
      color: '#ff0000',
    },
    timeGroup: {
      fontSize: '4rem',
      fontWeight: 900,
      letterSpacing: '0.25rem',
      marginBottom: '1rem',
      textAlign: 'center',
      color: '#ff0000',
    },
  };

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Orbitron';
          src: url(${orbitronFont}) format('truetype');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.imageContainer}>
          <img
            src={featuredImage}
            alt="Featured content"
            style={styles.image}
          />
        </div>
        <div style={styles.clockContainer}>
          <div style={styles.timeVertical}>
            {splitTimeGroups(time).map((group, i) => (
              <div key={i} style={styles.timeGroup}>
                {group}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DigitalClock;
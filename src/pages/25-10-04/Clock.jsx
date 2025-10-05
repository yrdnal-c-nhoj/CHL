import React, { useEffect, useState } from 'react';
import issFont from './iss.ttf';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (value) => String(value).padStart(2, '0').split('');
  const [h1, h2] = formatTime(time.getHours());
  const [m1, m2] = formatTime(time.getMinutes());
  // Optional: remove seconds if you want only HH:MM
  // const [s1, s2] = formatTime(time.getSeconds());

  // Styles
  const styles = {
    fontFace: `
      @font-face {
        font-family: 'iss';
        src: url(${issFont}) format('truetype');
      }
    `,
    iframe: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100vw',
      height: '100vh',
      border: 'none',
      zIndex: 0,
      pointerEvents: 'none',
    },
    wrapper: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10,
    },
    clockContainer: {
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: '1vw',
      fontFamily: 'iss, sans-serif',
    },
    digitBox: {
      color: '#ffffff', // ensures visibility over video
      textShadow: `
        2px 2px 6px rgba(0,0,0,0.8),
        -2px -2px 6px rgba(0,0,0,0.5)
      `,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '18vw',
      width: '14vw',
      height: '20vw',
      textAlign: 'center',
      boxSizing: 'border-box',
    },
  };

  return (
    <div style={{ margin: 0, padding: 0, overflow: 'hidden', width: '100vw', height: '100vh' }}>
      <style>{styles.fontFace}</style>

      {/* Niagara Falls EarthCam Embed */}
      <iframe
        src="https://www.earthcam.com/cams/niagara/niagarafalls2/embed/"
        title="Niagara Falls Live Cam"
        frameBorder="0"
        style={styles.iframe}
      ></iframe>

      {/* Clock overlay */}
      <div style={styles.wrapper}>
        <div style={styles.clockContainer}>
          {[h1, h2, m1, m2].map((digit, i) => (
            <div key={i} style={styles.digitBox}>{digit}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clock;

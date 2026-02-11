import React, { useEffect, useState, useMemo } from 'react';
import issFont from '../../../assets/fonts/25-05-30-iss.ttf';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const digits = useMemo(() => {
    const pad = (n) => String(n).padStart(2, '0');
    return (pad(time.getHours()) + pad(time.getMinutes()) + pad(time.getSeconds())).split('');
  }, [time]);

  const styles = {
    fontFace: `
      @font-face {
        font-family: 'iss';
        src: url(${issFont}) format('truetype');
      }
    `,
    // Main background container
    container: {
      position: 'relative',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black', // Black background for letterboxing
      overflow: 'hidden',
    },
    // The "Whole Window" Video
    iframe: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
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
      width: '100%',
      pointerEvents: 'none', // Allows clicking "through" the clock if needed
    },
    clockContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1.5vw',
      fontFamily: 'iss, sans-serif',
    },
    digitBox: {
      color: 'transparent',
      textShadow: `
        #0c0d0c 1px 1px 0px,
        #f3f7f8 -1px 1px 0px,
        #87b5b7 1px -1px 0px,
        #444b7c -1px -1px 0px,
        #f0f2f4 3px -3px 0px,
        #6b5e9a -3px 3px 0px,
        #80a2a7 3px 3px 0px,
        #10100f -3px -3px 0px
      `,
      fontSize: '14vw',
      width: '12vw',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <style>{styles.fontFace}</style>

      {/* YouTube Video with no clipping */}
      <iframe
        src="https://www.youtube.com/embed/iYmvCUonukw?autoplay=1&mute=1&controls=0&loop=1&playlist=iYmvCUonukw"
        title="YouTube video player"
        allow="autoplay; encrypted-media"
        style={styles.iframe}
      ></iframe>

      {/* Clock overlay */}
      <div style={styles.wrapper}>
        <div style={styles.clockContainer}>
          {digits.map((digit, i) => (
            <div key={i} style={styles.digitBox}>{digit}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clock;
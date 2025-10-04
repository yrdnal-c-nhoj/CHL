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
  const [s1, s2] = formatTime(time.getSeconds());

  // Styles
  const styles = {
    fontFace: `
      @font-face {
        font-family: 'iss';
        src: url(${issFont}) format('truetype');
      }
    `,
  // Inside styles
iframe: {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) scale(1.2)', // increased scale
  width: '120vw',  // larger than viewport width
  height: '140vh', // taller than viewport height
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
      gap: '1vh',
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
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '18vh',
      width: '14vh',
      height: '20vh',
      textAlign: 'center',
      boxSizing: 'border-box',
      zIndex: 19,
    },
  };

  return (
    <div style={{ margin: 0, padding: 0, overflow: 'hidden', width: '100vw', height: '100vh' }}>
      <style>{styles.fontFace}</style>

      {/* Background YouTube Video */}
      <iframe
        src="https://www.youtube.com/embed/iYmvCUonukw?autoplay=1&mute=1&controls=0&loop=1&playlist=iYmvCUonukw"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        style={styles.iframe}
      ></iframe>

      {/* Clock overlay */}
      <div style={styles.wrapper}>
        <div style={styles.clockContainer}>
          {[h1, h2, m1, m2, s1, s2].map((digit, i) => (
            <div key={i} style={styles.digitBox}>{digit}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clock;

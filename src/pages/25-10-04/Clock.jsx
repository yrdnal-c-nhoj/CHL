import React, { useEffect, useState, useRef } from 'react';
import clockFont from './iss.ttf';
import bgMp4 from './waterfall.mp4';
import bgWebp from './waterfall.webp';

const ClockVideoBackground = () => {
  const [time, setTime] = useState(new Date());
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);

  // Update clock every 50ms for smooth milliseconds
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(interval);
  }, []);

  // Fade in effect
  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // Split each number into digits with leading zeros
  const formatDigits = (value, length = 2) =>
    String(value).padStart(length, '0').split('');

  const hDigits = formatDigits(time.getHours());
  const mDigits = formatDigits(time.getMinutes());
  const sDigits = formatDigits(time.getSeconds());
  const msDigits = formatDigits(Math.floor(time.getMilliseconds() / 10));

  const styles = {
    fontFace: `
      @font-face {
        font-family: 'iss';
        src: url(${clockFont}) format('truetype');
      }
    `,
    root: {
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      width: '100vw',
      height: '100dvh',
      backgroundColor: '#000000',
      position: 'relative',
      fontFamily: 'iss, sans-serif',
    },
    video: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100dvh',
      objectFit: 'cover',
      zIndex: 0,
      opacity: loaded ? 1 : 0,
      transition: 'opacity 0.2s ease-in-out',
      backgroundColor: '#000000',
    },
    wrapper: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10,
      display: loaded ? 'flex' : 'none',
      flexDirection: 'column', // stack vertically always
      gap: '0.0rem',
      alignItems: 'center',
    },
    group: {
      display: 'flex', // horizontal group of digits
      flexDirection: 'row',
      gap: '0.01vh',
      justifyContent: 'center',
      alignItems: 'center',
    },
    digitBox: {
      color: '#0946C1FF',
      textShadow: `
        0.1vh 0.1vh rgba(0,0,0,0.8),
        -0.1vh -0.1vh  rgba(255,220,220,0.9)
      `,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '33vh',
      width: '14vh',
      height: '19vh',
      textAlign: 'center',
      boxSizing: 'border-box',
    },
  };

  return (
    <div style={styles.root}>
      <style>{styles.fontFace}</style>

      {/* Background Video */}
      <video
        ref={videoRef}
        style={styles.video}
        autoPlay
        loop
        muted
        playsInline
        onError={() => {
          if (videoRef.current) {
            videoRef.current.src = bgWebp;
            videoRef.current.play();
          }
        }}
      >
        <source src={bgMp4} type="video/mp4" />
        <source src={bgWebp} type="image/webp" />
      </video>

      {/* Clock Overlay */}
      <div style={styles.wrapper}>
        <div style={styles.group}>
          {hDigits.map((d, i) => <div key={i} style={styles.digitBox}>{d}</div>)}
        </div>
        <div style={styles.group}>
          {mDigits.map((d, i) => <div key={i} style={styles.digitBox}>{d}</div>)}
        </div>
        <div style={styles.group}>
          {sDigits.map((d, i) => <div key={i} style={styles.digitBox}>{d}</div>)}
        </div>
        <div style={styles.group}>
          {msDigits.map((d, i) => <div key={i} style={styles.digitBox}>{d}</div>)}
        </div>
      </div>
    </div>
  );
};

export default ClockVideoBackground;

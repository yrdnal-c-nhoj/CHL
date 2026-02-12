import React, { useEffect, useState } from 'react';
import { useFontLoader } from '../../../utils/fontLoader'; 
import issFont from '../../../assets/fonts/25-05-30-iss.ttf';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const fontReady = useFontLoader('iss', issFont, { timeout: 3000 });

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'iss';
        src: url(${issFont}) format('truetype');
        font-display: block;
      }
    `;
    document.head.appendChild(style);

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      clearInterval(interval);
    };
  }, [issFont]);

  const formatDigit = (value) => String(value).padStart(2, '0').split('');

  const [h1, h2] = formatDigit(time.getHours());
  const [m1, m2] = formatDigit(time.getMinutes());
  const [s1, s2] = formatDigit(time.getSeconds());

  const styles = {
    screen: {
      position: 'fixed',
      inset: 0,
      margin: 0,
      padding: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      overflow: 'visible',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    backgroundIframe: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'scale(1.1)',
      transformOrigin: 'center',
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'visible',
    },

    clockWrapper: {
      position: 'relative',
      zIndex: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      opacity: fontReady ? 1 : 0,
      transition: 'opacity 0.8s ease-in-out',
    },

    clockContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      // Consistent spacing between digit "boxes"
      gap: '1.5vw', 
      padding: '0 2vw',
      // Move clock slightly left
      marginLeft: '-3vw',
    },

    digitBox: {
      // Flex centering prevents the character from jumping within the box
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      
      // Fixed width based on font size ensures the layout never shifts
      width: '0.8em', 
      height: '1.2em',
      
      color: '#8D6E6E',
      fontFamily: "'iss', monospace",
      fontSize: 'clamp(3rem, 8vw, 12rem)', 
      fontWeight: 400,
      lineHeight: 1,
      textAlign: 'center',
      
      // Forces consistent spacing if the font supports OpenType features
      fontVariantNumeric: 'tabular-nums',
      
      textShadow: `
        0 0 20px #F1C120,
        0 0 40px #CB5F26,
        0 0 80px #F1C120,
        0 0 60px #f3f7f8,
        0 1px 1px #D4D6E0
      `,
    },
  };

  return (
    <div style={styles.screen}>
      <iframe
        src="https://www.youtube.com/embed/iYmvCUonukw?autoplay=1&mute=1&controls=0&loop=1&playlist=iYmvCUonukw&rel=0&modestbranding=1"
        title="Background ambience"
        allow="autoplay; fullscreen"
        style={styles.backgroundIframe}
      />

      <div style={styles.clockWrapper}>
        <div style={styles.clockContainer}>
          <div style={styles.digitBox}>{h1}</div>
          <div style={styles.digitBox}>{h2}</div>
          <div style={styles.digitBox}>{m1}</div>
          <div style={styles.digitBox}>{m2}</div>
          <div style={styles.digitBox}>{s1}</div>
          <div style={styles.digitBox}>{s2}</div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
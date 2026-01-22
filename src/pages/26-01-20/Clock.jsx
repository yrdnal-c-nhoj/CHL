import React, { useEffect, useState, useMemo } from 'react';
import bgImage from '../../assets/clocks/26-01-20/hairdo.webp';
import d250916font from '../../assets/fonts/26-01-20-hairdo.ttf';

// Defined outside to prevent re-allocation on every second tick
const DIGIT_MAP = {
  '0': 'B', '1': 'V', '2': 'A', '3': 'X', '4': 'D',
  '5': 'Q', '6': 'M', '7': 'G', '8': 'H', '9': 'T'
};

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);

  // 1. Manage Timer
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Handle Responsive Logic
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Asset Preloading & Font Injection
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'MyD250916font';
        src: url(${d250916font}) format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    const img = new Image();
    img.src = bgImage;

    Promise.all([
      document.fonts.ready,
      new Promise(res => { img.onload = res; img.onerror = res; })
    ]).then(() => setIsLoaded(true));

    return () => {
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  // 4. Time Formatting
  const timeStrings = useMemo(() => ({
    hours: String(time.getHours()).padStart(2, '0'),
    minutes: String(time.getMinutes()).padStart(2, '0'),
    seconds: String(time.getSeconds()).padStart(2, '0'),
  }), [time]);

  // 5. Dynamic Styles
  const styles = {
    container: {
      position: 'relative',
      height: '100dvh',
      width: '100vw',
      backgroundColor: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    background: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'brightness(0.6) contrast(1.6) saturate(1.3)',
      zIndex: 1,
    },
    gradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '66dvh',
      background: 'linear-gradient(to bottom, rgba(35, 36, 2, 0.93), rgba(220, 13, 13, 0))',
      zIndex: 2,
      pointerEvents: 'none',
    },
    content: {
      position: 'relative',
      zIndex: 3,
      display: 'flex',
      flexDirection: isLargeScreen ? 'row' : 'column',
      gap: isLargeScreen ? '1.5vw' : '0.5vh',
      alignItems: 'center',
    },
    digit: {
      fontFamily: "'MyD250916font', sans-serif",
      fontSize: isLargeScreen ? '28vh' : '18vh',
      color: '#B80A0A',
      width: '0.75em',
      textAlign: 'center',
      lineHeight: isLargeScreen ? '1.1' : '0.8',
      // filter: 'drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.8))',
      textShadow: '1px 1px 3px #FFFFFF',
    }
  };

  const renderUnit = (value) => (
    <div style={{ display: 'flex' }}>
      {value.split('').map((digit, i) => (
        <span key={i} style={styles.digit}>
          {DIGIT_MAP[digit] || digit}
        </span>
      ))}
    </div>
  );

  if (!isLoaded) {
    return <div style={{ ...styles.container, color: '#fff' }}>Loading...</div>;
  }

  return (
    <main style={styles.container}>
      <div style={styles.background} aria-hidden="true" />
      <div style={styles.gradient} aria-hidden="true" />
      
      <time 
        style={styles.content} 
        dateTime={`${timeStrings.hours}:${timeStrings.minutes}:${timeStrings.seconds}`}
      >
        {renderUnit(timeStrings.hours)}
        {renderUnit(timeStrings.minutes)}
        {renderUnit(timeStrings.seconds)}
      </time>
    </main>
  );
};

export default Clock;
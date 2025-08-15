import React, { useState, useEffect } from 'react';
import customFontUrl from './dom.ttf';

const fontFamily = "'dom', monospace";

const styles = {
  clockContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    fontFamily: fontFamily,
    padding: '2rem',
    boxSizing: 'border-box',
  },
  clockDisplay: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#00ff88',
    textShadow: '0 0 1rem rgba(0, 255, 136, 0.8), 0 0 2rem rgba(0, 255, 136, 0.4)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '1.5rem 3rem',
    borderRadius: '1rem',
    border: '0.125rem solid #00ff88',
    boxShadow: '0 0 2rem rgba(0, 255, 136, 0.3)',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0.25rem',
    backdropFilter: 'blur(0.625rem)',
    fontFamily: fontFamily,
  },
  
  digitalFrame: {
    position: 'relative',
    padding: '2rem',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '1.5rem',
    border: '0.0625rem solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(0.625rem)',
  },
  glowEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120%',
    height: '120%',
    background: 'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    zIndex: -1,
  },

};

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @font-face {
        font-family: 'dom';
        src: url(${customFontUrl}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(styleSheet);

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      document.head.removeChild(styleSheet);
    };
  }, []);

  const digitToLetter = (str) => {
    const map = {
      '0': 'A', '1': 'B', '2': 'C', '3': 'E', '4': 'F', '5': 'I', '6': 'J', '7': 'N', '8': 'O', '9': 'T',
    };
    return str.replace(/\d/g, (d) => map[d]);
  };

  const formatTime = (date) => {
    const timeStr = date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return digitToLetter(timeStr);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  return (
    <div style={styles.clockContainer}>
      <div style={styles.digitalFrame}>
        <div style={styles.clockDisplay}>{formatTime(time)}</div>
   
      </div>
    </div>
  );
};

export default DigitalClock;

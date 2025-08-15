import React, { useState, useEffect } from 'react';
import customFontUrl from './dom.ttf';
import backgroundImg from './tabl.webp';

const fontFamily = "'dom', monospace";

const styles = {
  clockContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImg})`, // Your custom background
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    fontFamily: fontFamily,
    // padding: '2rem',
    boxSizing: 'border-box',
  },
  clockDisplay: {
    display: 'flex',
    // gap: '0.5rem',
    fontVariantNumeric: 'tabular-nums',
    fontFamily: fontFamily,
  },
 digit: {
  display: 'inline-block',
  fontSize: '4rem',
  color: '#2C2A2AFF',
  backgroundColor: '#F5EFDFFF',
  borderRadius: '0.5rem',
  padding: 0,
  lineHeight: 1,
  border: 'none',
  fontFamily: fontFamily,
  textAlign: 'center',
  width: 'auto',
  height: 'auto',
  boxShadow: '0.2rem 0.2rem 0.9rem rgba(0,0,0,0.3)', // soft shadow, like resting on a table
},

  colon: {
    fontSize: '0.01rem',
    display: 'flex',
    alignItems: 'center',
  },
  digitalFrame: {
    position: 'relative',
    padding: '30.01rem',
  },
}

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
      '0': 'A', '1': 'B', '2': 'C', '3': 'E', '4': 'F',
      '5': 'I', '6': 'J', '7': 'N', '8': 'O', '9': 'T',
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

  const renderTimeWithSeparateDigits = (timeString) => {
    return timeString.split('').map((char, index) => {
      if (char === ':') {
        return (
          <span key={index} style={styles.colon}>
            :
          </span>
        );
      }
      return (
        <span key={index} style={styles.digit}>
          {char}
        </span>
      );
    });
  };

  return (
    <div style={styles.clockContainer}>
      <div style={styles.digitalFrame}>
        <div style={styles.clockDisplay}>
          {renderTimeWithSeparateDigits(formatTime(time))}
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
import React, { useState, useEffect } from 'react';
import customFontUrl from './dom.ttf';
import backgroundImg from './tabl.webp';

const fontFamily = "'dom', monospace";

const styles = {
  clockContainer: (fontReady) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100dvh',
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    fontFamily: fontReady ? fontFamily : 'monospace', // fallback until font is ready
    visibility: fontReady ? 'visible' : 'hidden', // hide until font loads
  }),
  clockDisplay: {
    display: 'flex',
    fontVariantNumeric: 'tabular-nums',
  },
  digit: {
    display: 'inline-block',
    fontSize: '4rem',
    color: '#2C2A2AFF',
    backgroundColor: '#F5EFDFFF',
    borderRadius: '0.4rem',
    lineHeight: 1,
    border: 'none',
    textAlign: 'center',
    width: 'auto',
    height: 'auto',
    boxShadow: '0.2rem 0.2rem 0.9rem rgba(0,0,0,0.3)',
  },
  colon: {
    fontSize: '0.01rem',
    display: 'flex',
    alignItems: 'center',
  },
};

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    // Load custom font via FontFace API
    const font = new FontFace('dom', `url(${customFontUrl})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontReady(true);
    });

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  const renderTimeWithSeparateDigits = (timeString) =>
    timeString.split('').map((char, index) =>
      char === ':' ? (
        <span key={index} style={styles.colon}>:</span>
      ) : (
        <span key={index} style={styles.digit}>{char}</span>
      )
    );

  return (
    <div style={styles.clockContainer(fontReady)}>
      {fontReady && (
        <div style={styles.clockDisplay}>
          {renderTimeWithSeparateDigits(formatTime(time))}
        </div>
      )}
    </div>
  );
};

export default DigitalClock;

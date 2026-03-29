import React, { useState, useEffect } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import customFontUrl from '../../../assets/fonts/25-08-15-dom.ttf';
import backgroundImg from '../../../assets/images/25-08/25-08-15/tabl.webp';

const fontFamily = "'dom', monospace";

const styles = {
  clockContainer: (fontReady) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100dvh',
    width: '100%',
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    fontFamily: fontReady ? fontFamily : 'monospace',
    visibility: fontReady ? 'visible' : 'hidden',
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

const DigitalClock: React.FC = () => {
  const fontConfigs = [
    {
      fontFamily: 'dom',
      fontUrl: customFontUrl,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const digitToLetter = (str) => {
    const map = {
      0: 'A',
      1: 'B',
      2: 'C',
      3: 'E',
      4: 'F',
      5: 'I',
      6: 'J',
      7: 'N',
      8: 'O',
      9: 'T',
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
        <span key={index} style={styles.colon}>
          :
        </span>
      ) : (
        <span key={index} style={styles.digit}>
          {char}
        </span>
      ),
    );

  return (
    <div style={styles.clockContainer(fontsLoaded)}>
      {fontsLoaded && (
        <div style={styles.clockDisplay}>
          {renderTimeWithSeparateDigits(formatTime(time))}
        </div>
      )}
    </div>
  );
};

export default DigitalClock;

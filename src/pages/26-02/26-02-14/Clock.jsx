import React, { useEffect, useState } from 'react';
import airportFont from '../../../assets/fonts/26-02-14-airport.ttf';
import backgroundGif from '../../../assets/images/26-02-14/prop.gif';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now);
      setIsInitialized(true);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Custom substitution mapping
  const substitutionMap = {
    0: 'n',
    1: 't',
    2: '6',
    3: 'L',
    4: '9',
    5: '1',
    6: 'J',
    7: 'S',
    8: 'E',
    9: 'm'
  };

  const numberToLetter = (num) => {
    return substitutionMap[num] !== undefined ? substitutionMap[num] : num.toString();
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const splitDigitsToLetters = (timeString) => {
    return timeString.split('').map(digit => numberToLetter(parseInt(digit)));
  };

  const { hours, minutes, seconds } = formatTime(time);

  const styles = {
    container: {
      width: '100vw',
      height: '100dvh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',
      backgroundImage: `url(${backgroundGif})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Airport', monospace"
    },
    clockContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2vh',
      padding: '2vh',
      width: '100%',
      maxWidth: '1200px'
    },
    timeDisplay: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2vh',
      padding: '4vh 6vw',
      borderRadius: '24px',
    },
    timeSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    digitGroup: {
      display: 'flex',
      gap: '10px'
    },
    digitBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      width: 'clamp(50px, 32vw, 110px)', 
      height: 'clamp(70px, 16vh, 140px)',
      flexShrink: 0, // Prevents the box from squeezing
      transition: 'all 0.3s ease'
    },
    digit: {
      fontSize: 'clamp(40px, 12vh, 100px)',
      color: '#0933B1',
      fontFamily: "'Airport', monospace",
      textAlign: 'center',
      display: 'block',
      width: '100%',
      lineHeight: 1
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @font-face {
            font-family: 'Airport';
            src: url(${airportFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: block;
          }
        `}
      </style>
      
      {!isInitialized ? (
        <div style={{ color: '#fff', fontSize: '24px' }}> </div>
      ) : (
        <div style={styles.clockContainer}>
          <div style={styles.timeDisplay}>
            
            {/* HOURS */}
            <div style={styles.timeSection}>
        
              <div style={styles.digitGroup}>
                {splitDigitsToLetters(hours).map((letter, index) => (
                  <div key={`hour-${index}`} style={styles.digitBox}>
                    <span style={styles.digit}>{letter}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={styles.timeSection}>
              <div style={styles.digitGroup}>
                {splitDigitsToLetters(minutes).map((letter, index) => (
                  <div key={`minute-${index}`} style={styles.digitBox}>
                    <span style={styles.digit}>{letter}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={styles.timeSection}>
              <div style={styles.digitGroup}>
                {splitDigitsToLetters(seconds).map((letter, index) => (
                  <div key={`second-${index}`} style={styles.digitBox}>
                    <span style={styles.digit}>{letter}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalClock;
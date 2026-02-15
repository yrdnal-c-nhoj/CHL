import React, { useEffect, useState } from 'react';
import airportFont from '../../../assets/fonts/26-02-14-airport.ttf';
import backgroundGif from '../../../assets/images/26-02-14/prop.gif';
import backgroundGif2 from '../../../assets/images/26-02-14/runway.gif';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
      setIsInitialized(true);
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Substitution mapping based on your requirements
  const substitutionMap = {
    0: 'n', 1: 't', 2: '6', 3: 'L', 4: '9',
    5: '1', 6: 'J', 7: 'S', 8: 'E', 9: 'm'
  };

  const numberToLetter = (num) => substitutionMap[num] ?? num.toString();

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const splitDigitsToLetters = (timeString) => {
    return timeString.split('').map(digit => numberToLetter(parseInt(digit, 10)));
  };

  const { hours, minutes, seconds } = formatTime(time);

  const styles = {
    container: {
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000', // Base black layer
    },
    // Background 1: Propeller GIF
    bgLayer1: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `url(${backgroundGif})`,
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      opacity: 0.8,
      filter: 'contrast(1.3) brightness(0.7)', // Individual filter
      zIndex: 1,
    },
    // Background 2: Runway GIF
 bgLayer2: {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundImage: `url(${backgroundGif2})`,
  backgroundSize: '100% 100%',
  backgroundPosition: 'center',
  opacity: 0.6,               // ← lower a bit more if needed
  filter: 'contrast(4) brightness(1.3)',  // ← tune to taste, lower brightness helps hide darks
  zIndex: 2,
  transform: 'scaleX(-1)',
  mixBlendMode: 'lighten',    // ← key change – or try 'screen'
  // mixBlendMode: 'screen',  // alternative – often looks nicer with lights
},
    clockContainer: {
      position: 'relative',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2vh',
      width: '100%',
    },
    digitGroup: {
      display: 'flex',
      gap: '8vh',
      justifyContent: 'center',
    },
    digitBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'clamp(90px, 22vw, 170px)', 
      height: 'clamp(80px, 22vh, 180px)',
    },
    digit: {
      fontSize: 'clamp(50px, 14vh, 140px)',
      color: '#D4D8E3',
      fontFamily: "'Airport', monospace",
      textAlign: 'center',
      lineHeight: 1,
      // textShadow: '0 0 15px rgba(9, 51, 177, 0.4)', // Subtle blue glow
    },
  };

  return (
    <div style={styles.container}>
      {/* Global Font Injection */}
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
      
      {/* Background Layers */}
      <div style={styles.bgLayer1} />
      <div style={styles.bgLayer2} />

      {!isInitialized ? (
        <div style={{ color: '#E3E7F1', zIndex: 11, fontFamily: 'monospace' }}>
      
        </div>
      ) : (
        <div style={styles.clockContainer}>
          
          {/* HOURS */}
          <div style={styles.digitGroup}>
            {splitDigitsToLetters(hours).map((letter, index) => (
              <div key={`h-${index}`} style={styles.digitBox}>
                <span style={styles.digit}>{letter}</span>
              </div>
            ))}
          </div>
          
          {/* MINUTES */}
          <div style={styles.digitGroup}>
            {splitDigitsToLetters(minutes).map((letter, index) => (
              <div key={`m-${index}`} style={styles.digitBox}>
                <span style={styles.digit}>{letter}</span>
              </div>
            ))}
          </div>
          
          {/* SECONDS */}
          <div style={styles.digitGroup}>
            {splitDigitsToLetters(seconds).map((letter, index) => (
              <div key={`s-${index}`} style={styles.digitBox}>
                <span style={styles.digit}>{letter}</span>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default DigitalClock;
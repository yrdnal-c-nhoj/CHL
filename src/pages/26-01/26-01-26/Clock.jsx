import React, { useState, useEffect } from 'react';

// Explicit Asset Imports
import top260126Font from '../../../assets/fonts/26-01-26-halfb.ttf';
import bottom260126Font from '../../../assets/fonts/26-01-26-halft.ttf';

const DynamicComponent = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const styleId = 'static-font-styles';
    let styleTag = document.getElementById(styleId);
    
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    
    styleTag.innerHTML = `
      @font-face {
        font-family: 'TopFont';
        src: url('${top260126Font}') format('truetype');
        font-display: block;
      }
      @font-face {
        font-family: 'BottomFont';
        src: url('${bottom260126Font}') format('truetype');
        font-display: block;
      }
    `;

    Promise.all([
      document.fonts.load('1em TopFont'),
      document.fonts.load('1em BottomFont')
    ]).then(() => {
      setTimeout(() => setIsLoaded(true), 125);
    }).catch(() => {
      setIsLoaded(true); 
    });
  }, []);

  const timeString = time.getHours().toString().padStart(2, '0') + 
                     time.getMinutes().toString().padStart(2, '0') + 
                     time.getSeconds().toString().padStart(2, '0');

  const DigitBox = ({ digit }) => (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '1.4em', 
      height: '1em',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      transform: 'scaleX(3)',
      transformOrigin: 'center',
    }}>
      {digit}
    </div>
  );

  const styles = {
    container: {
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'linear-gradient(90deg, #606360 0%, #7E7EA5 30%,#ECCFEE 50%,#8686AB 70%, #515351 100%)',
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 0.2s ease-in',
      overflow: 'hidden',
    },
    sideWrapper: {
      zIndex: 2,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      color: '#ECCFEE',
    },
    verticalClock: {
      writingMode: 'vertical-rl',
      textOrientation: 'mixed',
      fontSize: '15vh',
      display: 'flex',
      alignItems: 'center',
      transform: 'rotate(180deg)',
    }
  };

  if (!isLoaded) return null;

  return (
    <div style={styles.container}>
      {/* Left Clock */}
      <div style={styles.sideWrapper}>
        <div style={{...styles.verticalClock, fontFamily: 'TopFont', marginLeft: '4vw'}}>
          {timeString.split('').map((d, i) => <DigitBox key={`l-${i}`} digit={d} />)}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Right Clock */}
      <div style={styles.sideWrapper}>
        <div style={{...styles.verticalClock, fontFamily: 'BottomFont', marginRight: '1vw'}}>
          {timeString.split('').map((d, i) => <DigitBox key={`r-${i}`} digit={d} />)}
        </div>
      </div>
    </div>
  );
};

export default DynamicComponent;
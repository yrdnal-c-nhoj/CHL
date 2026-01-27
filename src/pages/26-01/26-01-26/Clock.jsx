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
      document.fonts.load('1vh TopFont'),
      document.fonts.load('1vh BottomFont')
    ]).then(() => {
      // Small delay to ensure layout is ready
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
      minWidth: '7vh',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      // The massive scale can cause blurriness; translateZ(0) helps sharpen it
      transform: 'scaleY(1) translateZ(0)',
      transformOrigin: 'center',
      willChange: 'transform',
    }}>
      {digit}
    </div>
  );

  const styles = {
    container: {
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      // space-between keeps them at the poles, but we use heights to prevent clipping
      justifyContent: 'space-between', 
      alignItems: 'center',
      background: 'linear-gradient(180deg, #383A38 0%, #7E7EA5 30%,#ECCFEE 50%,#8686AB 70%, #393B39 100%)',
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 0.2s ease-in',
      overflow: 'hidden',
    },
    clockWrapper: {
      zIndex: 2,
      width: '100%',
      // Defining a height of ~40-45% of the screen gives the 15x scale 
      // enough room to exist without being clipped by the screen edge.
      height: '42dvh', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ECCFEE',
      fontSize: '7vh',
      
      overflow: 'visible', // Crucial to let the scale expand beyond the wrapper div
    },
    horizontalClock: {
      display: 'flex',
      alignItems: 'center',
    },
    leftClockShadow: {
      textShadow: '-0px 32vh 2vh rgba(0, 0, 0, 0.9), 0px 2px 12px rgb(240, 7, 7)',
    },
    rightClockShadow: {
      textShadow: '0px -32vh 2vh rgba(0, 0, 0, 0.9), 0px -2px 12px rgb(238, 9, 9)',
    }
  };

  if (!isLoaded) return null;

  return (
    <div style={styles.container}>
      {/* Top Clock Section */}
      <div style={styles.clockWrapper}>
        <div style={{...styles.horizontalClock, fontFamily: 'TopFont', ...styles.leftClockShadow}}>
          {timeString.split('').map((d, i) => <DigitBox key={`l-${i}`} digit={d} />)}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom Clock Section */}
      <div style={styles.clockWrapper}>
        <div style={{...styles.horizontalClock, fontFamily: 'BottomFont', ...styles.rightClockShadow}}>
          {timeString.split('').map((d, i) => <DigitBox key={`r-${i}`} digit={d} />)}
        </div>
      </div>
    </div>
  );
};

export default DynamicComponent;
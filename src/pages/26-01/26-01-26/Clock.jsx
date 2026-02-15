import React, { useState, useEffect } from 'react';

// Explicit Asset Imports
import top260126Font from '../../../assets/fonts/26-01-26-halfb.ttf';
import bottom260126Font from '../../../assets/fonts/26-01-26-halft.ttf';

const DynamicComponent = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
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
      setTimeout(() => setFontsLoaded(true), 125);
    }).catch(() => {
      setFontsLoaded(true); 
    });
  }, []);

  const timeString = time.toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/[: ]/g, ''); // Remove colons and spaces

  const DigitBox = ({ digit }) => (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '6vh',
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
      opacity: fontsLoaded ? 1 : 0,
      transition: 'opacity 0.2s ease-in',
      overflow: 'hidden',
    },
    clockWrapper: {
      zIndex: 2,
      width: '100%',
      // Reduced height to prevent shadow clipping
      height: '35dvh', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ECCFEE',
      fontSize: '6vh',
      // Add padding to ensure shadows don't clip
      padding: '10vh 0',
      boxSizing: 'border-box',
      overflow: 'visible',
    },
    horizontalClock: {
      display: 'flex',
      alignItems: 'center',
    },
    leftClockShadow: {
      textShadow: '-0px 34.5vh 1.7vh rgba(0, 0, 0, 0.9), 0px 2px 12px rgb(240, 7, 7)',
    },
    rightClockShadow: {
      textShadow: '0px -34.5vh 1.7vh rgba(0, 0, 0, 0.9), 0px -2px 12px rgb(238, 9, 9)',
    }
  };

  if (!fontsLoaded) return null;

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
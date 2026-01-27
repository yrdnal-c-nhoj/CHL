import React, { useState, useEffect, useMemo } from 'react';

// Explicit Asset Imports
import topFontUrl from '../../../assets/fonts/26-01-26-halfb.ttf';
import bottomFontUrl from '../../../assets/fonts/26-01-26-halft.ttf';
import backgroundImg from '../../../assets/clocks/26-01-21/flap.webp'; 

const DynamicComponent = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [time, setTime] = useState(new Date());
  const [loadError, setLoadError] = useState(false);

  const fontConfig = useMemo(() => {
    const suffix = () => Math.random().toString(36).substring(2, 7);
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return {
      left: `FontLeft_${dateStr}_${suffix()}`,
      right: `FontRight_${dateStr}_${suffix()}`
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const styleId = 'dynamic-font-styles';
    const styleTag = document.createElement('style');
    styleTag.id = styleId;
    
    styleTag.innerHTML = `
      @font-face {
        font-family: '${fontConfig.left}';
        src: url('${topFontUrl}') format('truetype');
        font-display: block;
      }
      @font-face {
        font-family: '${fontConfig.right}';
        src: url('${bottomFontUrl}') format('truetype');
        font-display: block;
      }
    `;
    document.head.appendChild(styleTag);

    Promise.all([
      document.fonts.load(`1em ${fontConfig.left}`),
      document.fonts.load(`1em ${fontConfig.right}`)
    ])
      .then(() => {
        setTimeout(() => setIsLoaded(true), 125);
      })
      .catch((err) => {
        console.error("Font loading failed:", err);
        setLoadError(true);
        setIsLoaded(true);
      });

    return () => {
      const existingTag = document.getElementById(styleId);
      if (existingTag) existingTag.remove();
    };
  }, [fontConfig]);

  // Time Formatting
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(time);

  // Create individual digit components
  const DigitBox = ({ digit }) => (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '0.6em',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      height: '0.8em',
    //   margin: '0 0.05em',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '0.1em',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      color: 'inherit',
    }}>
      {digit}
    </div>
  );

  const TimeDisplay = ({ timeString }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {timeString.split('').map((digit, index) => (
        <DigitBox key={index} digit={digit} />
      ))}
    </div>
  );

  const styles = {
    container: {
      width: '100vw',
      height: '100dvh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 0.125s ease-in-out',
      backgroundColor: '#044400',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1,
    },
    sideWrapper: {
      zIndex: 2,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ECCFEE',
      whiteSpace: 'nowrap',
    },
    leftWrapper: {
        paddingLeft: '2vw',
    },
    rightWrapper: {
        paddingRight: '0.5vw', // Reduced padding to move it closer to the edge
    },
    verticalClock: {
      writingMode: 'vertical-rl', 
      textOrientation: 'mixed',
      fontSize: '18vh',
      display: 'flex',
      alignItems: 'center',
    },
    leftClock: {
      fontFamily: loadError ? 'sans-serif' : fontConfig.left,
      transform: 'rotate(180deg)', 
    },
    rightClock: {
      fontFamily: loadError ? 'serif' : fontConfig.right,
      transform: 'rotate(180deg)',
      // Small negative margin to counteract default font bounding box spacing
      marginRight: '-3vw', 
    },
    ampm: {
      display: 'inline-block',
    }
  };

  if (!isLoaded) return null;

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      {/* Left Vertical Clock */}
      <div style={{...styles.sideWrapper, ...styles.leftWrapper}}>
        <div style={{...styles.verticalClock, ...styles.leftClock}}>
          <TimeDisplay timeString={hours + minutes + seconds} />
        </div>
      </div>

      {/* Center content */}
      <div style={{ zIndex: 2, flex: 1, textAlign: 'center', color: 'white' }}>
        {/* Your content here */}
      </div>

      {/* Right Vertical Clock */}
      <div style={{...styles.sideWrapper, ...styles.rightWrapper}}>
        <div style={{...styles.verticalClock, ...styles.rightClock}}>
          <TimeDisplay timeString={hours + minutes + seconds} />
        </div>
      </div>
    </div>
  );
};

export default DynamicComponent;
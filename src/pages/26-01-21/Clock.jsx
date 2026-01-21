import React, { useState, useEffect, useMemo } from 'react';

// Explicit Asset Imports
import backgroundImage from '../../assets/clocks/26-01-21/h2o.gif';
import tileImage from '../../assets/clocks/26-01-21/flap.webp'; 
import customFontFile from '../../assets/fonts/26-01-21-migrate.ttf';

const AnalogClockDisplay = () => {
  const [isReady, setIsReady] = useState(false);
  const [time, setTime] = useState(new Date());

  const fontFamilyName = useMemo(() => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `Font-${date}-${randomStr}`;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const styleId = `dynamic-font-${fontFamilyName}`;

    const initResources = async () => {
      try {
        const fontFaceStyle = document.createElement('style');
        fontFaceStyle.id = styleId;
        fontFaceStyle.innerHTML = `
          @font-face {
            font-family: '${fontFamilyName}';
            src: url('${customFontFile}') format('truetype');
            font-display: block;
          }
        `;
        document.head.appendChild(fontFaceStyle);
        await document.fonts.load(`1em ${fontFamilyName}`);
        
        if (isMounted) {
          setTimeout(() => setIsReady(true), 125);
        }
      } catch (error) {
        setIsReady(true);
      }
    };

    initResources();
    const timer = setInterval(() => setTime(new Date()), 1000);

    return () => {
      isMounted = false;
      clearInterval(timer);
      const styleTag = document.getElementById(styleId);
      if (styleTag) styleTag.remove();
    };
  }, [fontFamilyName]);

  // Calculate hand rotations
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6;

  if (!isReady) return null;

  const styles = {
    wrapper: {
      width: '100vw',
      height: '100dvh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: isReady ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    },
    backgroundLayer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 1,
    },
    tileLayer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundImage: `url(${tileImage})`,
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center', 
      backgroundSize: '600px 600px', 
      filter: 'brightness(1.6)',
      zIndex: 7,
    },
    clockFace: {
      position: 'relative',
      zIndex: 3,
      width: 'min(120vw, 120vh)',
      height: 'min(120vw, 120vh)',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    hand: {
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      transformOrigin: 'bottom',
      borderRadius: '10px',
      backgroundColor: '#8851127D',
     },
    hourHand: {
      width: '8px',
      height: '25%',
      transform: `translateX(-50%) rotate(${hourDeg}deg)`,
    },
    minuteHand: {
      width: '4px',
      height: '40%',
      transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.backgroundLayer} />
      <div style={styles.tileLayer} />
      
      {/* Analog Clock */}
      <div style={styles.clockFace}>
        <div style={styles.centerDot} />
        {/* Hour Hand */}
        <div style={{ ...styles.hand, ...styles.hourHand }} />
        {/* Minute Hand */}
        <div style={{ ...styles.hand, ...styles.minuteHand }} />
        
        {/* Optional: Simple hour markers using your font */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              height: '90%',
              transform: `rotate(${i * 30}deg)`,
              fontFamily: fontFamilyName,
              color: '#64300CC2'
            }}
          >
          <span style={{ 
    display: 'block', 
    transform: `rotate(-${i * 30}deg)`,
    fontSize: '2.5rem' // Add this line to set the size
}}>
  {i === 0 ? 12 : i}
</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalogClockDisplay;
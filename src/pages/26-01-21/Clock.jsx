import React, { useState, useEffect, useMemo } from 'react';

// Explicit Asset Imports
import backgroundImage from '../../assets/clocks/26-01-21/fllap.webp';
import tileImage from '../../assets/clocks/26-01-21/flap.webp'; 
import customFontFile from '../../assets/fonts/26-01-21-migrate.ttf';

const AnalogBirdMigrateClock = () => {
  const [isReady, setIsReady] = useState(false);
  const [time, setTime] = useState(new Date());

  const themeFlapColor = '#830DD2'; 
  
  const uvGlow = `
  
    0 0 12px #8B5CF6,
    0 0 25px #8B5CF6,
    0 0 45px #6366F1,
    0 0 70px #4F46E5
  `;

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

  const hours = time.getHours();
  const minutes = time.getMinutes();
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
      background: `linear-gradient(180deg, #1289F8, #575A04D2)`,
      opacity: isReady ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    },
    backgroundLayer: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 1,
      filter: 'brightness(0.35) saturate(0.6)', 
    },
    tileBase: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url(${tileImage})`,
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
      filter: 'brightness(1.1) contrast(1.4) saturate(1.6)',
      zIndex: 2,
      pointerEvents: 'none',
      opacity: 0.55,
    },
    clockFace: {
      position: 'relative',
      zIndex: 10,
      width: 'min(92vw, 92vh)',
      height: 'min(92vw, 92vh)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.6,
    },
    hand: {
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      transformOrigin: 'bottom center',
      borderRadius: '4px',
      backgroundColor: themeFlapColor,
      boxShadow: uvGlow,
      filter: 'brightness(1.5) saturate(2)',
      zIndex: 15,
    },
    number: {
      fontFamily: fontFamilyName,
      fontSize: 'min(11vw, 11vh)', 
      color: themeFlapColor,
      textShadow: uvGlow,
      userSelect: 'none',
      filter: 'brightness(1.5) saturate(2)',
      display: 'inline-block',
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.backgroundLayer} />

      {[ 725,  400].map(size => (
        <div key={size} style={{ ...styles.tileBase, backgroundSize: `${size}px` }} />
      ))}
      
      <div style={styles.clockFace}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: `rotate(${i * 30}deg)`, // Parent rotates the slot
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
           }}
          >
            {/* The span now stays aligned with the rotation of its parent container */}
            <span style={styles.number}>
              {i === 0 ? 12 : i}
            </span>
          </div>
        ))}

        {/* Hour Hand */}
        <div style={{ 
          ...styles.hand, 
          width: 'min(1.6vw, 0.4vh)', 
          height: '22%', 
          transform: `translateX(-50%) rotate(${hourDeg}deg)` 
        }} />
        
        {/* Minute Hand */}
        <div style={{ 
          ...styles.hand, 
          width: 'min(1.4vw, 0.3vh)', 
          height: '36%', 
          transform: `translateX(-50%) rotate(${minuteDeg}deg)` 
        }} />

        
      </div>
    </div>
  );
};

export default AnalogBirdMigrateClock;
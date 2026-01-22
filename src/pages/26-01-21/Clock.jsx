import React, { useState, useEffect, useMemo } from 'react';

// Explicit Asset Imports
import backgroundImage from '../../assets/clocks/26-01-21/h2o.gif';
import tileImage from '../../assets/clocks/26-01-21/flap.webp'; 
import customFontFile from '../../assets/fonts/26-01-21-migrate.ttf';

const AnalogClockDisplay = () => {
  const [isReady, setIsReady] = useState(false);
  const [time, setTime] = useState(new Date());

  // --- SINGLE CONTROL VARIABLE ---
  // Format: #RRGGBBAA (Red, Green, Blue, Alpha)
  // Current: #B026FF (Color) + 80 (50% Opacity)
  const themeColor = '#B026FF80'; 
  
  // We use the full color (without alpha) for the glow to keep it vibrant
  const baseColor = themeColor.slice(0, 7); 
  const glowShadow = `0 0 1px ${baseColor}, 0 0 2px ${baseColor}`;
  // -------------------------------

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
      backgroundColor: '#000',
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
      filter: 'brightness(0.6) saturate(0.2)',
    },
    tileBase: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url(${tileImage})`,
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
      filter: 'brightness(1.4) contrast(1.9) saturate(2.2)',
      zIndex: 2,
      pointerEvents: 'none',
      opacity: 0.9,
    },
    clockFace: {
      position: 'relative',
      zIndex: 10,
      width: 'min(99vw, 99vh)',
      height: 'min(99vw, 99vh)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    hand: {
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      transformOrigin: 'bottom center',
      borderRadius: '4px',
      backgroundColor: themeColor, // Transparency applied here
      boxShadow: glowShadow,
      zIndex: 15,
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.backgroundLayer} />

      {[925, 650, 425, 250].map(size => (
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
              transform: `rotate(${i * 30}deg)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingTop: '2%'
            }}
          >
            <span style={{ 
                fontFamily: fontFamilyName,
                fontSize: 'min(12vw, 12vh)', 
                fontWeight: 'bold',
                color: themeColor, // Transparency applied here
                textShadow: glowShadow,
            }}>
              {i === 0 ? 12 : i}
            </span>
          </div>
        ))}

        {/* Hour Hand */}
        <div style={{ 
          ...styles.hand, 
          width: 'min(2vw, 12px)', 
          height: '28%', 
          transform: `translateX(-50%) rotate(${hourDeg}deg)` 
        }} />
        
        {/* Minute Hand */}
        <div style={{ 
          ...styles.hand, 
          width: 'min(1.2vw, 7px)', 
          height: '42%', 
          transform: `translateX(-50%) rotate(${minuteDeg}deg)` 
        }} />
      </div>
    </div>
  );
};

export default AnalogClockDisplay;
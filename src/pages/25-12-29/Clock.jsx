import React, { useState, useEffect } from 'react';
import backgroundImage from '../../assets/clocks/25-12-29/shrine.webp';

const DynamicClockComponent = () => {
  const FONT_FAMILY = 'ShrineFont_20251229';
  const fontPath = '../../assets/fonts/25-12-29-shrine.ttf';
  const fontUrl = new URL(fontPath, import.meta.url).href;
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load the custom font
  useEffect(() => {
    const font = new FontFace(FONT_FAMILY, `url(${fontUrl})`);
    font.load().then(loaded => {
      document.fonts.add(loaded);
      setFontLoaded(true);
    }).catch(err => {
      console.error("Font load error:", err);
      setFontLoaded(true); // Still show clock even if font fails
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time
    .toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    })
    .replace(/\s/g, '');

  const styles = {
    container: {
      width: '100vw',
      height: '100dvh',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: '#000',
      gap: '20px',
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '104vw',
      height: '100dvh',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: '100% 100%',
      backgroundPosition: 'right center',
      filter: 'contrast(0.7) brightness(0.9)',
      zIndex: 0,
    },
    clockBase: {
      fontSize: '12vh',
      color: 'white',
      textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
      zIndex: 10,
      position: 'relative',
      fontFamily: `"${FONT_FAMILY}", sans-serif`,
    }
  };

  if (!fontLoaded) return null;

  return (
    <div style={styles.container}>
      <div style={styles.background} />

      <div style={{ 
        ...styles.clockBase, 
        writingMode: 'vertical-rl', 
        transform: 'rotate(180deg)'
      }}>
        {formattedTime}
      </div>

      <div style={{ 
        ...styles.clockBase, 
        writingMode: 'vertical-lr'
      }}>
        {formattedTime}
      </div>
    </div>
  );
};

export default DynamicClockComponent;
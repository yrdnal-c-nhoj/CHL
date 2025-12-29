import React, { useState, useEffect, useRef } from 'react';

// Vite assets import
import symJpg from './sym.jpg';

// Font configuration - using a known working font
const FONT_FAMILY = 'ClockFont';
const FONT_PATH = '/fonts/25-12-25-sym.ttf';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Try loading the font with a more reliable method
    const loadFont = async () => {
      try {
        // Method 1: Using @font-face in CSS first
        const style = document.createElement('style');
        style.textContent = `
          @font-face {
            font-family: '${FONT_FAMILY}';
            src: url('${FONT_PATH}') format('truetype');
            font-display: swap;
          }
        `;
        document.head.appendChild(style);
        
        // Verify the font is available
        await document.fonts.ready;
        
        // Force a repaint
        document.body.style.fontFamily = `'${FONT_FAMILY}', monospace`;
        
        setFontLoaded(true);
        console.log("Font loaded successfully:", FONT_FAMILY);
      } catch (err) {
        console.error("Font loading failed:", err);
        setFontLoaded(true); // Continue with fallback font
      }
    };
    
    loadFont();
    
    // Fallback in case the font doesn't load within 3 seconds
    const fallbackTimer = setTimeout(() => {
      if (!fontLoaded) {
        console.warn('Font loading timed out, using fallback font');
        setFontLoaded(true);
      }
    }, 3000);
    
    return () => clearTimeout(fallbackTimer);
  }, [fontLoaded]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  // Inline Style Objects to avoid leakage
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${symJpg})`,
    backgroundSize: '30px 15px',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontFamily: fontLoaded ? `'${FONT_FAMILY}', monospace` : 'monospace',
    margin: 0,
    padding: 0,
  };

  const Layer = ({ value, size, zIndex, opacity }) => {
    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: size,
        zIndex: zIndex,
        opacity: opacity,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        width: '100%',
        margin: 0,
        padding: 0,
        width: 'auto',
        lineHeight: 0.8, // Tighter line height
        letterSpacing: '-0.15em', // Even tighter letter spacing
        wordSpacing: '-0.5em', // Reduce space between words (if any)
        fontKerning: 'none',
        fontFeatureSettings: '"tnum" 1, "kern" 0', // Disable kerning and enable tabular numbers
      }}>
        {value}
      </div>
    );
  };


  return (
    <div style={containerStyle}>
      {/* Z-Index Layout:
          Seconds (Back/Largest) -> Minutes (Middle) -> Hours (Front/Smallest)
      */}
      
      {/* Seconds: 80% of screen height */}
      <Layer value={seconds} size="70vh" zIndex={1} opacity={0.7} />
      
      {/* Minutes: Half of seconds (40% of screen height) */}
      <Layer value={minutes} size="60vh" zIndex={2} opacity={0.8} />
      
      {/* Hours: Half of minutes (20% of screen height) */}
      <Layer value={hours} size="50vh" zIndex={3} opacity={1} />
    </div>
  );
};

export default DigitalClock;

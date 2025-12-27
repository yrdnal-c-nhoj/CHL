import React, { useState, useEffect, useRef } from 'react';

// Vite assets import
import symJpg from './sym.jpg';

// Import font using the same pattern as the reference file
const xxx251225 = '/fonts/25-12-25-sym.ttf'
const FONT_FAMILY = 'MyClockFont_20251225'
const fontUrl = new URL(xxx251225, import.meta.url).href

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Load custom font using the same pattern as the reference file
    const font = new FontFace(FONT_FAMILY, `url(${fontUrl})`)
    font.load().then(loaded => {
      document.fonts.add(loaded)
      setFontLoaded(true)
      console.log("Font loaded successfully:", FONT_FAMILY)
    }).catch(err => {
      console.error("Font loading failed:", err)
      setFontLoaded(true) // Continue anyway with fallback font
    })
  }, []);

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
    fontFamily: `"${FONT_FAMILY}", monospace`,
    margin: 0,
    padding: 0,
  };

  const Layer = ({ value, size, zIndex, opacity }) => {
    const leftPart = value.substring(0, 1);
    const rightPart = value.substring(1);
    
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
        margin: 0,
        padding: 0,
        width: 'auto',
        minWidth: size * 1.2 + 'px',
        lineHeight: 1
      }}>
        <div style={{ 
          display: 'inline-block',
          textAlign: 'right',
          width: '50%',
          margin: 0,
          padding: 0
        }}>{leftPart}</div>
        <div style={{ 
          display: 'inline-block',
          textAlign: 'left',
          width: '50%',
          margin: 0,
          padding: 0
        }}>{rightPart}</div>
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

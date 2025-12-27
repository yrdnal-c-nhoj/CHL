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
    position: 'relative',
    width: '100vw',
    height: '100dvh',
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
  };

  const Layer = ({ value, size, zIndex, opacity }) => (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-40%, -50%)',
      fontSize: size,
      zIndex: zIndex,
      opacity: opacity,
      pointerEvents: 'none',
      whiteSpace: 'nowrap'
    }}>
      {value}
    </div>
  );


  return (
    <div style={containerStyle}>
      {/* Z-Index Layout:
          Seconds (Back/Largest) -> Minutes (Middle) -> Hours (Front/Smallest)
      */}
      
      {/* Seconds: 80% of screen height */}
      <Layer value={seconds} size="80vh" zIndex={1} opacity={0.8} />
      
      {/* Minutes: Half of seconds (40% of screen height) */}
      <Layer value={minutes} size="60vh" zIndex={2} opacity={0.9} />
      
      {/* Hours: Half of minutes (20% of screen height) */}
      <Layer value={hours} size="40vh" zIndex={3} opacity={1} />
    </div>
  );
};

export default DigitalClock;

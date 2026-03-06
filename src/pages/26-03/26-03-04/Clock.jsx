import React, { useState, useEffect } from 'react';
import sunFont from '../../../assets/fonts/26-03-04-sun.ttf';
import sunBg from '../../../assets/images/26-03/26-03-04/sun-40.gif';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  const digitLetters = {
    '0': 'c', '1': 't', '2': 'N', '3': 'W', '4': 'V',
    '5': 'U', '6': 'D', '7': 'X', '8': 'J', '9': 'g',
  };

  useEffect(() => {
    // 1. Load Custom Font
    const fontFace = new FontFace('SunFont', `url(${sunFont})`);
    fontFace.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    }).catch(err => console.warn("Font load failed:", err));

    // 2. Timer Interval
    const timer = setInterval(() => setTime(new Date()), 1000);

    // 3. Resize Listener
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    // 4. Global Margin Reset (Prevents the "Left-Lean")
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Format: HHMMSS (6 digits)
  const digits = time.toTimeString().split(' ')[0].replace(/:/g, '').split('');

  // ────────────────────────────────────────────────
  // Layout Constants
  // ────────────────────────────────────────────────
  // On mobile, 45vw ensures 2 columns + borders fit within 100vw comfortably
  const boxWidth = isMobile ? '49vw' : '16vw';
  const boxHeight = isMobile ? '22vh' : '40vh';

  const containerStyle = {
    minHeight: '100dvh',
    width: '100vw',
    backgroundColor: '#EBDF55',
    backgroundImage: `url(${sunBg})`,
    backgroundSize: '180% 180%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  };

  const clockGridStyle = {
    display: 'grid',
    // 'auto' allows the grid to shrink-wrap the boxes, 'justifyContent' centers them
    gridTemplateColumns: isMobile ? `repeat(2, auto)` : `repeat(6, auto)`,
    // gap: isMobile ? '10px' : '0px', 
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  };

  const digitBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: boxWidth,
    height: boxHeight,
    // border: '4px solid #333',
    // This is the most important line for centering:
    boxSizing: 'border-box', 
    fontFamily: "'SunFont', monospace, sans-serif",
    fontSize: isMobile ? '20vh' : '15vw', 
    color: '#0723D4',
    lineHeight: 1,
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontVariantNumeric: 'tabular-nums',
    overflow: 'hidden', 
    whiteSpace: 'nowrap',
  };

  return (
    <div style={containerStyle}>
      <div style={clockGridStyle}>
        {digits.map((digit, index) => (
          <div key={index} style={digitBoxStyle}>
            {digitLetters[digit] || digit}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;
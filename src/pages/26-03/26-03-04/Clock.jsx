import React, { useState, useEffect } from 'react';
import sunFont from '../../../assets/fonts/26-03-04-sun.ttf';
import sunBg from '../../../assets/images/26-03/26-03-04/sun-40.gif';

console.log('Background image loaded:', sunBg);

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

  // Background layer with high saturation and brightness filter
  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#0C0B00',
    backgroundImage: `url(${sunBg})`,
    backgroundSize: '140% 140%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'saturate(2.7) brightness(3.5) contrast(0.4)',
    transform: 'rotate(180deg)',
    zIndex: -1,
  };

  const containerStyle = {
    minHeight: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    position: 'relative',
  };

  const clockGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? `repeat(2, auto)` : `repeat(6, auto)`,
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
    boxSizing: 'border-box', 
    fontFamily: "'SunFont', monospace, sans-serif",
    fontSize: isMobile ? '20vh' : '15vw', 
    color: '#051160',
    lineHeight: 1,
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontVariantNumeric: 'tabular-nums',
    overflow: 'hidden', 
    whiteSpace: 'nowrap',
    textShadow: '-1px 0 0 #ffffff', // 1px white shadow to one side
  };

  return (
    <>
      <div style={backgroundStyle} />
      <div style={containerStyle}>
        <div style={clockGridStyle}>
          {digits.map((digit, index) => (
            <div key={index} style={digitBoxStyle}>
              {digitLetters[digit] || digit}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Clock;
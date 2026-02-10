import React, { useEffect, useState, useMemo } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';

// Assets
import digitalFontUrl from '../../../assets/fonts/26-02-04-trans.ttf';
import digitalBgImage from '../../../assets/images/26-02-04/trans.webp';
import backgroundImage from '../../../assets/images/26-02-04/tran.jpg';

const CONFIG = {
  use24Hour: false,
};

const DigitalClockTemplate = () => {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Load Font
    const font = new FontFace('BorrowedDigital', `url(${digitalFontUrl})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontReady(true);
    }).catch(() => setFontReady(true));

    // 2. Device Detection
    const checkDevice = () => setIsMobile(window.innerWidth <= 768);
    checkDevice();
    window.addEventListener('resize', checkDevice);

    // 3. Clock Ticker
    const interval = setInterval(() => setTime(new Date()), 1000);

    // 4. Inject Styles (Keyframes & Body Visibility)
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes copper-shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      body { 
        font-family: 'BorrowedDigital', monospace; 
        visibility: visible; 
        margin: 0;
        background-color: #0a0a0a;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      window.removeEventListener('resize', checkDevice);
      clearInterval(interval);
      document.head.removeChild(styleSheet);
    };
  }, []);

  const { hh, mm } = useMemo(() => {
    const hours24 = time.getHours();
    const hours = CONFIG.use24Hour ? hours24 : hours24 % 12 || 12;
    const pad = (n) => String(n).padStart(2, '0');
    return {
      hh: pad(hours),
      mm: pad(time.getMinutes()),
    };
  }, [time]);

  // ────────────────────────────────────────────────
  //                STYLES
  // ────────────────────────────────────────────────

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    position: 'relative',
    opacity: fontReady ? 1 : 0,
    visibility: fontReady ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease',
  };
const bgBaseStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    backgroundSize: '100% 100%', // Forces the image to stretch to both edges
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  const timeRowStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '2dvh' : '2vw',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  };

const digitStyle = {
    fontSize: isMobile ? '35dvh' : '30vw',
    lineHeight: 1,
    fontFamily: fontReady ? "'BorrowedDigital', monospace" : 'monospace',
    fontVariantNumeric: 'tabular-nums',
    userSelect: 'none',
    
    // 1. The Gradient
    backgroundImage: 'linear-gradient(90deg, #b87333 0%, #f4a460 25%, #ecc591 50%, #f4a460 75%, #b87333 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'copper-shimmer 4s linear infinite',

    // 2. The Border (The Secret Sauce)
    WebkitTextStroke: '0.5vh #43B3AE',
    paintOrder: 'stroke fill', // Draws the stroke first so it doesn't get eaten by the gradient
    
    // 3. The Safety Net
    // If the stroke is still invisible, this filter will force a 1px "halo"
    filter: 'drop-shadow(0.5vh 0 0 #43B3AE) drop-shadow(-0.5vh 0 0 #43B3AE) drop-shadow(0 1px 0 #43B3AE) drop-shadow(0 -1px 0 #43B3AE)',
  };
  return (
    <div style={containerStyle}>
      <div style={{ ...bgBaseStyle, backgroundImage: `url(${backgroundImage})`, zIndex: 1 }} />
      <div style={{ ...bgBaseStyle, backgroundImage: `url(${digitalBgImage})`, zIndex: 2, filter: 'brightness(100%) saturate(10%)' }} />
      
      <div style={timeRowStyle}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={digitStyle}>{hh[0]}</span>
          <span style={digitStyle}>{hh[1]}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={digitStyle}>{mm[0]}</span>
          <span style={digitStyle}>{mm[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalClockTemplate;
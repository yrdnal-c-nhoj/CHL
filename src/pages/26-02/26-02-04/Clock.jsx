import React, { useEffect, useState, useMemo } from 'react';

// Assets
import digitalFontUrl from '../../../assets/fonts/26-02-04-trans.ttf';
import digitalBgImage from '../../../assets/clocks/26-02-04/trans.webp';
import backgroundImage from '../../../assets/clocks/26-02-04/tran.jpg';

const CONFIG = {
  use24Hour: false,
  showSeconds: true,
};

const DigitalClockTemplate = () => {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const font = new FontFace('BorrowedDigital', `url(${digitalFontUrl})`);

    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontReady(true);
      })
      .catch(() => {
        // Fall back silently if font fails to load
        setFontReady(true);
      });

    // Detect mobile vs laptop
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Prevent flash of unstyled text (FOIT)
  useEffect(() => {
    if (!fontReady) return;
    
    const style = document.createElement('style');
    style.textContent = `
      body {
        font-family: 'BorrowedDigital', monospace;
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [fontReady]);

  useEffect(() => {
    const tickRate = CONFIG.showSeconds ? 250 : 1000;
    const interval = setInterval(() => setTime(new Date()), tickRate);
    return () => clearInterval(interval);
  }, []);

  const { hh, mm, ss } = useMemo(() => {
    const hours24 = time.getHours();
    const hours = CONFIG.use24Hour ? hours24 : hours24 % 12 || 12;
    const pad = (n) => String(n).padStart(2, '0');
    return {
      hh: pad(hours),
      mm: pad(time.getMinutes()),
      ss: pad(time.getSeconds()),
    };
  }, [time]);

  // ────────────────────────────────────────────────
  //                  STYLES & ANIMATIONS
  // ────────────────────────────────────────────────

  // Injecting keyframes for the "Flashing/Shimmer" effect
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes copper-shimmer {
        0% { background-position: -200% center; opacity: 0.9; }
        50% { opacity: 1; }
        100% { background-position: 200% center; opacity: 0.9; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100dvh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    fontFamily: fontReady ? "'BorrowedDigital', monospace" : 'monospace',
    backgroundColor: '#0a0a0a', 
    position: 'relative',
  };

  const backgroundLayer1Style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    backgroundImage: `url(${digitalBgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    // opacity: 0.7,
      zIndex: 2,
    filter: 'brightness(100%) saturate(10%)',
  };

  const backgroundLayer2Style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    // opacity: 0.5,
    zIndex: 1,
  };

  const timeRowStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '1.5dvh' : '1.5vw', 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
      height: '100%',
      zIndex: 4,
  };

  const segmentStyle = {
    display: 'flex',
    gap: isMobile ? '2vw' : '1vw',
  };

  const digitBoxStyle = {
    width: isMobile ? '44vw' : '14vw',
    height: isMobile ? '28dvh' : '22vw',
    flex: '0 0 auto',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const innerDigitStyle = {
    position: 'relative',
    display: 'block',
    textAlign: 'center',
    width: '100%',
    fontSize: isMobile ? '26dvh' : '20vw', 
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    userSelect: 'none',
    transform: 'translateY(2%)',
    // METALLIC COPPER GRADIENT
    background: 'linear-gradient(90deg, #b87333 0%, #f4a460 25%, #ecc591 50%, #f4a460 75%, #b87333 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    // SHIMMER ANIMATION
    animation: 'copper-shimmer 4s linear infinite',
    // COPPER GLOW + 5PX VERDIGRIS BORDER AROUND CHARACTERS
    filter: 'drop-shadow(0 0 12px rgba(184, 115, 51, 0.5)), 5px 5px 0 #43B3AE, -5px 5px 0 #43B3AE, 5px -5px 0 #43B3AE, -5px -5px 0 #43B3AE',
  };

  return (
    <div style={containerStyle}>
      {/* Background Layer 1 - trans.webp */}
      <div style={backgroundLayer1Style} />
      
      {/* Background Layer 2 - tran.jpg */}
      <div style={backgroundLayer2Style} />
      
      {/* Clock Content */}
      <div style={timeRowStyle}>
        <div style={segmentStyle}>
          <div style={digitBoxStyle}><div style={innerDigitStyle}>{hh[0]}</div></div>
          <div style={digitBoxStyle}><div style={innerDigitStyle}>{hh[1]}</div></div>
        </div>
        <div style={segmentStyle}>
          <div style={digitBoxStyle}><div style={innerDigitStyle}>{mm[0]}</div></div>
          <div style={digitBoxStyle}><div style={innerDigitStyle}>{mm[1]}</div></div>
        </div>
        {CONFIG.showSeconds && (
          <div style={segmentStyle}>
            <div style={digitBoxStyle}><div style={innerDigitStyle}>{ss[0]}</div></div>
            <div style={digitBoxStyle}><div style={innerDigitStyle}>{ss[1]}</div></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalClockTemplate;
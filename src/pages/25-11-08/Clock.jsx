import React, { useEffect, useMemo, useState } from 'react';
import bgImageUrl_2025_11_10 from './eye.gif';
import digitFont_2025_11_10 from './eye.ttf';
// Import a new font for the timer
import timerFont from './eye2.ttf'; // Replace with your timer font file

export default function Clock({ imageWidth = '14vw', imageHeight = '11vw' }) {
  const [now, setNow] = useState(() => new Date());
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setNow(new Date());
      setElapsedMs(Date.now() - start);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const formatHMS = useMemo(() => {
    return (ms) => {
      const totalSeconds = Math.floor(ms / 1000);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = Math.floor(totalSeconds % 60);
      const msPart = Math.floor(ms % 1000);
      return `${h}:${m}:${s}.${msPart}`;
    };
  }, []);

  const pad2 = (n) => n.toString().padStart(2, '0');
  
  // Convert to 12-hour format and get AM/PM
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12 for 12 AM
  
  const clock = `${hours}:${pad2(now.getMinutes())} ${ampm}`;

  const digitsFontFamilyName = 'DigitsFont-2025-11-10';
  const timerFontFamilyName = 'TimerFont-2025-11-10';

  // Style for the clock in the upper right corner (subtle and small)
  const clockStyle = {
    position: 'absolute',
    top: '1vh',
    right: '2vw',
    color: '#666666',
    fontSize: 'min(4vw, 2.5vh)',
    fontFamily: `'${digitsFontFamilyName}', monospace`,
    fontWeight: 'normal',
    whiteSpace: 'nowrap',
    zIndex: 1,
    padding: '0.5vh 1vw',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '5px',
    opacity: 0.7,
    textAlign: 'center',
    transition: 'all 0.3s ease',
    ':hover': {
      opacity: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)'
    }
  };

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
  };

  const bgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
    backgroundColor: '#0a0a0a',
    overflow: 'hidden',
    opacity: 0.3, // Make background more subtle
  };

  const bgGridStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'grid',
    gridTemplateColumns: `repeat(30, ${imageWidth})`,
    gridAutoRows: `${imageHeight}`,
    marginLeft: `calc(-1 * ${imageWidth} / 2)`,
    marginTop: `calc(-1 * ${imageHeight} / 2)`,
  };

  const tileStyleBase = {
    width: `${imageWidth}`,
    height: `${imageHeight}`,
    backgroundImage: `url(${bgImageUrl_2025_11_10})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    willChange: 'transform',
  };

  const renderCheckerboardBG = () => {
    const tiles = [];
    const rows = 30;
    const cols = 30;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const flip = (r + c) % 2 === 1;
        tiles.push(
          <div
            key={`${r}-${c}`}
            style={{
              ...tileStyleBase,
              transform: flip ? 'scaleX(-1)' : 'none',
            }}
          />
        );
      }
    }
    return <div style={bgGridStyle}>{tiles}</div>;
  };

  const panelStyle = {
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '1.2vh',
    padding: '3vh 4vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2vh',
  };


  const digitsRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1vh',
  };

  const digitBoxStyle = {
    fontFamily: `'${digitsFontFamilyName}', sans-serif`,
    color: '#ffffff',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0.1vh',
    fontSize: '6.5vh',
    lineHeight: '7vh',
    width: '6vh',
    height: '8vh',
    borderRadius: '0.8vh',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const timerDigitBoxStyle = {
    ...digitBoxStyle,
    fontFamily: `'${timerFontFamilyName}', monospace`,
    fontSize: 'min(12vw, 15vh)',  // Slightly smaller on mobile
    lineHeight: '1',
    width: 'auto',
    minWidth: '0.4em',  // Slightly smaller min-width
    padding: '0 0.05em',  // Reduced padding
    color: '#ff0000',
    textShadow: '0 0 10px rgba(255, 0, 0, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
    margin: '0 0.03em',  // Reduced margin
    '@media (max-width: 600px)': {
      fontSize: '14vw',  // Larger on very small screens
      minWidth: '0.35em',
      margin: '0 0.02em',
    },
  };

  const colonBoxStyle = {
    ...digitBoxStyle,
    width: '2.6vh',
    fontSize: '6vh',
  };

  const timerColonBoxStyle = {
    ...timerDigitBoxStyle,
    width: '0.3em',
    minWidth: '0.3em',
    padding: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: '#ff0000',
    textShadow: '0 0 10px rgba(255, 0, 0, 0.7)',
    '@media (max-width: 600px)': {
      width: '0.25em',
      minWidth: '0.25em',
    },
  };

  const dotBoxStyle = {
    ...digitBoxStyle,
    width: '2.6vh',
    fontSize: '6vh',
  };

  const timerDotBoxStyle = {
    ...timerDigitBoxStyle,
    width: '0.4em',
    minWidth: '0.4em',
    padding: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: '#ff0000',
    textShadow: '0 0 15px rgba(255, 0, 0, 0.7)'
  };

  const renderBoxed = (text) => (
    <span style={digitsRowStyle}>
      {text.split('').map((ch, i) => (
        <span key={i} style={ch === ':' ? colonBoxStyle : digitBoxStyle}>
          {ch}
        </span>
      ))}
    </span>
  );

  const renderTimerBoxed = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    const msPart = Math.floor(ms % 1000);
    
    // Always show hours with leading zero if needed
    const hStr = h > 0 ? h.toString().padStart(2, '0') : '';
    const mStr = m.toString().padStart(2, '0');
    const sStr = s.toString().padStart(2, '0');
    const msStr = msPart.toString().padStart(3, '0');
    
    const parts = [];
    
    // Add hours if they exist
    if (h > 0) {
      hStr.split('').forEach(d => {
        parts.push({ ch: d, type: 'digit', visible: true });
      });
      parts.push({ ch: ':', type: 'colon', visible: true });
    }
    
    // Add minutes (always show with leading zero)
    mStr.split('').forEach(d => {
      parts.push({ ch: d, type: 'digit', visible: true });
    });
    
    // Add colon between minutes and seconds
    parts.push({ ch: ':', type: 'colon', visible: true });
    
    // Add seconds (always show with leading zero)
    sStr.split('').forEach(d => {
      parts.push({ ch: d, type: 'digit', visible: true });
    });
    
    // Add decimal point and milliseconds
    parts.push({ ch: '.', type: 'dot', visible: true });
    
    // Add milliseconds (always show with leading zeros)
    msStr.split('').forEach(d => {
      parts.push({ ch: d, type: 'digit', visible: true });
    });
    
    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        maxWidth: '95vw',  // Prevent overflow on small screens
        padding: '3vh 4vw',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '15px',
        border: '2px solid rgba(255, 0, 0, 0.3)',
        boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)',
        '@media (max-width: 600px)': {
          padding: '2vh 3vw',
          borderRadius: '12px',
        },
      }}>
        {parts.map((p, i) => (
          <span
            key={i}
            style={{
              ...(p.type === 'colon' ? timerColonBoxStyle : 
                  p.type === 'dot' ? timerDotBoxStyle : timerDigitBoxStyle),
              opacity: p.visible ? 1 : 0,
            }}
          >
            {p.ch}
          </span>
        ))}
      </div>
    );
  };


  return (
    <div style={wrapperStyle}>
      <style>
        {`
          @font-face {
            font-family: '${digitsFontFamilyName}';
            src: url(${digitFont_2025_11_10}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: '${timerFontFamilyName}';
            src: url(${timerFont}) format('woff2');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}
      </style>
      <div style={bgStyle}>
        {renderCheckerboardBG()}
      </div>
      <div style={clockStyle}>
        {clock}
      </div>
      {renderTimerBoxed(elapsedMs)}
    </div>
  );
}
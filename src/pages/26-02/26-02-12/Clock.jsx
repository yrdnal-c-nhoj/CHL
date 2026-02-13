import React, { useEffect, useState, useMemo } from 'react';
import { useFontLoader } from "../../../utils/fontLoader";

// Asset Imports (keeping your existing imports)
import digitalFontUrl from '../../../assets/fonts/26-02-12-disco.otf';
import digitalBgImage from '../../../assets/images/26-02-12/lit.webp';
import extraBg1 from '../../../assets/images/26-02-12/light.webp';
import extraBg2 from '../../../assets/images/26-02-12/li.gif';
import extraBg3 from '../../../assets/images/26-02-12/ball.webp';

const DISCO_COLORS = [
  '#FF00FF', // Neon Magenta
  '#00FFFF', // Cyan
  '#FFFB00', // Neon Yellow
  '#FF3131', // Neon Red
  '#39FF14', // Neon Green
  '#8A2BE2', // Blue Violet
  '#FF5E00', // Neon Orange
];

const CONFIG = {
  use24Hour: false,
  showSeconds: true,
};

const DigitalClockTemplate = () => {
  const [time, setTime] = useState(new Date());
  const fontReady = useFontLoader('BorrowedDigital', digitalFontUrl);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(interval);
  }, []);

  const { digits, rawSeconds } = useMemo(() => {
    const hours24 = time.getHours();
    const hours = CONFIG.use24Hour ? hours24 : hours24 % 12 || 12;
    const pad = (n) => String(n).padStart(2, '0');
    
    const hh = pad(hours);
    const mm = pad(time.getMinutes());
    const ss = pad(time.getSeconds());
    
    // Combine all digits into one array for easier mapping
    return {
      digits: (hh + mm + (CONFIG.showSeconds ? ss : '')).split(''),
      rawSeconds: time.getSeconds()
    };
  }, [time]);

  // Logic to shift color per digit per second
  const getDiscoColor = (index) => {
    const colorIndex = (rawSeconds + index) % DISCO_COLORS.length;
    return DISCO_COLORS[colorIndex];
  };

  const layerBase = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    pointerEvents: 'none',
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden', backgroundColor: '#000' }}>
      
      {/* Background Layers */}
      <div style={{ ...layerBase, backgroundImage: `url(${digitalBgImage})`, opacity: 1.0, filter: 'saturate(3.8) brightness(1.5)', zIndex: 1 }} />
      <div style={{ ...layerBase, backgroundImage: `url(${extraBg1})`, opacity: 0.6, filter: 'saturate(3.8) contrast(1.5) brightness(1.5)', mixBlendMode: 'overlay', zIndex: 2 }} />
      <div style={{ ...layerBase, backgroundImage: `url(${extraBg2})`, opacity: 0.3, filter: 'saturate(3.8) contrast(1.5) brightness(1.5)', zIndex: 3 }} />
      <div style={{ ...layerBase, backgroundImage: `url(${extraBg3})`, opacity: 0.3, filter: 'saturate(1.8) contrast(1.5) brightness(2.5)', zIndex: 4 }} />

      {/* Clock UI */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontFamily: fontReady ? "'BorrowedDigital', sans-serif" : 'sans-serif',
      }}>
        <div style={clockWrapperStyle}>
          {digits.map((digit, i) => (
            <span 
              key={i} 
              style={{
                ...digitBoxStyle,
                color: getDiscoColor(i),
                // textShadow: `0 0 15px ${getDiscoColor(i)}`,
                // transition: 'color 0.1s ease', // Optional: makes the color swap feel punchier
              }}
            >
              {digit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const clockWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem',
};

const digitBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '0.8em', // Tight width since there are no spacers
  height: '1.1em',
  fontSize: 'clamp(4rem, 16vw, 10rem)',
  textAlign: 'center',
};

export default DigitalClockTemplate;
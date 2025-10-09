import React, { useState, useEffect } from 'react';

// === Local assets ===
import bgWebp from './roma.webp'; // background
import font_20251007 from './roma.ttf'; // custom font

export default function ProcessingCounterClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // === Load font ===
  useEffect(() => {
    const font = new FontFace('ProcessingFont', `url(${font_20251007})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontLoaded(true);
    });
  }, []);

  // === Update time ===
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  // === Handle resize ===
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // === Format time ===
  const hours24 = time.getHours();
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const pad = (n) => String(n).padStart(2, '0');
  const hh = pad(hours12);
  const mm = pad(time.getMinutes());
  const ss = pad(time.getSeconds());
  const displayChars = [...hh, ...mm, ...ss, ...ampm];

  const columns = isMobile ? 2 : displayChars.length;
  const rows = isMobile ? Math.ceil(displayChars.length / 2) : 1;

  // === Dynamic font sizing ===
  const baseSize = isMobile ? 100 / rows : 100 / columns;
  const fontSize = isMobile ? `${baseSize}vh` : `${baseSize}vw`;

  // === Styles ===
  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    backgroundColor: '#000',
  };

  const bgStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(1.2) contrast(1.3) saturate(1.1)',
    zIndex: 0,
  };

  // === Text container (applies inversion only to text) ===
  const gridStyle = {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    margin: 0,
    padding: 0,
    gap: 0,
    zIndex: 1,
    mixBlendMode: 'difference', // << text only inverts underlying image
  };

  const digitBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: fontLoaded ? 'ProcessingFont, monospace' : 'monospace',
    fontSize,
    color: 'white', // color for inversion blend
    lineHeight: 1,
    userSelect: 'none',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  };

  return (
    <div style={containerStyle}>
      {/* Background stays normal */}
      <img src={bgWebp} alt="background" style={bgStyle} />

      {/* Digits invert the background behind them */}
      <div style={gridStyle}>
        {displayChars.map((char, i) => (
          <div key={i} style={digitBoxStyle}>
            {char}
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

// === Local assets ===
import bgWebp from './roma.webp'; // fallback background image
import bgVideo from './rom.mp4'; // background video
import font_20251007 from './roma.ttf'; // custom font

export default function ProcessingCounterClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
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
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#000',
    margin: 0,
    padding: 0,
  };

  const bgMediaStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(1.2) contrast(1.3) saturate(1.1)',
    zIndex: 0,
  };

  const gridStyle = {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    zIndex: 1,
    mixBlendMode: 'difference',
  };

  const digitBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: fontLoaded ? 'ProcessingFont, monospace' : 'monospace',
    fontSize,
    color: 'white',
    lineHeight: 1,
    userSelect: 'none',
  };

  return (
    <div style={containerStyle}>
      {/* Try to play the video first; fallback to image if it fails */}
      {!videoFailed ? (
        <video
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
          style={bgMediaStyle}
        />
      ) : (
        <img src={bgWebp} alt="background" style={bgMediaStyle} />
      )}

      {/* Inverting text grid */}
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

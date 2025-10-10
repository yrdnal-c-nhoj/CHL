import React, { useState, useEffect } from 'react';

// === Local assets ===
import bgWebp from './roma.webp';
import bgVideo from './rom.mp4';
import font_20251007 from './roma.ttf';

export default function ProcessingCounterClock() {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // === Load font safely (no FOUT) ===
  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace('ProcessingFont', `url(${font_20251007})`);
        await font.load();
        document.fonts.add(font);
        await document.fonts.ready;
        setFontReady(true);
      } catch {
        setFontReady(true);
      }
    };
    loadFont();
  }, []);

  // === Keep viewport height updated ===
  useEffect(() => {
    const updateVH = () => setViewportHeight(window.innerHeight);
    updateVH();
    window.addEventListener('resize', updateVH);
    window.addEventListener('orientationchange', updateVH);
    return () => {
      window.removeEventListener('resize', updateVH);
      window.removeEventListener('orientationchange', updateVH);
    };
  }, []);

  // === Time update ===
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  // === Handle mobile detection ===
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // === Time formatting ===
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
  const baseSize = isMobile ? 100 / rows : 100 / columns;
  const fontSize = isMobile ? `${baseSize}vh` : `${baseSize}vw`;

  // === Styles ===
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: `${viewportHeight}px`, // dynamically locked
    overflow: 'hidden',
    backgroundColor: '#000',
    margin: 0,
    padding: 0,
    zIndex: 0,
  };

  const bgMediaStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(1.2) contrast(1.3) saturate(1.1)',
    transition: 'opacity 1s ease-in-out',
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
    opacity: fontReady ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out',
  };

  const digitBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: fontReady ? 'ProcessingFont, monospace' : 'monospace',
    fontSize,
    color: 'white',
    lineHeight: 1,
    userSelect: 'none',
  };

  return (
    <div style={containerStyle}>
      {/* Background Video */}
      {!videoFailed && (
        <video
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
          style={{
            ...bgMediaStyle,
            opacity: videoReady ? 1 : 0,
          }}
        />
      )}

      {/* Fallback Image */}
      {(!videoReady || videoFailed) && (
        <img
          src={bgWebp}
          alt="background"
          style={{
            ...bgMediaStyle,
            opacity: videoReady ? 0 : 1,
          }}
        />
      )}

      {/* Clock Grid */}
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

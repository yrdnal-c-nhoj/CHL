import React, { useState, useEffect, useRef } from 'react';

// === Local assets (replace with your actual paths or hosted URLs in production) ===
import bgWebp from './roma.webp'; // fallback image
import bgVideo from './rom.mp4'; // background video
import font_20251007 from './roma.ttf'; // custom font

export default function ProcessingCounterClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const videoRef = useRef(null);

  // === Load custom font ===
  useEffect(() => {
    const font = new FontFace('ProcessingFont', `url(${font_20251007})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontLoaded(true);
    }).catch(() => setFontLoaded(true)); // Fallback on error
  }, []);

  // === Update time every 100 ms ===
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  // === Handle resize for mobile detection ===
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // === Explicitly handle video play for mobile compatibility ===
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoReady(true))
          .catch((error) => {
            console.warn('Auto-play failed:', error);
            setVideoFailed(true);
          });
      }
    }
  }, [videoFailed]);

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
  const fontSize = isMobile ? `${baseSize}dvh` : `${baseSize}vw`;

  // === Inline styles (no external CSS to prevent FOUC) ===
  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#000',
    margin: 0,
    padding: 0,
    fontFamily: fontLoaded ? 'ProcessingFont, monospace' : 'monospace', // Pre-apply font to body via JS if needed, but inline here minimizes flash
  };

  const bgMediaStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(1.2) contrast(1.3) saturate(1.1)',
    transition: 'opacity 1.2s ease-in-out',
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
    fontFamily: 'inherit',
    fontSize,
    color: 'white',
    lineHeight: 1,
    userSelect: 'none',
  };

  // To further prevent FOUC, apply base styles to document in useEffect
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = '#000';
    document.body.style.fontFamily = fontLoaded ? 'ProcessingFont, monospace' : 'monospace';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
  }, [fontLoaded]);

  return (
    <div style={containerStyle}>
      {/* === Video background with fallback === */}
      {!videoFailed && (
        <video
          ref={videoRef}
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
          onLoadedData={() => {
            if (videoRef.current) videoRef.current.play().catch(() => setVideoFailed(true));
          }}
          style={{
            ...bgMediaStyle,
            opacity: videoReady ? 1 : 0,
          }}
        />
      )}

      {/* === Fallback image === */}
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

      {/* === Text grid overlay === */}
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
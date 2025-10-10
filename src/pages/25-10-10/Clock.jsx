import React, { useState, useEffect, useRef } from 'react';

// === Local assets ===
import bgWebp from './roma.webp'; // fallback image
import bgVideo from './ro.mp4'; // background video
import font_20251007 from './roma.ttf'; // custom font

export default function ProcessingCounterClock() {
  const [time, setTime] = useState(new Date());
  const [ready, setReady] = useState(false); // unified readiness (font + render)
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const videoRef = useRef(null);

  // === Preload font early ===
  useEffect(() => {
    const font = new FontFace('ProcessingFont', `url(${font_20251007})`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        // Apply immediately to body/html
        document.body.style.fontFamily = 'ProcessingFont, monospace';
        setReady(true);
      })
      .catch(() => setReady(true)); // Fallback still renders text
  }, []);

  // === Time update ===
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  // === Mobile detection ===
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // === Video control ===
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoReady(true))
          .catch(() => setVideoFailed(true));
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

  // === Styles ===
  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#000',
    margin: 0,
    padding: 0,
    opacity: ready ? 1 : 0, // <-- hide until font ready
    transition: 'opacity 0.5s ease',
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
    fontFamily: 'ProcessingFont, monospace',
    fontSize,
    color: 'white',
    lineHeight: 1,
    userSelect: 'none',
  };

  // === Prevent flash via base styles ===
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.backgroundColor = '#000';
  }, []);

  return (
    <div style={containerStyle}>
      {/* === Video background === */}
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

      {/* === Clock characters === */}
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

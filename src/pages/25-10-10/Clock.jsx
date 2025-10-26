import React, { useState, useEffect, useRef } from 'react';

// === Local assets ===
import bgWebp from './roma.webp';
import bgVideo from './ro.mp4';
import font_20251007 from './roma.ttf';

export default function ProcessingCounterClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [visible, setVisible] = useState(true); // controls fade-in
  const videoRef = useRef(null);

  // === Font preload ===
  useEffect(() => {
    const font = new FontFace('ProcessingFontScoped', `url(${font_20251007})`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontLoaded(true);
      })
      .catch(() => setFontLoaded(true));
  }, []);

  // === Time update ===
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(t);
  }, []);

  // === Mobile resize watcher ===
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // === Video playback handling ===
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setVideoReady(true))
        .catch(() => setVideoFailed(true));
    }
  }, [videoFailed]);

  // === Clock fade-back-in loop after 22s ===
  useEffect(() => {
    let fadeTimeout;

    const loopFadeIn = () => {
      fadeTimeout = setTimeout(() => {
        setVisible(false); // briefly hide to trigger fade-in
        setTimeout(() => {
          setVisible(true); // fade back in
          loopFadeIn(); // repeat endlessly
        }, 100); // small pause
      }, 22000); // wait 22s
    };

    loopFadeIn();
    return () => clearTimeout(fadeTimeout);
  }, []);

  // === Clock formatting ===
  const hours24 = time.getHours();
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const pad = (n) => String(n).padStart(2, '0');
  const displayChars = [
    ...pad(hours12),
    ...pad(time.getMinutes()),
    ...pad(time.getSeconds()),
    ...ampm,
  ];

  const columns = isMobile ? 2 : displayChars.length;
  const rows = isMobile ? Math.ceil(displayChars.length / 2) : 1;
  const baseSize = isMobile ? 100 / rows : 100 / columns;
  const fontSize = isMobile ? `${baseSize}dvh` : `${baseSize}vw`;

  // === Styles ===
  const ns = 'processing-clock';

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#000',
    margin: 0,
    padding: 0,
    opacity: fontLoaded && visible ? 1 : 0,
    transition: 'opacity 1s ease',
  };

  const bgMediaStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(1.2) contrast(1.3) saturate(1.1)',
    zIndex: 0,
    transition: 'opacity 1s ease',
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
    fontFamily: 'ProcessingFontScoped, monospace',
    fontSize,
    color: 'white',
    lineHeight: 1,
    userSelect: 'none',
  };

  return (
    <div className={ns} style={containerStyle}>
      {/* Scoped @font-face */}
      <style>{`
        @font-face {
          font-family: 'ProcessingFontScoped';
          src: url(${font_20251007}) format('truetype');
          font-display: swap;
        }
        .${ns} * {
          box-sizing: border-box;
        }
      `}</style>

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

      {/* === Clock display === */}
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

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';
// Asset imports
import backgroundUrl from '../../../assets/images/26-01-22/1974.jpg';
import digitTextureUrl from '../../../assets/images/26-01-22/liq.webp';
import fontUrl from '../../../assets/fonts/26-01-22-1974.ttf';

const FONT_FAMILY = '1974';

const DynamicClock = () => {
  const [isReady, setIsReady] = useState(false);
  const [time, setTime] = useState(new Date());
  const [bgReady, setBgReady] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load font + background image
  useLayoutEffect(() => {
    let mounted = true;

    const loadAssets = async () => {
      const fontFace = new FontFace(FONT_FAMILY, `url(${fontUrl})`);
      document.fonts.add(fontFace);

      try {
        await Promise.all([
          fontFace.load(),
          new Promise((resolve) => {
            const img = new Image();
            img.src = backgroundUrl;
            img.onload = resolve;
            img.onerror = resolve;
          }),
        ]);
        if (mounted) setIsReady(true);
      } catch (err) {
        console.error('Asset loading failed:', err);
        if (mounted) setIsReady(true);
      }
    };

    loadAssets();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const img = new Image();
    const done = () => setBgReady(true);
    img.onload = done;
    img.onerror = done;
    img.src = backgroundUrl;
    const timeout = setTimeout(done, 1200);
    return () => clearTimeout(timeout);
  }, []);

  if (!isReady || !bgReady) return null;

  const timeString = [
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
  ].map((n) => n.toString().padStart(2, '0')).join('');

  // ────────────────────────────────────────────────
  // Styles
  // ────────────────────────────────────────────────

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'contrast(0.7) brightness(1.15)',
    fontFamily: `'${FONT_FAMILY}', sans-serif`,
  };

  const digitsRowStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'clamp(1.0vw, 2vw, 4vw)',   // space between boxes
    padding: '0 2vw',
    width: '100%',
    maxWidth: '99vw',
    marginTop: '-65vh',
  };

  const digitBoxStyle = {
    width: 'clamp(22vw, 22vw, 222px)',     // fixed width — biggest factor in preventing jump
    height: 'clamp(29vw, 29vw, 340px)',    // fixed height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',     
    overflow: 'hidden',                    // keeps content insideoptional depth
  };

  const digitStyle = {
    fontSize: 'clamp(20vw, 26vw, 260px)',  // large enough to mostly fill the box
    // fontWeight: 'bold',
    lineHeight: '1',
    backgroundImage: `url(${digitTextureUrl})`,
    backgroundSize: '180% 180%',
    backgroundPosition: 'center',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    filter: 'contrast(2.2) brightness(1.1)',
    // WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.5)',
    userSelect: 'none',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={digitsRowStyle}>
        {timeString.split('').map((char, i) => (
          <div key={i} style={digitBoxStyle}>
            <div style={digitStyle}>
              {char}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicClock;
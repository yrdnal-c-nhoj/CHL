import React, { useEffect, useState, useMemo } from 'react';
import bgImg from '../../../../assets/images/2025/25-11/25-11-19/apple.webp';
import tileImg from '../../../../assets/images/2025/25-11/25-11-19/ap.webp';
import overlayImg from '../../../../assets/images/2025/25-11/25-11-19/app.webp';
import customFontUrl from '../../../../assets/fonts/2025/25-11-19-apple.ttf?url';

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // 1. Manage Font Loading
  useEffect(() => {
    const font = new FontFace('CustomClockFont', `url(${customFontUrl})`);
    
    font.load().then(() => {
      document.fonts.add(font);
      setFontLoaded(true);
    }).catch(() => {
      setFontLoaded(true); // Fallback
    });
  }, []);

  // 2. Manage Clock Timer
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Format Time
  const displayTime = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    return `${h}${m}`;
  }, [time]);

  return (
    <div style={styles.container}>
      {/* Background Layers */}
      <div style={styles.overlayBg} />
      <div style={styles.tiledBg} />
      <div style={styles.mainBg} />
      
      {/* Clock Face */}
      <div style={{ 
        ...styles.clock, 
        opacity: fontLoaded ? 1 : 0,
        fontFamily: fontLoaded ? 'CustomClockFont, sans-serif' : 'sans-serif'
      }}>
        {displayTime}
      </div>
    </div>
  );
}

// 4. Styles moved outside component to prevent object re-creation on every tick
const styles = {
  container: {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  mainBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${bgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    // opacity: 0.9,
    filter: 'brightness(1.2) contrast(0.9) saturate(1.9) hue-rotate(-10deg)',
    zIndex: 4,
  },
  tiledBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${tileImg})`,
    backgroundRepeat: 'repeat',
    backgroundSize: '10vh 10vh',
    // opacity: 0.6,
    filter: 'brightness(1.1) contrast(1.2) saturate(1.5)',
    zIndex: 2,
  },
  overlayBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${overlayImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.6,
    filter: 'brightness(1.5) contrast(1.8) saturate(1.0)',
    zIndex: 3,
  },
  clock: {
    position: 'relative',
    zIndex: 10,
    fontSize: '15vh', // Responsive font size
    color: '#E1F3DD',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    transition: 'opacity 300ms ease-in-out',
  },
};
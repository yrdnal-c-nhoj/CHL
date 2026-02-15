import React, { useEffect, useState, useMemo } from 'react';

// --- Assets ---
import bellImage2 from '../../../assets/images/26-02-11/bell.webp';
import bellImage1 from '../../../assets/images/26-02-11/bell.gif';

// --- Configuration ---
const CLOCK_CONFIG = {
  NUMERAL_RADIUS: 40,
  COLORS: {
    silverText:
      'linear-gradient(180deg, #24058B 0%, #000000 45%, #232222 50%, #062D79 100%)',
    hourHand: 'linear-gradient(to right, #4E4D4D, #282727, #4D4949)',
    minuteHand: 'linear-gradient(to right, #3B3939, #383636, #484444)',
    secondHand: 'linear-gradient(to top, #4B4C4F, #4F4F52)',
  },
};

// --- Hook: Load Google Font Safely ---
const useGoogleFont = () => {
  const [fontReady, setFontReady] = useState(false);
  
  useEffect(() => {
    const id = 'gilda-display-font';
    if (document.getElementById(id)) return;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Gilda+Display&display=swap';

    document.head.appendChild(link);
    
    // Check when font is ready
    document.fonts.load('1em "Gilda Display"').then(() => {
      setFontReady(true);
    }).catch(() => setFontReady(true)); // Fallback
  }, []);
  
  return fontReady;
};

// --- Hook: Smooth Time Engine ---
const useBellClock = (intervalMs = 50) => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);

  return time;
};

const AnalogClock = () => {
  const fontReady = useGoogleFont();
  const now = useBellClock(50);

  // Smooth time calculations
  const msec = now.getMilliseconds();
  const sec = now.getSeconds() + msec / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr = (now.getHours() % 12) + min / 60;

  // Memoized numerals
  const numerals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const angleRad = (num / 12) * 2 * Math.PI;
      const angleDeg = (num / 12) * 360;

      const x = 50 + CLOCK_CONFIG.NUMERAL_RADIUS * Math.sin(angleRad);
      const y = 50 - CLOCK_CONFIG.NUMERAL_RADIUS * Math.cos(angleRad);

      return (
        <div
          key={num}
          style={{
            ...styles.numeralBase,
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
          }}
        >
          {num}
        </div>
      );
    });
  }, []);

  return (
    <div style={{
      ...styles.container,
      opacity: fontReady ? 1 : 0,
      visibility: fontReady ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease',
    }}>
      {/* Tiled Background */}
      <div
        style={{
          ...styles.backgroundLayer,
          backgroundImage: `url(${bellImage1})`,
        }}
      />

      {/* Overlay Bell Image */}
      <div style={styles.additionalBackgroundLayer} />

      {/* Clock Face */}
      <div style={styles.face}>
        {numerals}

        {/* Hour Hand */}
        <div
          style={{
            ...styles.hand,
            ...styles.hourHand,
            transform: `translate(-50%, 0) rotate(${hr * 30}deg)`,
          }}
        />

        {/* Minute Hand */}
        <div
          style={{
            ...styles.hand,
            ...styles.minHand,
            transform: `translate(-50%, 0) rotate(${min * 6}deg)`,
          }}
        />

        {/* Second Hand */}
        <div
          style={{
            ...styles.hand,
            ...styles.secHand,
            transform: `translate(-50%, 0) rotate(${sec * 6}deg)`,
          }}
        />

        <div style={styles.centerDot} />
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#BFA7A7',
  },

  backgroundLayer: {
    position: 'absolute',
    inset: 0,
    backgroundSize: '200px auto',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    filter: 'saturate(10%) contrast(0.4) brightness(1.6)',
    zIndex: 2,
    opacity: 0.5,
  },

  additionalBackgroundLayer: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(${bellImage2})`,
    filter:
      'saturate(520%) hue-rotate(-120deg) contrast(0.4) brightness(1.6)',
    zIndex: 1,
  },

  face: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vmin',
    height: '100vmin',
    zIndex: 7,
    fontFamily: "'Gilda Display', serif",
  },

numeralBase: {
    position: 'absolute',
    fontSize: 'clamp(4rem, 10vw, 19rem)',
    background: CLOCK_CONFIG.COLORS.silverText,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(1px 1px 0px white)', 
    userSelect: 'none',
  },

  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: '50% 100%',

    filter: 'drop-shadow(1px 1px 0px white)', 
    borderRadius: '10px',
    willChange: 'transform',
  },

  hourHand: {
    width: '1.2vmin',
    height: '20vmin',
    background: CLOCK_CONFIG.COLORS.hourHand,
    zIndex: 3,
  },

  minHand: {
    width: '0.8vmin',
    height: '32vmin',
    background: CLOCK_CONFIG.COLORS.minuteHand,
    zIndex: 4,
  },

  secHand: {
    width: '0.4vmin',
    height: '38vmin',
    background: CLOCK_CONFIG.COLORS.secondHand,
    zIndex: 5,
  },

  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '2vmin',
    height: '2vmin',
    background: '#565856',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
  },
};

export default AnalogClock;

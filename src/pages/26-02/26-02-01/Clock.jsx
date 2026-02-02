import React, { useEffect, useState, useMemo } from 'react';

// --- Assets ---
import analogRainFont from '../../../assets/fonts/26-01-31-cond.ttf?url';
import analogBgImage from '../../../assets/clocks/26-01-31/rain.webp';

// --- Configuration ---
const CLOCK_CONFIG = {
  NUMERAL_RADIUS: 40,
  COLORS: {
    // Multi-stop gradient for a "Chrome/Silver" look
    silverText: 'linear-gradient(180deg, #FFFFFF 0%, #C0C0C0 45%, #C5C1C1 50%, #D3D8F3 100%)',
    centerDot: '#FFFFFF90',
    // Metallic hands using gradients for depth
    hourHand: 'linear-gradient(to right, #959595, #ffffff, #959595)',
    minuteHand: 'linear-gradient(to right, #B0B0B0, #ffffff, #B0B0B0)',
    secondHand: 'linear-gradient(to top, #FF4B2B, #FF416C)', // Keeping the "pop" of red/orange
  }
};

/**
 * Custom Hook: useClock
 * Manages high-precision time updates
 */
const useClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let frameId;
    const update = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return time;
};

const AnalogClock = () => {
  const now = useClock();
  const [fontReady, setFontReady] = useState(false);

  // Load Custom Font
  useEffect(() => {
    const font = new FontFace('BorrowedAnalog', `url(${analogRainFont})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
      setFontReady(true);
    }).catch(() => setFontReady(true));
  }, []);

  // Time Calculations
  const msec = now.getMilliseconds();
  const sec = now.getSeconds() + msec / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr = (now.getHours() % 12) + min / 60;

  // Memoized Numerals (Silver Styled)
  const renderedNumerals = useMemo(() => {
    const numbersToShow = [12, 3, 6, 9];
    return numbersToShow.map((num) => {
      const angle = (num / 12) * 2 * Math.PI;
      const x = 50 + CLOCK_CONFIG.NUMERAL_RADIUS * Math.sin(angle);
      const y = 50 - CLOCK_CONFIG.NUMERAL_RADIUS * Math.cos(angle);

      return (
        <div
          key={num}
          style={{
            ...styles.numeralBase,
            left: `${x}%`,
            top: `${y}%`,
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
      backgroundImage: `url(${analogBgImage})`, 
      fontFamily: fontReady ? "'BorrowedAnalog', sans-serif" : 'sans-serif' 
    }}>
      <div style={styles.backgroundFilter} />
      
      <div style={styles.face}>
        {renderedNumerals}
        
        {/* Hour Hand */}
        <div style={{ 
          ...styles.hand, 
          ...styles.hourHand, 
          transform: `translate(-50%, 0) rotate(${hr * 30}deg)` 
        }} />
        
        {/* Minute Hand */}
        <div style={{ 
          ...styles.hand, 
          ...styles.minHand, 
          transform: `translate(-50%, 0) rotate(${min * 6}deg)` 
        }} />
        
        {/* Second Hand */}
        <div style={{ 
          ...styles.hand, 
          ...styles.secHand, 
          transform: `translate(-50%, 0) rotate(${sec * 6}deg)` 
        }} />
        
        {/* Center Cap */}
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
    backgroundColor: '#050505',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  backgroundFilter: {
    position: 'absolute',
    inset: 0,
    filter: 'saturate(150%) hue-rotate(20deg) brightness(0.6)',
    pointerEvents: 'none',
  },
  face: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vmin',
    height: '100vmin',
  },
  numeralBase: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    fontSize: 'clamp(7rem, 18vw, 9rem)',
    // fontWeight: '900',
    // Metallic Silver Effect
    background: CLOCK_CONFIG.COLORS.silverText,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0px 1px 0px rgba(0,0,0,0.8))',
    opacity: 0.4,
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: '50% 100%',
    borderRadius: '10px',
    willChange: 'transform',
  },
  hourHand: {
    width: '1.2vmin',
    height: '24vmin',
    background: CLOCK_CONFIG.COLORS.hourHand,
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  minHand: {
    width: '0.8vmin',
    height: '32vmin',
    background: CLOCK_CONFIG.COLORS.minuteHand,
    boxShadow: '0 0 8px rgba(0,0,0,0.4)',
    zIndex: 3,
  },
  secHand: {
    width: '0.4vmin',
    height: '38vmin',
    background: CLOCK_CONFIG.COLORS.secondHand,
    boxShadow: '0 0 12px rgba(255, 65, 108, 0.4)',
    zIndex: 4,
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '3vmin',
    height: '3vmin',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    background: CLOCK_CONFIG.COLORS.centerDot,
    boxShadow: '0 4px 10px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.5)',
    zIndex: 5,
  }
};

export default AnalogClock;
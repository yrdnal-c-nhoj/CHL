import React, { useEffect, useState, useMemo, useRef } from 'react';

// --- Assets ---
import analogRainFont from '../../../assets/fonts/26-01-31-cond.ttf?url';
import analogBgImage from '../../../assets/clocks/26-01-31/rain.webp';

// --- Configuration ---
const CLOCK_CONFIG = {
  NUMERAL_RADIUS: 40, // Percentage from center
  UPDATE_FREQUENCY: 16, // ~60fps (or use RAF hook below)
  COLORS: {
    tick: '#BBBAB0BA',
    centerDot: '#FFFFFF70',
    hourHand: 'linear-gradient(to top, #EBEBCA,  #ffffff, #EDEDBE)',
    minuteHand: 'linear-gradient(to top,#E5E5C2, #ffffff, #DEDEB7)',
    secondHand: 'linear-gradient(to top, #F76307, #ffb199)',
  }
};

/**
 * Custom Hook: useClock
 * Efficiently handles the time-keeping logic
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

  // Load Font
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

  // Memoized Numerals (They don't need to re-render 60 times a second)
  const renderedNumerals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
      const angle = (num / 12) * 2 * Math.PI;
      const x = 50 + CLOCK_CONFIG.NUMERAL_RADIUS * Math.sin(angle);
      const y = 50 - CLOCK_CONFIG.NUMERAL_RADIUS * Math.cos(angle);
      const rotation = (num / 12) * 360;

      return (
        <div
          key={num}
          style={{
            ...styles.numeralBase,
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        >
          {num}
        </div>
      );
    });
  }, []);

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${analogBgImage})`, fontFamily: fontReady ? "'BorrowedAnalog', sans-serif" : 'sans-serif' }}>
      <div style={styles.backgroundFilter} />
      <div style={styles.face}>
        {renderedNumerals}
        
        {/* Hands */}
        <div style={{ ...styles.hand, ...styles.hourHand, transform: `translate(-50%, 0) rotate(${hr * 30}deg)` }} />
        <div style={{ ...styles.hand, ...styles.minHand, transform: `translate(-50%, 0) rotate(${min * 6}deg)` }} />
        <div style={{ ...styles.hand, ...styles.secHand, transform: `translate(-50%, 0) rotate(${sec * 6}deg)` }} />
        
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
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  backgroundFilter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    filter: 'saturate(150%) hue-rotate(20deg)',
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
    color: CLOCK_CONFIG.COLORS.tick,
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    // textShadow: '1px 0 0 rgba(0, 0, 0, 0.33)',
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: '50% 100%',
    borderRadius: '999px',
  },
  hourHand: {
    width: '0.9vmin',
    height: '22vmin',
    background: CLOCK_CONFIG.COLORS.hourHand,
    boxShadow: '0 0.2rem 0.5rem rgba(0,0,0,0.7)',
    zIndex: 2,
  },
  minHand: {
    width: '0.7vmin',
    height: '30vmin',
    background: CLOCK_CONFIG.COLORS.minuteHand,
    boxShadow: '0 0.2rem 0.4rem rgba(0,0,0,0.6)',
    zIndex: 3,
  },
  secHand: {
    width: '0.3vmin',
    height: '34vmin',
    background: CLOCK_CONFIG.COLORS.secondHand,
    boxShadow: '0 0.3rem 0.6rem rgba(0,0,0,0.7)',
    zIndex: 4,
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '2.8vmin',
    height: '2.8vmin',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    background: CLOCK_CONFIG.COLORS.centerDot,
    boxShadow: '0 0.3rem 0.9rem rgba(0,0,0,0.7), inset 0 0.1rem 0.3rem rgba(0,0,0,0.5)',
    zIndex: 5,
  }
};

export default AnalogClock;
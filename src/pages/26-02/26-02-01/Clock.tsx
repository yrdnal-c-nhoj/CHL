import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useMillisecondClock } from '../../../utils/useSmoothClock';

// --- Assets ---
import dripFont from '../../../assets/fonts/26-01-31-cond.ttf?url';
import analogBgImage from '../../../assets/images/26-02/26-02-01/rain.webp';

// Export assets for ClockPage preloader
export const background = analogBgImage;

// --- Configuration ---
const CLOCK_CONFIG = {
  NUMERAL_RADIUS: 40,
  COLORS: {
    silverText:
      'linear-gradient(180deg, #FFFFFF 0%, #C0C0C0 45%, #C5C1C1 50%, #D3D8F3 100%)',
    hourHand: 'linear-gradient(to right, #959595, #ffffff, #959595)',
    minuteHand: 'linear-gradient(to right, #B0B0B0, #ffffff, #B0B0B0)',
    secondHand: 'linear-gradient(to top, #5F709F, #889AD4)',
  },
};

const AnalogClock: React.FC = () => {
  // Smooth millisecond animation using requestAnimationFrame
  const now = useMillisecondClock();
  
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = useMemo(() => [{
      fontFamily: 'BorrowedAnalog',
      fontUrl: dripFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
  }], []);
  
  useSuspenseFontLoader(fontConfigs);

  const styles = getStyles();

  // Time Calculations (including sub-second fractions for smooth motion)
  const msec = now.getMilliseconds();
  const sec = now.getSeconds() + msec / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr = (now.getHours() % 12) + min / 60;

  // Memoized Numerals
  const renderedNumerals = useMemo(() => {
    const numbersToShow = [12, 3, 6, 9];
    return numbersToShow.map((num) => {
      // Calculate position using Polar to Cartesian conversion
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
    <div style={styles.container}>
      {/* Background Layer */}
      <div
        style={{
          ...styles.backgroundLayer,
          backgroundImage: `url(${analogBgImage})`,
        }}
      />

      {/* Clock Face Layer */}
      <div
        style={{
          ...styles.face,
          fontFamily: "'BorrowedAnalog', sans-serif",
        }}
      >
        {renderedNumerals}

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

        {/* Center Cap */}
        <div style={styles.centerDot} />
      </div>
    </div>
  );
};

// --- Styles ---
const getStyles = () => ({
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#050505',
    // Suspense handles loading state, no need for manual opacity/visibility toggles
  },
  backgroundLayer: {
    position: 'absolute',
    inset: 0,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    filter: 'saturate(120%) hue-rotate(-40deg) brightness(1.3) contrast(0.4)',
    zIndex: 1,
    transform: 'rotate(180deg)',
    pointerEvents: 'none',
  },
  face: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vmin',
    height: '90vmin',
    zIndex: 2,
  },
  numeralBase: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    fontSize: 'clamp(7rem, 18vw, 9rem)',
    background: CLOCK_CONFIG.COLORS.silverText,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0px -4px 0px rgb(0, 0, 0))',
    opacity: 0.4,
    userSelect: 'none',
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
    zIndex: 3,
  },
  minHand: {
    width: '0.8vmin',
    height: '32vmin',
    background: CLOCK_CONFIG.COLORS.minuteHand,
    boxShadow: '0 0 8px rgba(0,0,0,0.4)',
    zIndex: 4,
  },
  secHand: {
    width: '0.4vmin',
    height: '38vmin',
    background: CLOCK_CONFIG.COLORS.secondHand,
    boxShadow: '0 0 12px rgba(90, 184, 213, 0.4)',
    zIndex: 5,
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '2.5vmin',
    height: '2.5vmin',
    backgroundColor: '#fff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    boxShadow: '0 0 5px rgba(0,0,0,0.8)',
  },
});

export default AnalogClock;

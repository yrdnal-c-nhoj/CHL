import React, { useEffect, useState, useMemo } from 'react';

// --- Assets ---
import bellImage2 from '../../../assets/images/26-02-11/bell.webp';
import bellImage1 from '../../../assets/images/26-02-11/bell.gif';

// --- Constants ---
const CLOCK_CONFIG = {
  NUMERAL_RADIUS: 40,
  UPDATE_INTERVAL_MS: 50,
  FONT_FAMILY: "'Gilda Display', serif",
  FONT_URL: 'https://fonts.googleapis.com/css2?family=Gilda+Display&display=swap',
  COLORS: {
    background: '#BFA7A7',
    silverText: 'linear-gradient(180deg, #24058B 0%, #000000 45%, #232222 50%, #062D79 100%)',
    hourHand: 'linear-gradient(to right, #4E4D4D, #282727, #4D4949)',
    minuteHand: 'linear-gradient(to right, #3B3939, #383636, #484444)',
    secondHand: 'linear-gradient(to top, #4B4C4F, #4F4F52)',
    centerDot: '#565856',
  },
};

const HAND_DIMENSIONS = {
  hour: { width: '1.2vmin', height: '20vmin', zIndex: 3 },
  minute: { width: '0.8vmin', height: '32vmin', zIndex: 4 },
  second: { width: '0.4vmin', height: '38vmin', zIndex: 5 },
};

// --- Utility Functions ---
const getHandRotation = (value, multiplier) => value * multiplier;

const calculateNumeralPosition = (number) => {
  const angleRad = (number / 12) * 2 * Math.PI;
  const angleDeg = (number / 12) * 360;
  
  return {
    x: 50 + CLOCK_CONFIG.NUMERAL_RADIUS * Math.sin(angleRad),
    y: 50 - CLOCK_CONFIG.NUMERAL_RADIUS * Math.cos(angleRad),
    angle: angleDeg,
  };
};

const calculateTimeValues = (date) => {
  const msec = date.getMilliseconds();
  const sec = date.getSeconds() + msec / 1000;
  const min = date.getMinutes() + sec / 60;
  const hr = (date.getHours() % 12) + min / 60;
  
  return { hr, min, sec };
};

// --- Custom Hooks ---
const useGoogleFont = (fontUrl = CLOCK_CONFIG.FONT_URL) => {
  const [fontReady, setFontReady] = useState(false);
  
  useEffect(() => {
    const fontId = 'gilda-display-font';
    
    if (document.getElementById(fontId)) {
      setFontReady(true);
      return;
    }

    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);
    
    document.fonts
      .load('1em "Gilda Display"')
      .then(() => setFontReady(true))
      .catch(() => setFontReady(true)); // Fallback on error
  }, [fontUrl]);
  
  return fontReady;
};

const useSmoothClock = (intervalMs = CLOCK_CONFIG.UPDATE_INTERVAL_MS) => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), intervalMs);
    return () => clearInterval(intervalId);
  }, [intervalMs]);

  return time;
};

// --- Sub-Components ---
const BackgroundLayers = () => (
  <>
    <div
      style={{
        ...styles.backgroundLayer,
        backgroundImage: `url(${bellImage1})`,
      }}
    />
    <div
      style={{
        ...styles.backgroundLayer,
        backgroundImage: `url(${bellImage2})`,
        backgroundSize: 'cover',
        filter: 'saturate(520%) hue-rotate(-120deg) contrast(0.4) brightness(1.6)',
        zIndex: 1,
      }}
    />
  </>
);

const ClockNumerals = () => {
  const numerals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const { x, y, angle } = calculateNumeralPosition(num);

      return (
        <div
          key={num}
          style={{
            ...styles.numeral,
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          }}
        >
          {num}
        </div>
      );
    });
  }, []);

  return <>{numerals}</>;
};

const ClockHand = ({ type, rotation }) => {
  const { width, height, zIndex } = HAND_DIMENSIONS[type];
  const background = CLOCK_CONFIG.COLORS[`${type}Hand`];

  return (
    <div
      style={{
        ...styles.hand,
        width,
        height,
        background,
        zIndex,
        transform: `translate(-50%, 0) rotate(${rotation}deg)`,
      }}
    />
  );
};

const CenterDot = () => (
  <div style={styles.centerDot} />
);

// --- Main Component ---
const AnalogClock = () => {
  const fontReady = useGoogleFont();
  const currentTime = useSmoothClock();
  const { hr, min, sec } = calculateTimeValues(currentTime);

  return (
    <div
      style={{
        ...styles.container,
        opacity: fontReady ? 1 : 0,
        visibility: fontReady ? 'visible' : 'hidden',
      }}
    >
      <BackgroundLayers />
      
      <div style={styles.clockFace}>
        <ClockNumerals />
        <ClockHand type="hour" rotation={getHandRotation(hr, 30)} />
        <ClockHand type="minute" rotation={getHandRotation(min, 6)} />
        <ClockHand type="second" rotation={getHandRotation(sec, 6)} />
        <CenterDot />
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
    backgroundColor: CLOCK_CONFIG.COLORS.background,
    transition: 'opacity 0.3s ease',
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

  clockFace: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vmin',
    height: '100vmin',
    zIndex: 7,
    fontFamily: CLOCK_CONFIG.FONT_FAMILY,
  },

  numeral: {
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

  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '2vmin',
    height: '2vmin',
    background: CLOCK_CONFIG.COLORS.centerDot,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
  },
};

export default AnalogClock;

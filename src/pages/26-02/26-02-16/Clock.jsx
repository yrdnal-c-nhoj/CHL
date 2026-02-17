import React, { useEffect, useState, useMemo, useCallback } from 'react';

// --- Assets ---
import mazeImage from '../../../assets/images/26-02-16/puzzle.gif';
import mazeFont from '../../../assets/fonts/26-02-16-maze.ttf';

// --- Configuration ---
const CONFIG = {
  FONT_FAMILY: 'MazeFont',
  COLORS: {
    background: '#0a0005',
    glow: 'rgba(181, 12, 12, 0)', // #B50C0C88
    text: '#331A1ABC',
  },
};

// --- Styled Components (Logic-based) ---
const getBackgroundStyle = (isFlipped) => ({
  position: 'absolute',
  inset: 0,
  backgroundImage: `url(${mazeImage})`,
  backgroundSize: '200px auto',
  backgroundRepeat: 'repeat',
  backgroundPosition: 'center',
  filter: 'contrast(6.4) brightness(1.0)',
  opacity: isFlipped ? 0.4 : 0.7,
  transform: isFlipped ? 'scale(-1, -1)' : 'none',
  zIndex: isFlipped ? 2 : 1,
});

// --- Sub-Components ---

// Memoized to prevent re-renders since the background never changes
const BackgroundLayers = React.memo(() => (
  <>
    <div style={getBackgroundStyle(false)} />
    <div style={getBackgroundStyle(true)} />
  </>
));

const Digit = ({ char }) => {
  const isColon = char === ':';
  return (
    <div style={styles.digitBox}>
      <span style={{ ...styles.digit, ...(isColon ? styles.colon : {}) }}>
        {char}
      </span>
    </div>
  );
};

// --- Main Component ---
const DigitalClock = () => {
  const [fontReady, setFontReady] = useState(false);
  const [time, setTime] = useState(new Date());

  // 1. Optimized Font Loading
  useEffect(() => {
    let isMounted = true;
    const font = new FontFace(CONFIG.FONT_FAMILY, `url(${mazeFont})`);
    
    font.load().then(() => {
      if (isMounted) {
        document.fonts.add(font);
        setFontReady(true);
      }
    }).catch(() => setFontReady(true));

    return () => { isMounted = false; };
  }, []);

  // 2. High-Performance Animation Loop (requestAnimationFrame)
  useEffect(() => {
    let frameId;
    const update = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // 3. Time Formatting Logic
  const timeParts = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`.split('');
  }, [time]);

  if (!fontReady) return null;

  return (
    <main style={styles.container}>
      <style>{blinkAnimation}</style>
      <BackgroundLayers />
      
      <div style={styles.digitalContainer}>
        <div style={styles.timeWrapper}>
          {timeParts.map((char, idx) => (
            <Digit key={`${idx}-${char}`} char={char} />
          ))}
        </div>
      </div>
    </main>
  );
};

// --- Styles & Animations ---
const blinkAnimation = `
  @keyframes pulse-glow {
    0%, 100% { opacity: 1; text-shadow: 0 0 10px ${CONFIG.COLORS.glow}, 0 0 30px ${CONFIG.COLORS.glow}; }
    50% { opacity: 0.6; text-shadow: 0 0 5px ${CONFIG.COLORS.glow}; }
  }
`;

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    // backgroundColor: CONFIG.COLORS.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitalContainer: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  timeWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.15em',
  },
  digitBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.1em', // Fixed width prevents jittering
    height: '1.2em',
  },
  digit: {
    fontFamily: CONFIG.FONT_FAMILY,
    fontSize: 'clamp(2rem, 4vh, 8rem)',
    lineHeight: 1,
    textAlign: 'center',
    
  },
  colon: {    opacity: 0.8,
  },
};

export default DigitalClock;
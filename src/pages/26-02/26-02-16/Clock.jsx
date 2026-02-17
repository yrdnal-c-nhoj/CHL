import React, { useEffect, useState, useMemo } from 'react';

// --- Assets ---
import mazeImage from '../../../assets/images/26-02-16/puzzle.gif';
import loopImage from '../../../assets/images/26-02-16/loop.gif';
import mazeFont from '../../../assets/fonts/26-02-16-maze.ttf';

// --- Configuration ---
const CONFIG = {
  FONT_FAMILY: 'MazeFont',
  COLORS: {
    background: '#0a0005',
    glow: '#F2EFEF99',
    glowFaint: 'rgba(181, 12, 12, 0)',
    text: '#331A1A80',
  },
  // Adjust these values to fine-tune each layer individually
  FILTERS: {
    loopLayer: { contrast: '1.2', brightness: '0.8' },
    mazeNormal: { contrast: '6.4', brightness: '1.0' },
    mazeFlipped: { contrast: '4.0', brightness: '0.5' },
  }
};


const BackgroundLayers = React.memo(() => {
  return (
    <>
      {/* 1. Loop Background (Base Layer) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${loopImage})`,
          backgroundSize: '900px auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          mixBlendMode: 'screen', // This makes black transparent
          filter: `contrast(${CONFIG.FILTERS.loopLayer.contrast}) brightness(${CONFIG.FILTERS.loopLayer.brightness})`,
          zIndex: 4,
          opacity: 0.8,
        }}
      />


      {/* 2. Maze Normal Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${mazeImage})`,
          backgroundSize: '250px auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          opacity: 0.7,
          filter: `contrast(${CONFIG.FILTERS.mazeNormal.contrast}) brightness(${CONFIG.FILTERS.mazeNormal.brightness})`,
          zIndex: 1,
        }}
      />

      {/* 3. Maze Flipped Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${mazeImage})`,
          backgroundSize: '250px auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          opacity: 0.4,
          transform: 'scale(-1, -1)',
          filter: `contrast(${CONFIG.FILTERS.mazeFlipped.contrast}) brightness(${CONFIG.FILTERS.mazeFlipped.brightness})`,
          zIndex: 2,
        }}
      />
    </>
  );
});
BackgroundLayers.displayName = 'BackgroundLayers';

// --- Sub-Components ---
const Digit = React.memo(({ char }) => {
  const isColon = char === ':';
  return (
    <div style={styles.digitBox}>
      <span style={{ ...styles.digit, ...(isColon ? styles.colon : {}) }}>
        {char}
      </span>
    </div>
  );
});
Digit.displayName = 'Digit';

// --- Main Component ---
const DigitalClock = () => {
  const [fontReady, setFontReady] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let isMounted = true;
    const font = new FontFace(CONFIG.FONT_FAMILY, `url(${mazeFont})`);
    font.load().then(() => {
      if (isMounted) {
        document.fonts.add(font);
        setFontReady(true);
      }
    }).catch(() => {
      if (isMounted) setFontReady(true);
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeParts = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`.split('');
  }, [time]);

  if (!fontReady) return null;

  return (
    <main style={styles.container}>
      <style>{animations}</style>
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

// --- Animations & Styles (Keep existing) ---
const animations = `
  @keyframes pulse-glow {
    0%, 100% {
      opacity: 1;
      text-shadow: 0 0 10px ${CONFIG.COLORS.glow}, 0 0 30px ${CONFIG.COLORS.glow}, 0 0 60px ${CONFIG.COLORS.glowFaint};
    }
    50% {
      opacity: 0.6;
      text-shadow: 0 0 5px ${CONFIG.COLORS.glow};
    }
  }
  @keyframes colon-blink {
    0%, 49% { opacity: 0.8; }
    50%, 100% { opacity: 0.2; }
  }
`;

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: CONFIG.COLORS.background,
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
    width: '1.1em',
    height: '1.2em',
  },
  digit: {
    fontFamily: `${CONFIG.FONT_FAMILY}, monospace`,
    fontSize: 'clamp(2rem, 15vw, 8rem)',
    lineHeight: 1,
    textAlign: 'center',
    color: CONFIG.COLORS.text,
    animation: 'pulse-glow 2s ease-in-out infinite',
    userSelect: 'none',
  },
  colon: {
    animation: 'colon-blink 1s step-end infinite',
  },
};

export default DigitalClock;
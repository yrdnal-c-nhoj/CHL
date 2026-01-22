import React, { useState, useEffect, useMemo, memo } from 'react';

// Explicit Asset Imports
import backgroundImage from '../../assets/clocks/26-01-21/fllap.webp';
import tileImage from '../../assets/clocks/26-01-21/flap.webp'; 
import customFontFile from '../../assets/fonts/26-01-21-migrate.ttf';

// Memoize the Numbers so they don't re-render every second
const ClockNumbers = memo(({ fontFamily }) => (
  <>
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        style={{
          ...styles.numberSlot,
          transform: `rotate(${i * 30}deg)`,
        }}
      >
        <span style={{ ...styles.number, fontFamily }}>
          {i === 0 ? 12 : i}
        </span>
      </div>
    ))}
  </>
));

const AnalogBirdMigrateClock = () => {
  const [isReady, setIsReady] = useState(false);
  const [time, setTime] = useState(new Date());

  const fontFamilyName = useMemo(() => `Font-${Math.random().toString(36).slice(2, 7)}`, []);

  useEffect(() => {
    let isMounted = true;
    const loadFont = async () => {
      try {
        const fontFace = new FontFace(fontFamilyName, `url(${customFontFile})`);
        await fontFace.load().then(loaded => document.fonts.add(loaded));
        if (isMounted) setIsReady(true);
      } catch (e) {
        if (isMounted) setIsReady(true);
      }
    };
    loadFont();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => { isMounted = false; clearInterval(timer); };
  }, [fontFamilyName]);

  const hourDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
  const minuteDeg = time.getMinutes() * 6;

  if (!isReady) return null;

  return (
    <div style={styles.wrapper}>
      {/* PERFORMANCE FIX: Isolated Background Layer */}
      <div style={styles.gpuAcceleratedLayer}>
        <div style={styles.backgroundLayer} />
        <div style={{ ...styles.tileBase, backgroundSize: '600px', opacity: 0.8 }} />
      </div>

      <div style={styles.clockFace}>
        <ClockNumbers fontFamily={fontFamilyName} />

        {/* Hour Hand */}
        <div style={{ 
          ...styles.hand, 
          height: '24%', 
          width: 'min(1.8vw, 7px)',
          transform: `translateX(-50%) rotate(${hourDeg}deg)` 
        }} />
        
        {/* Minute Hand */}
        <div style={{ 
          ...styles.hand, 
          height: '38%', 
          width: 'min(1.2vw, 4px)',
          transform: `translateX(-50%) rotate(${minuteDeg}deg)` 
        }} />

        <div style={styles.pin} />
      </div>
    </div>
  );
};

const styles = {
wrapper: {
  width: '100vw',
  height: '100dvh',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #4C6DF3 0%, #798158A2 100%)', // Blue to Dark Blue
},
  gpuAcceleratedLayer: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    // Forces the GIF to be rendered by the GPU
    transform: 'translateZ(0)',
    willChange: 'transform',
    pointerEvents: 'none',
  },
  backgroundLayer: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.5)', 
  },
  tileBase: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${tileImage})`,
    backgroundRepeat: 'repeat',
    mixBlendMode: 'overlay',
  },
  clockFace: {
    position: 'relative',
    zIndex: 10,
    width: 'min(85vw, 85vh)',
    height: 'min(85vw, 85vh)',
  },
  numberSlot: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '2%',
  },
  number: {
    fontSize: 'min(11vw, 11vh)', 
    color: '#830DD2',
    textShadow: '0 0 15px #8B5CF6',
    userSelect: 'none',
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '10px',
    backgroundColor: '#830DD2',
    boxShadow: '0 0 20px #8B5CF6',
    zIndex: 15,
  },
  pin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#830DD2',
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
  }
};

export default AnalogBirdMigrateClock;
import React, { useState, useEffect, useMemo } from 'react';
import ci2602Font from '../../../assets/fonts/pin.ttf?url';

const OutwardDistortedClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    const loadFont = async () => {
      try {
        const fontFace = new FontFace('Cine', `url(${ci2602Font})`);
        const loadedFont = await fontFace.load();
        document.fonts.add(loadedFont);
      } catch (e) {
        console.error('Font load failed', e);
      }
    };
    loadFont();

    return () => clearInterval(timer);
  }, []);

  const digits = useMemo(() => {
    let h = time.getHours();
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const h12 = h.toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    // Ensure consistent spacing for the ring layout
    return `${h12}:${m}:${s} ${period}`.split('');
  }, [time]);

  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#D3284A',
      overflow: 'hidden',
      perspective: '1500px', // Adjusted for a stronger 3D effect
      fontFamily: '"Cine", "Arial Black", sans-serif',
    },
    ring: {
      position: 'relative',
      transformStyle: 'preserve-3d',
      // Remove animation to keep all digits visible at all times
    },
    digit: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      fontSize: '15vh',
      fontWeight: '900',
      color: '#200CB8',
      // This is key: we want to see the back of the digit when it's behind
      backfaceVisibility: 'visible', 
      WebkitBackfaceVisibility: 'visible',
      transformOrigin: 'center center',
      // Add box styling to prevent jumping
      width: '60px',
      height: '80px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '4px',
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spinHorizontal {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
      `}</style>

      <div style={styles.ring}>
        {digits.map((char, i) => {
          const angle = (i / digits.length) * 360;
          return (
            <React.Fragment key={i}>
              {/* Front-facing digit */}
              <div
                style={{
                  ...styles.digit,
                  color: '#200CB8',
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(450px)`,
                }}
              >
                {char}
              </div>
              {/* Back-facing digit (mirrored) */}
              <div
                style={{
                  ...styles.digit,
                  color: '#FF6B35',
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(-450px) rotateY(180deg)`,
                }}
              >
                {char}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OutwardDistortedClock;
import React, { useState, useEffect, useRef } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import fontUrl from '../../../assets/fonts/26-03-15-shadow.otf';

const MS_PER_ROTATION = 30000;

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number | null>(null);

  const fontsReady = useMultipleFontLoader([
    { fontFamily: '26-03-15-shadow', fontUrl, options: { weight: 'normal', style: 'normal' } },
  ]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now);
      // Continuous rotation calculation
      setRotation(-((now.getTime() / MS_PER_ROTATION) * 360) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { 
      if (rafRef.current) cancelAnimationFrame(rafRef.current); 
    };
  }, []);

  if (!fontsReady) {
    return (
      <div style={styles.container}>
        <span style={styles.loading}>Loading…</span>
      </div>
    );
  }

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const digits = [h[0], h[1], m[0], m[1]];

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        {digits.map((digit, i) => (
          <div key={i} style={styles.digitBox}>
            <div style={getDigitStyle(rotation)}>
              {digit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#043A98',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // isolation: 'isolate' prevents the blend mode from interacting 
    // with elements behind the clock container (like the body/html tags)
    isolation: 'isolate',
    backgroundImage: `
      repeating-linear-gradient(
        180deg,
        transparent,
        transparent 4vh,
        rgb(225, 192, 7) 4vh,
        rgb(202, 64, 64) 8vh
      )
    `,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  digitBox: {
    width: '10vh', 
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  loading: {
    fontSize: '3rem',
    color: '#888',
    userSelect: 'none',
  },
};

const getDigitStyle = (rotation: number): React.CSSProperties => ({
  fontFamily: '"26-03-15-shadow", sans-serif',
  fontSize: '60vh',
  // White color + difference blend mode = exact color inversion
  color: '#FFFFFF',
  mixBlendMode: 'difference',
  lineHeight: 1,
  willChange: 'transform',
  transform: `rotate(${rotation}deg)`,
  transformOrigin: 'center center',
  display: 'inline-block',
});

export default Clock;
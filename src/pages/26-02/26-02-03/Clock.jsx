import React, { useEffect, useRef } from 'react';

const Disc260203Clock = () => {
  const clockRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    // 1. Updated link to include italic variants with weights 100 (Thin), 400 (Regular), and 900 (Boldest)
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100;0,9..144,400;0,9..144,900;1,9..144,100;1,9..144,400;1,9..144,900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const animate = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds();
      const m = now.getMinutes();
      const h = now.getHours();

      const sDeg = (s + ms / 1000) * 6;
      const mDeg = (m + s / 60) * 6;
      const hDeg = ((h % 12) + m / 60) * 30;

      if (clockRef.current) {
        clockRef.current.style.setProperty('--s-rot', `${sDeg}deg`);
        clockRef.current.style.setProperty('--m-rot', `${mDeg}deg`);
        clockRef.current.style.setProperty('--h-rot', `${hDeg}deg`);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={styles.container} ref={clockRef}>
      <div style={styles.clockBase}>
        <div style={styles.centerPin} />
        
        {/* Seconds: Thin (100) */}
        <Disc size="90vmin" rotationVar="--s-rot" color="#E20606" label="s" weight={100} italic />
        
        {/* Minutes: Regular (400) */}
        <Disc size="67vmin" rotationVar="--m-rot" color="#0D74FB" label="m" weight={400} italic />
        
        {/* Hours: Boldest (900) */}
        <Disc size="35vmin" rotationVar="--h-rot" color="#08B308" label="h" weight={900} italic />
      </div>
    </div>
  );
};

const Disc = ({ size, rotationVar, color, label, weight, italic }) => (
  <div
    style={{
      ...styles.disc,
      width: size,
      height: size,
      transform: `rotate(var(${rotationVar}))`,
    }}
  >
    <span style={{ 
      ...styles.label, 
      color,
      fontWeight: weight, // Applying the specific weight here
      fontStyle: italic ? 'italic' : 'normal', // Apply italic styling
    }}>
      {label}
    </span>
  </div>
);

const styles = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFBBF',
    margin: 0,
    overflow: 'hidden',
    fontFamily: '"Fraunces", serif',
  },
  clockBase: {
    position: 'relative',
    width: '95vmin',
    height: '95vmin',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disc: {
    position: 'absolute',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    willChange: 'transform',
    pointerEvents: 'none',
  },
  label: {
    position: 'absolute',
    top: '0',
    fontSize: '18vh',
    transform: 'translateY(-50%)', 
    lineHeight: 1,
  },
  centerPin: {
    width: '3vw',
    height: '3vw',
    backgroundColor: '#F26AD7',
    borderRadius: '50%',
    zIndex: 10,
  }
};

export default Disc260203Clock;
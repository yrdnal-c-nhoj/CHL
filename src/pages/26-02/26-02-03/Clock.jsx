import React, { useEffect, useRef } from 'react';

const DiscClock = () => {
  const clockRef = useRef(null);
  const requestRef = useRef();

  const animate = () => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours();

    // Calculate degrees
    const sDeg = (s + ms / 1000) * 6;
    const mDeg = (m + s / 60) * 6;
    const hDeg = ((h % 12) + m / 60) * 30;

    // Direct DOM manipulation via CSS Variables for maximum performance
    if (clockRef.current) {
      clockRef.current.style.setProperty('--s-rot', `${sDeg}deg`);
      clockRef.current.style.setProperty('--m-rot', `${mDeg}deg`);
      clockRef.current.style.setProperty('--h-rot', `${hDeg}deg`);
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div style={styles.container} ref={clockRef}>
      <div style={styles.clockBase}>
        <div style={styles.centerPin} />

        {/* Passing the CSS variable name as a prop */}
        <Disc size="85vmin" rotationVar="--s-rot" color="#E20606" label="S" />
        <Disc size="65vmin" rotationVar="--m-rot" color="#0D74FB" label="M" />
        <Disc size="45vmin" rotationVar="--h-rot" color="#08B308" label="H" />
      </div>
    </div>
  );
};

const Disc = ({ size, rotationVar, color, label }) => (
  <div
    style={{
      ...styles.disc,
      width: size,
      height: size,
      // The rotation is now handled by the CSS variable
      transform: `rotate(var(${rotationVar}))`,
      // background: `conic-gradient(from 0deg, transparent 0%, ${color}05 80%, ${color}aa 100%)`,
    }}
  >
    <div style={{ ...styles.leadLine, backgroundColor: color, boxShadow: `0 0 0px ${color}` }}>
      <span style={{ 
        ...styles.label, 
        color, 
        // Rotated 90 degrees relative to your previous 270deg
        transform: `translate(-50%, -100%) rotate(0deg)` 
      }}>
        {label}
      </span>
    </div>
  </div>
);

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFBBF', // Darkened for better glow effect
    margin: 0,
    overflow: 'hidden',
    fontFamily: 'sans-serif',
  },
  clockBase: {
    position: 'relative',
    width: '90vmin',
    height: '90vmin',
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
  },
  // leadLine: {
  //   position: 'absolute',
  //   width: '2px',
  //   height: '50%',
  //   top: 0,
  //   left: '50%',
  //   transform: 'translateX(-50%)',
  // },
  label: {
    position: 'absolute',
    top: '10vh',
    fontSize: '15vh',
    // fontWeight: 'bold',
    opacity: 0.9,
    // Ensure the label stays centered on the line
    left: '50%',
  },
  centerPin: {
    width: '1vh',
    height: '1vh',
    backgroundColor: '#fff',
    borderRadius: '50%',
    zIndex: 10,
    boxShadow: '0 0 10px #fff',
  }
};

export default DiscClock;
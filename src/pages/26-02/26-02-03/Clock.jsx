import React, { useState, useEffect, useRef } from 'react';

const DiscClock = () => {
  const [rotation, setRotation] = useState({ h: 0, m: 0, s: 0 });
  const requestRef = useRef();

  // Use requestAnimationFrame for buttery smooth movement
  const animate = () => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours();

    // Calculate degrees including partial progress for smoothness
    // This creates a "sweeping" motion rather than a "ticking" one
    setRotation({
      s: (s + ms / 1000) * 6, // 360 / 60
      m: (m + s / 60) * 6,
      h: ((h % 12) + m / 60) * 30, // 360 / 12
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.clockBase}>
        {/* Center Pin */}
        <div style={styles.centerPin} />

        <Disc size="85vmin" degrees={rotation.s} color="#F50622" label="S" />
        <Disc size="65vmin" degrees={rotation.m} color="#00f2ff" label="M" />
        <Disc size="45vmin" degrees={rotation.h} color="#7000ff" label="H" />
      </div>
    </div>
  );
};


const Disc = ({ size, degrees, color, label }) => (
  <div
    style={{
      ...styles.disc,
      width: size,
      height: size,
      transform: `rotate(${degrees}deg)`,
      border: `1px solid ${color}33`,
      background: `conic-gradient(from 0deg, transparent 0%, ${color}05 80%, ${color}aa 100%)`,
    }}
  >
    {/* The Lead Line (Hand) */}
    <div style={{ ...styles.leadLine, backgroundColor: color, boxShadow: `0 0 15px ${color}` }}>
      {/* Rotate the label by 180° */}
      <span style={{ 
        ...styles.label, 
        color, 
        transform: `translate(-50%, -100%) rotate(270deg)` 
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
    backgroundColor: '#7D7979',
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
    willChange: 'transform', // Optimization for animations
  },

  label: {
    position: 'absolute',
    top: '10vh',
    fontSize: '10.8rem',
    // fontWeight: 'bold',
    opacity: 0.8,
  },
  centerPin: {
    width: '4px',
    height: '4px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    zIndex: 10,
    boxShadow: '0 0 10px #fff',
  }
};

export default DiscClock;
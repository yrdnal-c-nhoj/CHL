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

        <Disc size="85vmin" degrees={rotation.s} color="#000000" />
        <Disc size="65vmin" degrees={rotation.m} color="#000000" />
        <Disc size="45vmin" degrees={rotation.h} color="#000000" />
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
      background: `conic-gradient(from 0deg, transparent 0%, ${color}05 50%, ${color}aa 100%)`,
    }}
  >
    <div style={{ ...styles.leadLine, backgroundColor: color, boxShadow: `0 0 0px ${color}` }} />

  </div>
);

const styles = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    margin: 0,
    overflow: 'hidden',
    fontFamily: 'sans-serif',
  },
  clockBase: {
    position: 'relative',
    width: '100vmin',
    height: '100vmin',
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

};

export default DiscClock;
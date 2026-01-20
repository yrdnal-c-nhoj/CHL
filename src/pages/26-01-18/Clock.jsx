import React, { useState, useEffect } from 'react';

const COLORS = {
  hour: '#0EA4E900',   // Cyan
  minute: '#6365F100', // Indigo
  second: '#F80505', // Rose
  bg: '#DDE0E700'
};

const DiscClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const s = time.getSeconds();
  const m = time.getMinutes();
  const h = time.getHours();

  // Rotations
  const rotations = {
    second: (s / 60) * 360,
    minute: ((m + s / 60) / 60) * 360,
    hour: (((h % 12) + m / 60) / 12) * 360,
  };

  return (
    <div style={styles.container}>
      <div style={styles.clockBase}>
        {/* Hour Layer */}
        <ClockDisc size="100%" rotation={rotations.hour}  zIndex={1} />
        <ClockHand length="25%" width="8px" rotation={rotations.hour} color="#1E293B" />

        {/* Minute Layer */}
        <ClockDisc size="75%" rotation={rotations.minute} zIndex={2} />
        <ClockHand length="35%" width="5px" rotation={rotations.minute} color="#475569" />

        {/* Second Layer */}
        <ClockDisc size="50%" rotation={rotations.second} color={COLORS.second} zIndex={3} />
        <ClockHand length="92%" width="2px" rotation={rotations.second} color={COLORS.second} />

        {/* Center Pivot */}
        <div style={styles.centerDot} />
      </div>
    </div>
  );
};

const ClockDisc = ({ size, rotation, color, zIndex }) => (
  <div
    style={{
      ...styles.discBase,
      width: size,
      height: size,
      zIndex,
      transform: `rotate(${rotation}deg)`,
      // Fade from transparent to the themed color
      // background: `conic-gradient(from 0deg, transparent 0%, ${color}22 80%, ${color}aa 100%)`,
    }}
  >
    {/* The Highlight Lead Line */}
    <div style={{ ...styles.leadLine, backgroundColor: color }} />
  </div>
);

const ClockHand = ({ length, width, rotation, color }) => (
  <div
    style={{
      ...styles.handBase,
      height: length,
      width: width,
      backgroundColor: color,
      transform: `translateX(-50%) rotate(${rotation}deg)`,
    }}
  />
);

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    margin: 0,
    overflow: 'hidden',
    fontFamily: 'sans-serif',
  },
  clockBase: {
    position: 'relative',
    width: 'min(80vw, 80vh)',
    height: 'min(80vw, 80vh)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // boxShadow: '20px 20px 60px #bcbfc5, -20px -20px 60px #fdffff', // Neumorphic effect
  },
  discBase: {
    position: 'absolute',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    transition: 'transform 1s linear',
    pointerEvents: 'none',
  },
  leadLine: {
    width: '1vh',
    height: '150%',
    // boxShadow: '0 0 15px currentColor',
  },
  handBase: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '4px',
    zIndex: 10,
    transition: 'transform 1s cubic-bezier(0.4, 2.08, 0.55, 0.44)', // Slight organic bounce
  },
 
};

export default DiscClock;
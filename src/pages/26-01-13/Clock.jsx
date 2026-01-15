import React, { useState, useEffect } from 'react';

const DiscClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // 1. Calculate degrees: These move 0 -> 360 clockwise
  const sDeg = (seconds / 60) * 360;
  const mDeg = ((minutes + seconds / 60) / 60) * 360;
  const hDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    margin: 0,
    overflow: 'hidden',
  };

  const clockBase = {
    position: 'relative',
    width: 'min(80vw, 80dvh)',
    height: 'min(80vw, 80dvh)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const getDiscStyle = (size, rotation, color, zIndex) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    border: `2px solid rgba(255, 255, 255, 0.1)`,
    backgroundColor: color,
    // FIX: Removed the negative sign. Positive degrees rotate clockwise.
    transform: `rotate(${rotation}deg)`, 
    // FIX: Using 'linear' or a gentler cubic-bezier for seconds to prevent "jitter"
    transition: 'transform 1s linear', 
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
    zIndex,
  });

  const markerStyle = {
    position: 'absolute',
    top: '-20px',
    width: '4px',
    height: '40px',
    backgroundColor: '#f8fafc',
    borderRadius: '2px',
    zIndex: 10,
  };

  const indicatorDot = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginTop: '10px',
  };

  return (
    <div style={containerStyle}>
      <div style={clockBase}>
        {/* The 12 o'clock reference point */}
        <div style={markerStyle} />

        {/* Hour Disc (Outer) */}
        <div style={getDiscStyle('100%', hDeg, '#1e293b', 1)}>
          <div style={{ ...indicatorDot, backgroundColor: '#38bdf8' }} />
        </div>

        {/* Minute Disc (Middle) */}
        <div style={getDiscStyle('75%', mDeg, '#334155', 2)}>
          <div style={{ ...indicatorDot, backgroundColor: '#818cf8' }} />
        </div>

        {/* Second Disc (Inner) */}
        <div style={getDiscStyle('50%', sDeg, '#475569', 3)}>
          <div style={{ ...indicatorDot, backgroundColor: '#fb7185' }} />
        </div>

        {/* Center Cap */}
        <div style={{
          position: 'absolute',
          width: '15%',
          height: '15%',
          backgroundColor: '#0f172a',
          borderRadius: '50%',
          zIndex: 4,
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }} />
      </div>
    </div>
  );
};

export default DiscClock;
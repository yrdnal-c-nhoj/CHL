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

  // Degrees: 0 -> 360 clockwise
  const sDeg = (seconds / 60) * 360;
  const mDeg = ((minutes + seconds / 60) / 60) * 360;
  const hDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDE0E7',
    margin: 0,
    overflow: 'hidden',
  };

  const clockBase = {
    position: 'relative',
    width: 'min(85vw, 85dvh)',
    height: 'min(85vw, 85dvh)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  /**
   * @param {string} size - Diameter of the disc
   * @param {number} rotation - Current rotation in degrees
   * @param {string} color - The trail/line color (hex/rgb)
   * @param {number} zIndex - Layering
   */
  const getDiscStyle = (size, rotation, color, zIndex) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    zIndex,
    transform: `rotate(${rotation}deg)`,
    // 'linear' is crucial for seconds to keep the trail smooth with the clock movement
    transition: rotation === 0 ? 'none' : 'transform 1s linear',
    // The Magic: Conic gradient creates a 360-degree fade
    // We use "transparent 0deg" at the start (12 o'clock relative to the disc) 
    // and the full color at 360deg to meet the "line"
    background: `conic-gradient(from 0deg, transparent 0%, ${color}aa 98%, ${color} 100%)`,
    display: 'flex',
    justifyContent: 'center',
    // Soft glow effect
    boxShadow: `inset 0 0 20px rgba(0,0,0,0.5), 0 0 15px ${color}33`,
  });

  // The "Lead Line" replacing the dot
  const leadLineStyle = {
    width: '992px',
    height: '50%', // Reaches from center to top edge
    backgroundColor: '#fff',
    boxShadow: '0 0 8px #fff',
    position: 'absolute',
    top: 0,
    left: 'calc(50% - 1px)',
  };

  return (
    <div style={containerStyle}>
      <div style={clockBase}>
        {/* Static background rings for depth */}
        <div style={{ position: 'absolute', width: '100%', height: '100%',  borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: '70%', height: '70%',  borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: '40%', height: '40%',  borderRadius: '50%' }} />

        {/* Hour Disc (Outer) - Cyan Trail */}
        <div style={getDiscStyle('100%', hDeg, '#0ea5e9', 1)}>
          <div style={leadLineStyle} />
        </div>

        {/* Minute Disc (Middle) - Indigo Trail */}
        <div style={getDiscStyle('70%', mDeg, '#6366f1', 2)}>
          <div style={leadLineStyle} />
        </div>

        {/* Second Disc (Inner) - Rose Trail */}
        <div style={getDiscStyle('40%', sDeg, '#f43f5e', 3)}>
          <div style={leadLineStyle} />
        </div>

       
      </div>
    </div>
  );
};

export default DiscClock;
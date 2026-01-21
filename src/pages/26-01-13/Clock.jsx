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

  // Calculation for smooth, continuous movement
  const sDeg = (seconds / 60) * 360;
  const mDeg = ((minutes + seconds / 60) / 60) * 360;
  const hDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3EEEE', // Darker background makes colors pop
    margin: 0,
    overflow: 'hidden',
  };

  const clockBase = {
    position: 'relative',
    width: 'min(100vw, 100dvh)', // Added padding
    height: 'min(100vw, 100dvh)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const getDiscStyle = (size, rotation, color, zIndex) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    zIndex,
    transform: `rotate(${rotation}deg)`,
    // The "transition" is removed here to prevent the reverse-spin glitch.
    // For a "sweep" feel, we use 'step-end' or no transition on the 0 jump.
    transition: rotation === 0 ? 'none' : 'transform 1s linear',
    background: `conic-gradient(from 0deg, transparent 0%, ${color}22 70%, ${color}aa 98%, ${color} 100%)`,
    display: 'flex',
    justifyContent: 'center',
    // boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
  });

  const leadLineStyle = (color) => ({
    height: '50%',
    width: '0px',
    backgroundColor: color,
    position: 'absolute',
    top: 0,
    left: 'calc(50% - 1px)',
    boxShadow: `0 0 8px ${color}`,
  });

  return (
    <div style={containerStyle}>
      <div style={clockBase}>
        {/* Hour Disc - Cyan */}
        <div style={getDiscStyle('50%', hDeg, '#272829', 1)}>
          <div style={leadLineStyle('#323435')} />
        </div>

        {/* Minute Disc - Yellow */}
        <div style={getDiscStyle('75%', mDeg, '#151514', 2)}>
          <div style={leadLineStyle('#171717')} />
        </div>

        {/* Second Disc - Rose */}
        <div style={getDiscStyle('100%', sDeg, '#201F1F', 3)}>
          <div style={leadLineStyle('#111010')} />
        </div>

      
      </div>
    </div>
  );
};

export default DiscClock;
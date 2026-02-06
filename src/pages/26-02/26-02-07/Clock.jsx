import React, { useState, useEffect, useRef } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const requestRef = useRef();

  // Update time for the digits and the rotation
  const animate = () => {
    setTime(new Date());
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    // Combine into one string to map over
    return `${h}:${m}:${s}:${ms}`.split('');
  };

  const digits = formatTime(time);
  const radius = 120; // Distance from center in pixels

  // Rotation logic: 1 full turn (360deg) per 60 seconds
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const rotation = (seconds / 60) * 360;

  // Inline Style Objects
  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
  };

  const ringStyle = {
    position: 'relative',
    width: '0px',
    height: '0px',
    transform: `rotate(${rotation}deg)`,
    transition: 'transform 0.05s linear', // Smoothes out the frame updates
  };

  return (
    <div style={containerStyle}>
      <div style={ringStyle}>
        {digits.map((char, i) => {
          // Distribute characters evenly in a circle
          const angle = (i / digits.length) * (2 * Math.PI);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          // Convert angle to degrees for individual digit rotation
          const rotationDeg = (angle * 180) / Math.PI;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                fontSize: '2rem',
                fontWeight: 'bold',
                // Rotate 90deg extra so they face "outward" from the center
                transform: `translate(-50%, -50%) rotate(${rotationDeg + 90}deg)`,
                userSelect: 'none',
              }}
            >
              {char}
            </div>
          );
        })}
      </div>
      
      {/* Visual Center Point (Optional) */}
      <div style={{
        position: 'absolute',
        width: '4px',
        height: '4px',
        backgroundColor: '#81104A',
        borderRadius: '50%'
      }} />
    </div>
  );
};

export default DigitalClock;
import React, { useEffect, useState } from 'react';

export default function AnalogClock() {
  const [now, setNow] = useState(new Date());

  // Update every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate angles
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;

  const secondDeg = seconds * 6; // 360 / 60
  const minuteDeg = minutes * 6 + seconds * 0.1; // smooth
  const hourDeg = hours * 30 + minutes * 0.5; // smooth

  const containerStyle = {
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    overflow: 'hidden',
  };

  const clockStyle = {
    position: 'relative',
    width: '50vw',
    height: '50vw',
    maxWidth: '80rem',
    maxHeight: '80rem',
    border: '0.5rem solid #fff',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const handStyle = (deg, width, height, color) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width,
    height,
    backgroundColor: color,
    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
    transformOrigin: '50% 100%',
    borderRadius: '0.2rem',
  });

  // Optional: clock center dot
  const centerDotStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '1.5rem',
    height: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div style={containerStyle}>
      <div style={clockStyle}>
        {/* Hour hand */}
        <div style={handStyle(hourDeg, '1rem', '12vw', '#fff')}></div>
        {/* Minute hand */}
        <div style={handStyle(minuteDeg, '0.7rem', '18vw', '#fff')}></div>
        {/* Second hand */}
        <div style={handStyle(secondDeg, '0.4rem', '20vw', 'red')}></div>
        <div style={centerDotStyle}></div>
      </div>
    </div>
  );
}

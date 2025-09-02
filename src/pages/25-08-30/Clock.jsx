// DigitalClock.jsx
import React, { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  const clockStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    fontSize: '8vh',
    fontFamily: '"Courier New", monospace',
    backgroundColor: '#111',
    color: '#0ff',
    userSelect: 'none',
  };

  return <div style={clockStyle}>{`${hours}:${minutes}:${seconds}`}</div>;
};

export default DigitalClock;

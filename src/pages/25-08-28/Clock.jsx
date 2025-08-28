// src/components/DigitalClock.jsx
import { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    fontFamily: "'Arial', sans-serif"
  };

  const titleStyle = {
    color: '#333',
    marginBottom: '20px'
  };

  const timeStyle = {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#007bff',
    backgroundColor: '#fff',
    padding: '20px 40px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Digital Clock</h1>
      <div style={timeStyle}>{formatTime(time)}</div>
    </div>
  );
};

export default DigitalClock;
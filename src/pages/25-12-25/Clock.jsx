import React, { useState, useEffect } from 'react';

const ConcentricClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  // Calculate rotations in degrees
  const secRev = (seconds / 60) * 360;
  const minRev = ((minutes + seconds / 60) / 60) * 360;
  const hrRev = ((hours + minutes / 60) / 12) * 360;

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    fontFamily: 'sans-serif'
  };

  const clockFaceStyle = {
    position: 'relative',
    width: '80vmin',
    height: '80vmin',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const discBaseStyle = {
    position: 'absolute',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
    border: '0.2vmin solid rgba(255, 255, 255, 0.1)'
  };

  const markerStyle = {
    width: '1vmin',
    height: '4vmin',
    backgroundColor: '#38bdf8',
    borderRadius: '1vmin'
  };

  return (
    <div style={containerStyle}>
      <div style={clockFaceStyle}>
        
        {/* Seconds Ring - Outer */}
        <div style={{
          ...discBaseStyle,
          width: '75vmin',
          height: '75vmin',
          transform: `rotate(${secRev}deg)`,
          zIndex: 1
        }}>
          <div style={{ ...markerStyle, backgroundColor: '#f43f5e' }} />
        </div>

        {/* Minutes Ring - Middle */}
        <div style={{
          ...discBaseStyle,
          width: '50vmin',
          height: '50vmin',
          transform: `rotate(${minRev}deg)`,
          zIndex: 2,
          backgroundColor: '#1e293b'
        }}>
          <div style={{ ...markerStyle, backgroundColor: '#fbbf24' }} />
        </div>

        {/* Hours Ring - Inner */}
        <div style={{
          ...discBaseStyle,
          width: '25vmin',
          height: '25vmin',
          transform: `rotate(${hrRev}deg)`,
          zIndex: 3,
          backgroundColor: '#334155',
          boxShadow: '0 0 5vmin rgba(0,0,0,0.5)'
        }}>
          <div style={markerStyle} />
        </div>

        {/* Center Point */}
        <div style={{
          position: 'absolute',
          width: '2vmin',
          height: '2vmin',
          backgroundColor: '#f8fafc',
          borderRadius: '50%',
          zIndex: 4
        }} />

        {/* Static 12 o'clock Guide */}
        <div style={{
          position: 'absolute',
          top: '0',
          color: 'white',
          fontSize: '3vmin',
          fontWeight: 'bold',
          opacity: 0.5
        }}>▼</div>

      </div>
    </div>
  );
};

export default ConcentricClock;
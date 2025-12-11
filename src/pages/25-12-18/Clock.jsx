import React, { useState, useEffect } from 'react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;

  const clockStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: '10px solid #333',
    position: 'relative',
    margin: '50px auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  };

  const handStyle = (deg, height, width, color) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: color,
    transform: 'translate(-50%, -100%) rotate(' + deg + 'deg)',
    transformOrigin: 'bottom center',
    borderRadius: '10px',
    zIndex: 10,
  });

  const centerDotStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12px',
    height: '12px',
    backgroundColor: '#333',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
  };

  const numbers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30) * (Math.PI / 180);
    const x = 80 * Math.sin(angle);
    const y = -80 * Math.cos(angle);
    
    numbers.push(
      <div 
        key={i} 
        style={{
          position: 'absolute',
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          transform: 'translate(-50%, -50%)',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        {i}
      </div>
    );
  }

  return (
    <div style={clockStyle}>
      {numbers}
      <div style={handStyle(hourDegrees, 50, 6, '#333')}></div>
      <div style={handStyle(minuteDegrees, 80, 4, '#666')}></div>
      <div style={handStyle(secondDegrees, 90, 2, '#f00')}></div>
      <div style={centerDotStyle}></div>
    </div>
  );
};

export default AnalogClock;

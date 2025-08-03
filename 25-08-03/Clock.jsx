import React, { useState, useEffect } from 'react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const radius = 100;
  const center = radius;
  const secondDeg = (time.getSeconds() / 60) * 360;
  const minuteDeg = (time.getMinutes() / 60) * 360 + (secondDeg / 60);
  const hourDeg = ((time.getHours() % 12) / 12) * 360 + (minuteDeg / 12);

  const handStyle = (deg, width, color) => ({
    position: 'absolute',
    width: `${width}%`,
    height: '2%',
    backgroundColor: color,
    top: '50%',
    left: '50%',
    transformOrigin: '0% 50%',
    transform: `rotate(${deg}deg) translateX(-50%)`,
    borderRadius: '1rem',
  });

  return (
    <div
      style={{
        width: '20rem',
        height: '20rem',
        border: '0.5rem solid black',
        borderRadius: '50%',
        position: 'relative',
        background: '#fff',
        margin: '2rem auto',
      }}
    >
      {/* Hour hand */}
      <div style={handStyle(hourDeg, 30, 'black')} />
      {/* Minute hand */}
      <div style={handStyle(minuteDeg, 45, 'black')} />
      {/* Second hand */}
      <div style={handStyle(secondDeg, 48, 'red')} />

      {/* Clock center dot */}
      <div
        style={{
          position: 'absolute',
          width: '1rem',
          height: '1rem',
          backgroundColor: 'black',
          borderRadius: '50%',
          top: 'calc(50% - 0.5rem)',
          left: 'calc(50% - 0.5rem)',
        }}
      />

      {/* Numbers */}
      {[...Array(12)].map((_, i) => {
        const angle = ((i + 1) * 30) * (Math.PI / 180);
        const x = center + Math.sin(angle) * (radius - 20);
        const y = center - Math.cos(angle) * (radius - 20);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            {i + 1}
          </div>
        );
      })}
    </div>
  );
};

export default AnalogClock;

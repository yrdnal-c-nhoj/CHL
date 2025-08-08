import React, { useEffect, useState } from 'react';
import './AnalogClock.css';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Calculate rotation degrees
  const secondDeg = seconds * 6; // 360/60
  const minuteDeg = minutes * 6 + seconds * 0.1; // 360/60 + progress from seconds
  const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="clock">
      <div className="dial hour-hand" style={{ transform: `rotate(${hourDeg}deg)` }} />
      <div className="dial minute-hand" style={{ transform: `rotate(${minuteDeg}deg)` }} />
      <div className="dial second-hand" style={{ transform: `rotate(${secondDeg}deg)` }} />

      {/* Clock center */}
      <div className="center-dot" />

      {/* Numbers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i + 1) * 30;
        return (
          <div
            key={i}
            className="number"
            style={{ transform: `rotate(${angle}deg) translate(0, -90px) rotate(-${angle}deg)` }}
          >
            {i + 1}
          </div>
        );
      })}

      {/* Ticks */}
      {[...Array(60)].map((_, i) => {
        const angle = i * 6;
        return (
          <div
            key={i}
            className={`tick ${i % 5 === 0 ? 'major' : 'minor'}`}
            style={{ transform: `rotate(${angle}deg) translate(0, -100px)` }}
          />
        );
      })}
    </div>
  );
};

export default AnalogClock;

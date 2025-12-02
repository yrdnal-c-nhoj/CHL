import React, { useState, useEffect } from 'react';
import backgroundImage from './bg.webp';

const ROTATION_DURATION = 60; // seconds for a full 360° rotation
const ZOOM_MULTIPLIER = 1.5;  // Zoom factor

const RotatingBackground = () => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [sideLength, setSideLength] = useState(0);
  const [time, setTime] = useState(new Date());

  // ... (unchanged useEffect for computeSize and rotation)
  useEffect(() => {
    const computeSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const diagonal = Math.sqrt(w * w + h * h) * ZOOM_MULTIPLIER;
      setSideLength(diagonal);
    };

    computeSize();
    window.addEventListener('resize', computeSize);
    return () => window.removeEventListener('resize', computeSize);
  }, []);

  useEffect(() => {
    let startTime = null;

    const rotate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000; // seconds
      const angle = (-360 * (elapsed / ROTATION_DURATION)) % 360; // counter-clockwise
      setRotationAngle(angle);
      requestAnimationFrame(rotate);
    };

    const frameId = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(frameId);
  }, []);
  // ... (unchanged useEffect for time update)
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // ... (unchanged styles)
  const viewportContainerStyle = {
    height: '100dvh',
    width: '100vw',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    position: 'relative',
  };

  const rotatingImageStyle = {
    width: sideLength,
    height: sideLength,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`,

    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const clockRadius = 150; // px
  const tickLength = 10;   // px
  const tickWidth = 2;     // px

  // 1. ADD mix-blend-mode TO THE CLOCK CONTAINER
  const clockStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${clockRadius * 5}px`,
    height: `${clockRadius * 5}px`,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    // KEY CHANGE: Apply blend mode to the entire clock
    mixBlendMode: 'difference', // Tries to achieve a visually inverse color
  };

  const handStyle = (length, width, color, angle) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: '50% 100%',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    width: `${width}px`,
    height: `${length}px`,
    backgroundColor: color,
    borderRadius: '2px',
  });

  const hour = time.getHours() % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const hourAngle = (hour + minute / 60) * 30; // 360/12 = 30
  const minuteAngle = (minute + second / 60) * 6; // 360/60 = 6
  const secondAngle = second * 6;

  return (
    <div style={viewportContainerStyle}>
      <div style={rotatingImageStyle} />
      <div style={clockStyle}>
        {/* Ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = i * 6; // 360 / 60
          // 2. SET TICK COLOR TO PURE WHITE (or black) to maximize the blending effect
          const tickStyle = {
            position: 'absolute',
            width: `${tickWidth}px`,
            height: `${tickLength}px`,
            backgroundColor: 'white', // Changed to solid color
            top: '50%',
            left: '50%',
            transform: `rotate(${angle}deg) translateY(-${clockRadius}px)`,
            transformOrigin: 'center bottom',
          };
          return <div key={i} style={tickStyle} />;
        })}

        {/* Hour hand */}
        {/* 3. SET HAND COLOR TO PURE WHITE (or black) */}
        <div style={handStyle(clockRadius * 0.5, 6, 'white', hourAngle)} />

        {/* Minute hand */}
        {/* 4. SET HAND COLOR TO PURE WHITE (or black) */}
        <div style={handStyle(clockRadius * 0.7, 4, 'white', minuteAngle)} />

        {/* Second hand */}
        {/* 5. SET HAND COLOR TO PURE WHITE (or black) */}
        <div style={handStyle(clockRadius * 0.9, 2, 'white', secondAngle)} />
      </div>
    </div>
  );
};

export default RotatingBackground;
import React, { useEffect, useState, useRef } from 'react';
import './style.css';

const NUM_CLOCKS = 8; // Adjust for more or fewer clocks

const ClockInstance = ({ offset }) => {
  const [time, setTime] = useState(new Date());
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const requestRef = useRef();

  // Spirograph Parameters
  const R = 150; // Outer radius
  const r = 52;  // Inner radius
  const d = 60;  // Offset distance

  const animate = (t) => {
    // 't' is timestamp in ms. We use it as the angle 'theta'
    const angle = (t / 1000) + offset;
    
    const x = (R - r) * Math.cos(angle) + d * Math.cos(((R - r) / r) * angle);
    const y = (R - r) * Math.sin(angle) - d * Math.sin(((R - r) / r) * angle);

    setPosition({ x, y });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Timer for the clock display
    const timer = setInterval(() => setTime(new Date()), 1000);
    // Loop for the movement
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const formatTime = (date) => date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  const blobPath = "M43.1,-68.5C56.2,-58.6,67.5,-47.3,72.3,-33.9C77.2,-20.5,75.5,-4.9,74.2,11.3C72.9,27.6,71.9,44.5,63.8,57.2C55.7,69.8,40.6,78.2,25.5,79.2C10.4,80.1,-4.7,73.6,-20.9,69.6C-37.1,65.5,-54.5,63.9,-66,54.8C-77.5,45.8,-83.2,29.3,-85.7,12.3C-88.3,-4.8,-87.7,-22.3,-79.6,-34.8C-71.5,-47.3,-55.8,-54.9,-41.3,-64.2C-26.7,-73.6,-13.4,-84.7,0.8,-86C15,-87.2,29.9,-78.5,43.1,-68";

  return (
    <div 
      className="clock-wrapper"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: 'absolute'
      }}
    >
      <svg viewBox="0 0 200 200" width="150" height="150">
        <defs>
          <clipPath id={`clip-${offset}`}>
            <path d={blobPath} transform="translate(100 100)"/>
          </clipPath>
        </defs>

        <image 
          href="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=764&q=80"
          width="200" height="200"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#clip-${offset})`}
        />

        <path id={`textPath-${offset}`} d={blobPath} transform="translate(100 100)" fill="none" />

        <text className="text-content-static">
          <textPath href={`#textPath-${offset}`} startOffset="0%">
            {formatTime(time)} ❤ {formatTime(time)} ❤
            <animate attributeName="startOffset" from="0%" to="100%" dur="10s" repeatCount="indefinite" />
          </textPath>
        </text>
      </svg>
    </div>
  );
};

const SpirographClocks = () => {
  return (
    <div className="spiro-container">
      {/* Centered origin for the clocks */}
      {[...Array(NUM_CLOCKS)].map((_, i) => (
        <ClockInstance key={i} offset={i * (Math.PI * 2 / NUM_CLOCKS)} />
      ))}
    </div>
  );
};

export default SpirographClocks;
import React, { useState, useEffect, useRef } from 'react';
import rocketBg from '../../../assets/images/26-03/26-03-06/rocket.gif';
import hourHandImg from '../../../assets/images/26-03/26-03-06/hand2.webp';
import minuteHandImg from '../../../assets/images/26-03/26-03-06/hand1.webp';
import secondHandImg from '../../../assets/images/26-03/26-03-06/hand3.webp';

const RocketGrid = () => {
  const [rotation, setRotation] = useState({ s: 0, m: 0, h: 0 });
  const requestRef = useRef();

  const animate = () => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours();

    const secondsWithMs = s + ms / 1000;
    const minutesWithSeconds = m + secondsWithMs / 60;
    const hoursWithMinutes = (h % 12) + minutesWithSeconds / 60;

    setRotation({
      s: secondsWithMs * 6,
      m: minutesWithSeconds * 6,
      h: hoursWithMinutes * 30
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Adjusted for large, full-view rockets
  const rows = 28; // Increased from 22
  const cols = 20; // Increased from 15

  return (
    <div style={containerStyle}>
      
      {/* --- UNCLIPPED LARGE ROCKET GRID --- */}
      <div style={gridWrapperStyle}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} style={rowStyle}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} style={cellStyle}>
                <img
                  src={rocketBg}
                  alt="Rocket"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain', // Ensures the whole rocket is visible
                    transform: rowIndex % 2 === 0 ? 'rotate(90deg)' : 'rotate(270deg)',
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* --- ANALOG CLOCK OVERLAY --- */}
      <div style={clockWrapperStyle}>
        <img src={hourHandImg} alt="Hour" style={{ 
          ...handStyle, 
          height: '18vh', 
          transform: `translateX(-50%) rotate(${rotation.h}deg)` 
        }} />
        
        <img src={minuteHandImg} alt="Minute" style={{ 
          ...handStyle, 
          height: '23vh', 
          transform: `translateX(-50%) rotate(${rotation.m}deg)` 
        }} />
        
        <img src={secondHandImg} alt="Second" style={{ 
          ...handStyle, 
          height: '25vh', 
          transform: `translateX(-50%) rotate(${rotation.s}deg)`,
          transition: 'none'
        }} />

      </div>
    </div>
  );
};

// --- STYLES ---

const containerStyle = {
  position: 'relative',
  width: '100vw',
  height: '100dvh',
  overflow: 'hidden',
  background: '#1F5FAC',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const gridWrapperStyle = {
  position: 'absolute',
  inset: '-100px', // Reduced inset for bigger rockets
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none',
  // opacity: 0.8,
  // Using gap to keep them close without overlapping/clipping
  // gap: '10px' 
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  // gap: '15px' // Space between rockets in a row
};

const cellStyle = {
  width: '150px', // Increased from 100px for bigger rockets
  height: '150px', // Increased from 100px for bigger rockets
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const clockWrapperStyle = {
  position: 'relative',
  width: '600px', // Increased from 450px
  height: '600px', // Increased from 450px
  zIndex: 10,
  filter: 'drop-shadow(0 0 40px rgb(0, 0, 0))'
};

const handStyle = {
  position: 'absolute',
  left: '50%',
  bottom: '50%',
  transformOrigin: 'bottom center',
  zIndex: 15,
  willChange: 'transform'
};

export default RocketGrid;
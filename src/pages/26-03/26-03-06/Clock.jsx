import React, { useState, useEffect } from 'react';
// Keep your existing imports
import rocketBg from '../../../assets/images/26-03/26-03-06/rocket.gif';
import hourHandImg from '../../../assets/images/26-03/26-03-06/hand2.webp';
import minuteHandImg from '../../../assets/images/26-03/26-03-06/hand1.webp';
import secondHandImg from '../../../assets/images/26-03/26-03-06/hand3.webp';

const RocketGrid = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Smooth rotation math
  const degS = (seconds / 60) * 360;
  const degM = ((minutes + seconds / 60) / 60) * 360;
  const degH = (((hours % 12) + minutes / 60) / 12) * 360;

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100dvh', 
      overflow: 'hidden', 
      background: '#1F5FAC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      {/* --- INTENSE ROCKET GRID --- */}
      <div style={{ 
        position: 'absolute', 
        inset: '-50px', // Slight overflow to ensure edges are covered
        display: 'grid',
        // Creating roughly 15 columns of 80px rockets
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '5px',
        opacity: 0.7,
        pointerEvents: 'none' // Clicks go through to the clock
      }}>
        {/* Generates ~200 rockets to ensure the screen is packed */}
        {Array.from({ length: 200 }).map((_, i) => {
          // Logic to alternate direction based on "row" 
          // (Approximated by index since it's a dynamic grid)
          const isAltRow = Math.floor(i / 10) % 2 === 0; 
          return (
            <img
              key={i}
              src={rocketBg}
              alt="Rocket"
              style={{ 
                width: '100%', 
                height: '120px', 
                objectFit: 'contain', 
                transform: `rotate(${isAltRow ? 90 : 270}deg)` 
              }}
            />
          );
        })}
      </div>

      {/* --- ANALOG CLOCK OVERLAY --- */}
      <div style={{
        position: 'relative',
        width: '400px',
        height: '400px',
        zIndex: 10,
        // Optional: slight glow to separate clock from busy background
        filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))'
      }}>
        
        {/* Hour Hand */}
        <img src={hourHandImg} alt="Hour" style={{ 
          ...handStyle, 
          height: '100px', 
          transform: `translateX(-50%) rotate(${degH}deg)` 
        }} />
        
        {/* Minute Hand */}
        <img src={minuteHandImg} alt="Minute" style={{ 
          ...handStyle, 
          height: '150px', 
          transform: `translateX(-50%) rotate(${degM}deg)` 
        }} />
        
        {/* Second Hand */}
        <img src={secondHandImg} alt="Second" style={{ 
          ...handStyle, 
          height: '180px', 
          transform: `translateX(-50%) rotate(${degS}deg)`,
          // Snaps back to 0 without spinning 360 degrees backwards
          transition: seconds === 0 ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }} />
        
        {/* Center Pin */}
        <div style={{ 
          position: 'absolute', 
          width: '15px', 
          height: '15px', 
          background: '#fff', 
          borderRadius: '50%', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 20 
        }} />
      </div>
    </div>
  );
};

const handStyle = {
  position: 'absolute',
  left: '50%',
  bottom: '50%',
  transformOrigin: 'bottom center',
  zIndex: 15,
  transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
};

export default RocketGrid;
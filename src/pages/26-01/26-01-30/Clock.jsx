import React, { useState, useEffect, useRef } from 'react';

// Explicit Asset Imports
import clockFont from '../../../assets/fonts/26-01-30-ne.ttf';
import bgLayer1 from "../../../assets/clocks/26-01-30/new.webp"; 
import bgLayer2 from "../../../assets/clocks/26-01-30/nes.gif";
import bgLayer3 from "../../../assets/clocks/26-01-30/ne3.gif";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  
  // Physics Refs - Tuned for ultra-slow movement
  const pos = useRef({ x: 0, y: 0 });
  const brain = useRef({
    angle: Math.random() * Math.PI * 2,
    targetAngle: Math.random() * Math.PI * 2,
    speed: 0.008,          // Initial slow speed
    turnStrength: 0.005,   // Very gradual turning
    confusionTimer: 0
  });
  
  const requestRef = useRef();
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const font = new FontFace('MyCustomFont', `url(${clockFont}) format('truetype')`);
    font.load().then((f) => { 
      document.fonts.add(f); 
      setFontLoaded(true); 
    }).catch(() => setFontLoaded(true));

    const animate = () => {
      const b = brain.current;

      b.confusionTimer--;
      if (b.confusionTimer <= 0) {
        // Pick a new direction and a very low speed range
        b.targetAngle = Math.random() * Math.PI * 2;
        b.speed = 0.005 + Math.random() * 0.012; 
        // Stay on this path for a long time (300-700 frames)
        b.confusionTimer = Math.floor(Math.random() * 400) + 300; 
      }

      // Smoothly rotate toward the target angle
      let angleDiff = b.targetAngle - b.angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      b.angle += angleDiff * b.turnStrength;

      // Update Position
      pos.current.x += Math.cos(b.angle) * b.speed;
      pos.current.y += Math.sin(b.angle) * b.speed;

      // Soft Boundary Logic: if drifting too far, head back to center (0,0)
      const limit = 12; 
      if (Math.abs(pos.current.x) > limit || Math.abs(pos.current.y) > limit) {
        b.targetAngle = Math.atan2(-pos.current.y, -pos.current.x);
      }

      setBgPos({ x: pos.current.x, y: pos.current.y });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const rawHours = time.getHours();
  const hours = rawHours % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = rawHours >= 12 ? 'PM' : 'AM';

  return (
    <div style={styles.container}>
      {/* Base Layer */}
      <img src={bgLayer1} alt="" style={styles.imageLayer1} />
      
      {/* Tiled Animated Layer */}
      <div style={styles.imageLayer2} />
      
      {/* Wandering Layer 3 - Optimized for Sub-pixel movement */}
      <img 
        src={bgLayer3} 
        alt="" 
        style={{
          ...styles.imageLayer3,
          transform: `translate(calc(-50% + ${bgPos.x}vw), calc(-50% + ${bgPos.y}vh)) rotate(0.02deg)`
        }} 
      />

      {/* Clock UI */}
      <div style={styles.uiWrapper}>
        <div style={{
          ...styles.timeText, 
          opacity: fontLoaded ? 1 : 0, 
          transition: 'opacity 0.5s ease-in-out'
        }}>
          {hours}:{minutes} <span style={styles.ampmText}>{ampm}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  imageLayer1: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '130%',
    objectFit: 'cover',
    zIndex: 2,
    opacity: 0.5,
    filter: 'contrast(140%) brightness(1.3) hue-rotate(15deg) saturate(170%)',
    pointerEvents: 'none',
  },
  imageLayer2: {
    position: 'absolute',
    inset: 0,
    zIndex: 3,
    pointerEvents: 'none',
    backgroundImage: `url(${bgLayer2})`,
    backgroundRepeat: 'repeat',
    backgroundSize: '100px 100px',
    animation: 'tileMove 15s linear infinite', // Slowed down the tile movement too
    opacity: 0.4,
    filter: 'drop-shadow(5px -5px 0 white)',
  },
  imageLayer3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '80%',
    height: '80%',
    objectFit: 'contain',
    zIndex: 7,
    opacity: 0.2,
    filter: 'drop-shadow(1px -1px 0 white)',
    pointerEvents: 'none',
    willChange: 'transform',
  },
  uiWrapper: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    color: '#CFDEEAA1',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  timeText: {
    fontFamily: 'MyCustomFont, sans-serif', 
    fontSize: 'clamp(3rem, 15vw, 10rem)',
    lineHeight: 1,
    fontStyle: 'italic',
    transform: 'skewX(-25deg)', // Slightly less aggressive skew for readability
  },
  ampmText: {
    fontSize: '0.6em',
    verticalAlign: 'middle',
  }
};

// Global Animation Keyframes
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes tileMove {
      0% { background-position: 0 0; }
      100% { background-position: -200px 200px; }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default DigitalClock;
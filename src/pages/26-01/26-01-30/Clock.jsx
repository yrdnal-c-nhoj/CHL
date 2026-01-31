import React, { useState, useEffect, useRef } from 'react';

// Explicit Asset Imports
import clockFont from '../../../assets/fonts/26-01-30-ne.ttf';
import bgLayer1 from "../../../assets/clocks/26-01-30/new.webp"; 
import bgLayer2 from "../../../assets/clocks/26-01-30/nes.gif";
import bgLayer3 from "../../../assets/clocks/26-01-30/ne3.gif";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  
  // Physics Refs for "Confused" behavior
  const pos = useRef({ x: 0, y: 0 });
  const brain = useRef({
    angle: Math.random() * Math.PI * 2,
    targetAngle: Math.random() * Math.PI * 2,
    speed: 0.1,
    turnStrength: 0.02,
    confusionTimer: 0
  });
  
  const requestRef = useRef();
  const [displayPos, setDisplayPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const font = new FontFace('MyCustomFont', `url(${clockFont}) format('truetype')`);
    font.load().then((f) => { document.fonts.add(f); setFontLoaded(true); })
      .catch(() => setFontLoaded(true));

    const animate = () => {
      const b = brain.current;

      // 1. "Decision Making" logic
      b.confusionTimer--;
      if (b.confusionTimer <= 0) {
        // Pick a new random target direction every 1-3 seconds
        b.targetAngle = Math.random() * Math.PI * 2;
        b.speed = 0.05 + Math.random() * 0.15; // Randomize speed (sometimes pauses, sometimes scurries)
        b.confusionTimer = Math.floor(Math.random() * 200) + 50; 
      }

      // 2. Smoothly rotate toward the target angle (Drunken walk)
      let angleDiff = b.targetAngle - b.angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      b.angle += angleDiff * b.turnStrength;

      // 3. Add a tiny "shiver" jitter
      const jitterX = (Math.random() - 0.5) * 0.05;
      const jitterY = (Math.random() - 0.5) * 0.05;

      // 4. Update Position
      pos.current.x += Math.cos(b.angle) * b.speed + jitterX;
      pos.current.y += Math.sin(b.angle) * b.speed + jitterY;

      // 5. Hard Boundary - Panic and turn around
      const limitX = 30; 
      const limitY = 25;
      if (Math.abs(pos.current.x) > limitX || Math.abs(pos.current.y) > limitY) {
        // Point back to center + heavy randomness
        b.targetAngle = Math.atan2(-pos.current.y, -pos.current.x) + (Math.random() - 0.5);
        b.angle = b.targetAngle; // Instant snap on collision
        b.speed *= 1.5; // "Scare" it away from the edge
      }

      setDisplayPos({ x: pos.current.x, y: pos.current.y });
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
      <img src={bgLayer1} alt="" style={styles.imageLayer1} />
      <div style={styles.imageLayer2} />
      <img src={bgLayer3} alt="" style={styles.imageLayer3} />

      <div style={{
        ...styles.uiWrapper,
        transform: `translate(${displayPos.x}vw, ${displayPos.y}vh)`
      }}>
        <div style={{
          ...styles.timeText, 
          opacity: fontLoaded ? 1 : 0, 
          transition: 'opacity 0.3s ease-in-out'
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
    animation: 'tileMove 10s linear infinite',
    opacity: 0.4,
    filter: 'drop-shadow(5px -5px 0 white)',
  },
  imageLayer3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    objectFit: 'contain',
    zIndex: 1,
    opacity: 0.3,
    filter: 'drop-shadow(1px -1px 0 white)',
    pointerEvents: 'none',
  },
  uiWrapper: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    color: '#352C3C',
    textShadow: '0 0 4px rgb(156, 175, 246)',
    willChange: 'transform',
    transition: 'transform 0.1s linear', // Adds a tiny bit of lag/drag to the jitter
  },
  timeText: {
    fontFamily: 'MyCustomFont, sans-serif', 
    fontSize: 'clamp(3rem, 15vw, 10rem)',
    lineHeight: 1,
    fontStyle: 'italic',
    transform: 'skewX(-35deg)',
  },
  ampmText: {
    fontSize: '0.8em',
  }
};

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
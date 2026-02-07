import React, { useState, useEffect, useMemo, useRef } from 'react';
import ci2602Font from '../../../assets/fonts/pin.ttf?url';

// Constants moved outside to prevent re-allocation
const OVAL = {
  RADIUS_X: 800,
  RADIUS_Z: 600,
  OFFSET_Z: -300,
  SPEED: 0.05,
};

const OutwardDistortedClock = () => {
  const [time, setTime] = useState(new Date());
  const requestRef = useRef();

  // 1. One-time setup for Font
  useEffect(() => {
    const fontFace = new FontFace('Cine', `url(${ci2602Font})`);
    fontFace.load().then((loaded) => document.fonts.add(loaded)).catch(console.error);
    
    // 2. High-performance animation loop
    const animate = () => {
      setTime(new Date());
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // 3. Memoize the digit array to avoid splitting strings every 16ms
  const { digits, phase } = useMemo(() => {
    const h = (time.getHours() % 12 || 12).toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    const p = time.getHours() >= 12 ? 'PM' : 'AM';
    
    return {
      digits: `${h}${m}${s}${p}`.split(''),
      phase: (time.getTime() / 1000) * OVAL.SPEED * 2 * Math.PI
    };
  }, [time]);

  return (
    <div style={containerStyle}>
      <div style={ringStyle}>
        {digits.map((char, i) => (
          <Digit 
            key={i} 
            char={char} 
            index={i} 
            total={digits.length} 
            phase={phase} 
          />
        ))}
      </div>
    </div>
  );
};

// 4. Sub-component to offload logic from the main loop
const Digit = ({ char, index, total, phase }) => {
  const angle = ((index / total) * 2 * Math.PI) - phase;
  const x = Math.sin(angle) * OVAL.RADIUS_X;
  const z = Math.cos(angle) * OVAL.RADIUS_Z + OVAL.OFFSET_Z;
  const rotationY = (angle * 180) / Math.PI;
  const isBack = Math.cos(angle) < 0;
  
  // Scale based on Z position (further = bigger)
  const distance = Math.abs(z - OVAL.OFFSET_Z);
  const scaleFactor = 1 + (distance / OVAL.RADIUS_Z) * 0.5; // Grow up to 1.5x size
  const fontSize = `${29 * scaleFactor}vh`;

  const style = {
    ...digitBaseStyle,
    color: isBack ? '#08EEFA' : '#18080D',
    textShadow: isBack 
      ? '15px 0 0px #270B05, 2px 2px 0 #0055ff' 
      : '5px 52px 0px #A95C6100',
    zIndex: Math.round(z),
    opacity: isBack ? 0.9 : 0.2,
    transform: `translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px) rotateY(${rotationY}deg)`,
    fontSize,
  };

  return <div style={style}>{char}</div>;
};

// --- Static Styles ---
const containerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #782D3A 0%, #4F0546 100%)',
  overflow: 'hidden',
  perspective: '1200px',
  fontFamily: '"Cine", "Arial Black", sans-serif',
};

const ringStyle = {
  position: 'relative',
  transformStyle: 'preserve-3d',
  width: '100%',
  height: '100%',
  transform: 'rotateX(10deg)', 
};

const digitBaseStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  fontSize: '29vh',
  backfaceVisibility: 'visible',
  WebkitBackfaceVisibility: 'visible',
  whiteSpace: 'pre',
  pointerEvents: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'color 0.1s ease, text-shadow 0.1s ease',
};

export default OutwardDistortedClock;
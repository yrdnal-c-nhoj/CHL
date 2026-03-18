/** @jsxImportSource react */
import React, { useEffect, useState, useMemo } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import cus251101font from '../../../assets/fonts/25-11-01-edgecase.ttf';

export default function EdgeClockWithHands() {
  const fontConfigs = useMemo(() => [
    {
      fontFamily: 'CustomClockFont',
      fontUrl: cus251101font,
      options: { weight: 'normal', style: 'normal' }
    }
  ], []);

  const isFontReady = useMultipleFontLoader(fontConfigs);
  const [time, setTime] = useState(new Date());
  const [viewport, setViewport] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 50);
    const updateSize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', updateSize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const { width, height } = viewport;
  const padding = 40; // Space from the literal edge of the screen in pixels

  const getNumberStyle = (num: number): React.CSSProperties => {
    let x = 50; // Percent
    let y = 50; // Percent

    // Map clock numbers to rectangular edge coordinates
    switch (num) {
      case 12: x = 50; y = 0; break;
      case 1:  x = 75; y = 0; break;
      case 2:  x = 100; y = 25; break;
      case 3:  x = 100; y = 50; break;
      case 4:  x = 100; y = 75; break;
      case 5:  x = 75; y = 100; break;
      case 6:  x = 50; y = 100; break;
      case 7:  x = 25; y = 100; break;
      case 8:  x = 0; y = 75; break;
      case 9:  x = 0; y = 50; break;
      case 10: x = 0; y = 25; break;
      case 11: x = 25; y = 0; break;
    }

    // Convert percentages to pixels with padding
    const left = `calc(${x}% + ${x === 0 ? padding : x === 100 ? -padding : 0}px)`;
    const top = `calc(${y}% + ${y === 0 ? padding : y === 100 ? -padding : 0}px)`;

    return {
      position: 'absolute',
      left,
      top,
      transform: 'translate(-50%, -50%)',
      fontSize: '6vh',
      color: '#FF6B6B',
      fontFamily: 'CustomClockFont, sans-serif',
      zIndex: 10,
    };
  };

  // Hand calculations
  const s = time.getSeconds() + time.getMilliseconds() / 1000;
  const m = time.getMinutes() + s / 60;
  const h = (time.getHours() % 12) + m / 60;

  const handStyle = (w: number, l: number, rot: number, color = '#F7F3F3FF'): React.CSSProperties => ({
    position: 'absolute',
    width: `${w}px`,
    height: `${l}vh`, // Use vh for responsive length
    backgroundColor: color,
    bottom: '50%',
    left: `calc(50% - ${w / 2}px)`,
    transformOrigin: '50% 100%',
    transform: `rotate(${rot}deg)`,
    borderRadius: '10px',
    zIndex: 5,
  });

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      position: 'relative',
      backgroundColor: '#05322DFF',
      overflow: 'hidden',
      opacity: isFontReady ? 1 : 0,
      transition: 'opacity 0.5s',
      border: '8px solid #72FF06FF',
      boxSizing: 'border-box'
    }}>
      {/* Numbers at Rectangular Edges */}
      {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
        <div key={n} style={getNumberStyle(n)}>{n}</div>
      ))}

      {/* Clock Hands */}
      <div style={handStyle(12, 30, h * 30)} /> {/* Hour */}
      <div style={handStyle(8, 40, m * 6)} />   {/* Minute */}
      <div style={handStyle(4, 45, s * 6, '#FF6B6B')} /> {/* Second */}

      {/* Center Cap */}
      <div style={{
        position: 'absolute',
        width: '20px',
        height: '20px',
        backgroundColor: '#F7F3F3FF',
        borderRadius: '50%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 6
      }} />
    </div>
  );
}
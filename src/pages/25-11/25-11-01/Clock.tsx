/** @jsxImportSource react */
import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import cus251101font from '../../../assets/fonts/25-11-01-edgecase.ttf?url';
import styles from './Clock.module.css';

export default function EdgeClockWithHands() {
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'CustomClockFont',
      fontUrl: cus251101font,
      options: { weight: 'normal', style: 'normal' }
    }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 50);
    const updateSize = () => { /* Force re-render on resize if needed */ };
    window.addEventListener('resize', updateSize); // Kept for behavior compatibility
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
      left,
      top,
    };
  };

  // Hand calculations
  const s = time.getSeconds() + time.getMilliseconds() / 1000;
  const m = time.getMinutes() + s / 60;
  const h = (time.getHours() % 12) + m / 60;

  const getHandStyle = (w: number, l: number, rot: number, color = '#F7F3F3FF'): React.CSSProperties => ({
    width: `${w}px`,
    height: `${l}vh`, // Use vh for responsive length
    backgroundColor: color,
    left: `calc(50% - ${w / 2}px)`,
    transform: `rotate(${rot}deg)`,
  });

  return (
    <div className={styles.container}>
      {/* Numbers at Rectangular Edges */}
      {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
        <div 
          key={n} 
          className={styles.number} 
          style={getNumberStyle(n)}
        >
          {n}
        </div>
      ))}

      {/* Clock Hands */}
      <div className={styles.hand} style={getHandStyle(12, 30, h * 30)} /> {/* Hour */}
      <div className={styles.hand} style={getHandStyle(8, 40, m * 6)} />   {/* Minute */}
      <div className={styles.hand} style={getHandStyle(4, 45, s * 6, '#FF6B6B')} /> {/* Second */}

      {/* Center Cap */}
      <div className={styles.centerDot} />
    </div>
  );
}
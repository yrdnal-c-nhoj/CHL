import React, { useEffect, useState } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import img12 from '@/assets/images/2026/26-04/26-04-04/12.jpg';
import img3 from '@/assets/images/2026/26-04/26-04-04/3.png';
import img6 from '@/assets/images/2026/26-04/26-04-04/6.jpg';
import img9 from '@/assets/images/2026/26-04/26-04-04/9.png';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const time = useClockTime();
  
  // Calculate total elapsed values to prevent the 360 -> 0 reset glitch
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();
  const ms = time.getMilliseconds();

  // Continuous degree calculation
  // By using the full time string or total seconds, we ensure the hand 
  // always moves forward.
  const secondDeg = ((seconds + ms / 1000) * 6);
  const minuteDeg = (minutes * 6) + (seconds * 0.1);
  const hourDeg = ((hours % 12) * 30) + (minutes * 0.5);

  const clockSize = 'min(96vw, 96vh)';
  const imgSize = 34;
  const halfImg = imgSize / 2;

  return (
    <div className={styles.container}>
      <svg viewBox="0 0 100 100" className={styles.clockSvg}>
        
        <defs>
          <filter id="acrylicNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
            <feDiffuseLighting in="noise" lightingColor="#fffaf0" surfaceScale="1" result="light">
              <feDistantLight azimuth="45" elevation="60"/>
            </feDiffuseLighting>
            <feBlend in="SourceGraphic" in2="light" mode="multiply"/>
          </filter>
        </defs>

        {/* Hour Markers */}
        <image href={img12} x={50 - halfImg} y={3} width={imgSize} height={imgSize} />
        <image href={img3} x={97 - imgSize} y={50 - halfImg} width={imgSize} height={imgSize} />
        <image href={img6} x={50 - halfImg} y={97 - imgSize} width={imgSize} height={imgSize} />
        <image href={img9} x={3} y={50 - halfImg} width={imgSize} height={imgSize} />

        {/* Hour Hand - Acrylic Slab */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="26"
          className={styles.glass}
          transform={`rotate(${hourDeg} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="26"
          stroke="rgba(255, 160, 60, 0.9)"
          strokeWidth="0.8"
          strokeLinecap="round"
          transform={`rotate(${hourDeg} 50 50)`}
        />

        {/* Minute Hand - Acrylic Slab */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="12"
          className={styles.minuteGlass}
          transform={`rotate(${minuteDeg} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="12"
          stroke="rgba(255, 160, 60, 0.9)"
          strokeWidth="0.8"
          strokeLinecap="round"
          transform={`rotate(${minuteDeg} 50 50)`}
        />

        {/* Second Hand - Smooth Continuous Sweep */}
        <line
          x1="50"
          y1="56"
          x2="50"
          y2="7"
          stroke="#ff3b30"
          strokeWidth="0.3"
          strokeLinecap="round"
          transform={`rotate(${secondDeg} 50 50)`}
          className={styles.secondHand}
        />

        {/* Center Pivot */}
        <circle cx="50" cy="50" r="0.5" fill="#938F8F" />
        <circle cx="50" cy="50" r="0.3" fill="#ff3b30" />
      </svg>
    </div>
  );
};

export default Clock;
import React, { useEffect, useState } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import img12 from '@/assets/images/2026/26-04/26-04-04/12.jpg';
import img3 from '@/assets/images/2026/26-04/26-04-04/3.png';
import img6 from '@/assets/images/2026/26-04/26-04-04/6.jpg';
import img9 from '@/assets/images/2026/26-04/26-04-04/9.png';

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

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    touchAction: 'none',
    userSelect: 'none',
  };

  const clockSize = 'min(96vw, 96vh)';
  const imgSize = 34;
  const halfImg = imgSize / 2;

  const glassStyle: React.CSSProperties = {
    fill: 'rgba(255, 250, 240, 0.15)',
    stroke: 'rgba(255, 250, 240, 0.35)',
    strokeWidth: 5.6,
    strokeLinecap: 'round',
    filter: 'url(#acrylicNoise)',
  };

  const minuteGlassStyle: React.CSSProperties = {
    fill: 'rgba(255, 250, 240, 0.15)',
    stroke: 'rgba(255, 250, 240, 0.35)',
    strokeWidth: 3.6,
    strokeLinecap: 'round',
    filter: 'url(#acrylicNoise)',
  };

  const thinLineStyle: React.CSSProperties = {
    fill: 'rgba(255, 220, 150, 0.4)',
    stroke: 'none',
  };

  return (
    <>
      <style>{`
        .danger-border {
          box-sizing: border-box;
          border: 5px solid transparent;
          border-image: repeating-linear-gradient(
            45deg,
            #ff8c00 0px,
            #ff8c00 10px,
            #000000 10px,
            #000000 20px
          ) 5;
        }
      `}</style>
      <div style={containerStyle} className="danger-border">
        <svg viewBox="0 0 100 100" style={{ width: clockSize, height: clockSize, display: 'block' }}>
        
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
          style={glassStyle}
          transform={`rotate(${hourDeg} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="26"
          stroke="rgba(255, 200, 100, 0.5)"
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
          style={minuteGlassStyle}
          transform={`rotate(${minuteDeg} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="12"
          stroke="rgba(255, 200, 100, 0.5)"
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
          style={{ 
            // We remove the CSS transition for the second hand 
            // and rely on the high-frequency updates of useClockTime 
            // for a "true" sweep feel without the reset glitch.
            willChange: 'transform' 
          }}
        />

        {/* Center Pivot */}
        <circle cx="50" cy="50" r="0.5" fill="#938F8F" />
        <circle cx="50" cy="50" r="0.3" fill="#ff3b30" />
      </svg>
      </div>
    </>
  );
};

export default Clock;
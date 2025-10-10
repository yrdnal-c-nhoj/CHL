import React, { useEffect, useState } from 'react';
import cinzel20251010 from './d1.ttf'; // Hours font
import roboto20251010 from './d2.otf'; // Minutes font
import orbitron20251010 from './d3.otf'; // Seconds font

export default function ConcentricClock() {
  const [currentTime, setCurrentTime] = useState({ h: 0, m: 0, s: 0 });
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'HoursFont';
        src: url(${cinzel20251010}) format('truetype');
        font-display: swap;
      }
      @font-face {
        font-family: 'MinutesFont';
        src: url(${roboto20251010}) format('opentype');
        font-display: swap;
      }
      @font-face {
        font-family: 'SecondsFont';
        src: url(${orbitron20251010}) format('opentype');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;
    
    const getTime = () => {
      const now = new Date();
      setCurrentTime({
        h: now.getHours() % 12 || 12,
        m: now.getMinutes(),
        s: now.getSeconds()
      });
    };

    getTime();
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, [fontsLoaded]);

  const renderRing = (count, radius, type) => {
    const items = [];
    const current = currentTime[type];
    const fontFamily = type === 'h' ? 'HoursFont' : type === 'm' ? 'MinutesFont' : 'SecondsFont';
    
    // Offset so current time aligns at 0 degrees (right side)
    const currentOffset = (360 / count) * current;

    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i - currentOffset;
      const rad = (angle * Math.PI) / 180;
      const x = radius * Math.cos(rad);
      const y = radius * Math.sin(rad);
      
      const value = type === 'h' ? (i === 0 ? 12 : i) : i;
      const isActive = type === 'h' ? value === current : i === current;

      items.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            fontFamily: fontFamily,
            fontSize: type === 'h' ? '3rem' : type === 'm' ? '1.5rem' : '1.2rem',
            fontWeight: isActive ? 900 : 400,
            color: isActive ? '#2F032EFF' : type === 'h' ? '#FF0000' : type === 'm' ? '#00AA00' : '#0000FF',
            transition: 'all 0.3s ease',
          }}
        >
          {value}
        </div>
      );
    }
    return items;
  };

  if (!fontsLoaded) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #EDEDAEFF, #EDE7C3FF, #F1EBC5FF, #E9F5B4FF)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 20s ease infinite',
        overflow: 'hidden',
      }}
    >
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <div style={{ position: 'relative', width: '800px', height: '800px' }}>
        {/* Hours - inner ring */}
        {renderRing(12, 145, 'h')}
        
        {/* Minutes - middle ring */}
        {renderRing(60, 180, 'm')}
        
        {/* Seconds - outer ring */}
        {renderRing(60, 216, 's')}
      </div>
    </div>
  );
}
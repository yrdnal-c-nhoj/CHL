import React, { useEffect, useState } from 'react';
import cinzel20251010 from './d1.ttf';
import roboto20251010 from './d2.otf';
import orbitron20251010 from './d3.otf';

export default function ConcentricClock() {
  const [currentTime, setCurrentTime] = useState({ h: 0, m: 0, s: 0 });
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Track true viewport height
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  // Load fonts
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

  // Update time every second
  useEffect(() => {
    if (!fontsLoaded) return;
    const getTime = () => {
      const now = new Date();
      setCurrentTime({
        h: now.getHours() % 12 || 12,
        m: now.getMinutes(),
        s: now.getSeconds(),
      });
    };
    getTime();
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, [fontsLoaded]);

  // Render ring with optional X/Y offsets
  const renderRing = (count, radiusVh, type, offset = { x: 0, y: 0 }) => {
    const items = [];
    const current = currentTime[type];
    const fontFamily =
      type === 'h' ? 'HoursFont' : type === 'm' ? 'MinutesFont' : 'SecondsFont';
    const currentOffset = (360 / count) * current;

    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i - currentOffset;
      const rad = (angle * Math.PI) / 180;
      const x = radiusVh * Math.cos(rad) + offset.x;
      const y = radiusVh * Math.sin(rad) + offset.y;
      const value = type === 'h' ? (i === 0 ? 12 : i) : i;
      const isActive = type === 'h' ? value === current : i === current;

      items.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(${x}vh, ${y}vh)`,
            transformOrigin: 'left center',
            fontFamily,
            fontSize:
              type === 'h' ? '7vh' : type === 'm' ? '2.5vh' : '2.2vh',
            fontWeight: isActive ? 900 : 400,
            color: isActive
              ? '#2F032EFF'
              : type === 'h'
              ? '#F0C091FF'
              : type === 'm'
              ? '#A6D2A6FF'
              : '#9797C5FF',
            transition: 'all 0.3s ease',
            textShadow: isActive
              ? `1px 1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff`
              : 'none',
            textAlign: 'left',
            whiteSpace: 'nowrap',
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
        inset: 0,
        width: '100vw',
        height: 'calc(var(--vh, 1vh) * 100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #52520AFF, #4A0512FF, #514156FF, #2D490EFF)',
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

      {/* Centered clock */}
      <div
        style={{
          position: 'relative',
          width: '100vh',
          height: '100vh',
        }}
      >
        {renderRing(12, 12, 'h', { x: -0.7, y: -3.8 })}   {/* hours nudge */}
        {renderRing(60, 19, 'm', { x: 0.1, y: 0 })}    {/* minutes nudge */}
        {renderRing(60, 28, 's', { x: -4.2, y: -0.8 })} {/* seconds nudge */}
      </div>
    </div>
  );
}

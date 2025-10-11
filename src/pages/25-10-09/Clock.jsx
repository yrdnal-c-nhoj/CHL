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
      fontSize: type === 'h' ? '17vh' : type === 'm' ? '6vh' : '6vh',
      fontWeight: isActive ? 900 : 400,
      color: isActive
        ? '#F4F149FF'
        : type === 'h'
        ? '#B69473FF'
        : type === 'm'
        ? '#799679FF'
        : '#7E7EA6FF',
      transition: 'all 0.3s ease',
      textShadow: isActive
        ? `
          1px 1px 0 #000,
          -1px 1px 0 #000,
          1px -1px 0 #000,
          -1px -1px 0 #000,

          2px 2px 0 #fff,
          -2px 2px 0 #fff,
          2px -2px 0 #fff,
          -2px -2px 0 #fff,

          1px 1px 0 #000,
          -1px 1px 0 #000,
          1px -1px 0 #000,
          -1px -1px 0 #000
        `
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
        {renderRing(12, 32, 'h', { x: -44, y: -12 })}   {/* hours nudge */}
        {renderRing(60, 49, 'm', { x: -54, y: -6 })}    {/* minutes nudge */}
        {renderRing(60, 52, 's', { x: -47, y: -8 })} {/* seconds nudge */}
      </div>
    </div>
  );
}

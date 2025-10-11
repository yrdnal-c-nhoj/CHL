import React, { useEffect, useState } from 'react';
import cinzel20251010 from './d1.ttf';
import roboto20251010 from './d2.otf';
import orbitron20251010 from './d3.otf';

export default function ConcentricClock() {
  const [currentTime, setCurrentTime] = useState({ h: 0, m: 0, s: 0 });
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'HoursFont';
        src: url(${cinzel20251010}) format('truetype');
      }
      @font-face {
        font-family: 'MinutesFont';
        src: url(${roboto20251010}) format('opentype');
      }
      @font-face {
        font-family: 'SecondsFont';
        src: url(${orbitron20251010}) format('opentype');
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
        s: now.getSeconds(),
      });
    };
    getTime();
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, [fontsLoaded]);

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

      let value;
      if (type === 'h') value = i === 0 ? 12 : i;
      else value = i.toString().padStart(2, '0');

      const isCurrent =
        (type === 'h' && value === (currentTime.h === 0 ? 12 : currentTime.h)) ||
        (type === 'm' && i === currentTime.m) ||
        (type === 's' && i === currentTime.s);

      items.push(
        <div
          key={`${type}-${i}`}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(${x}vh, ${y}vh)`,
            fontFamily,
            fontSize: type === 'h' ? '22vh' : type === 'm' ? '10vh' : '6vh',
            fontWeight: isCurrent ? 700 : 300,
            color: isCurrent ? '#fff' : 'rgba(255, 150, 200, 0.2)',
            textShadow: isCurrent
              ? '0 0 1vh #ff7bcb, 0 0 2vh #ff1493, 0 0 4vh #ff0099'
              : '0 0 0.8vh rgba(255, 100, 180, 0.15)',
            opacity: isCurrent ? 1 : 0.4,
            transition: 'all 0.4s ease',
            pointerEvents: 'none',
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
        background: 'radial-gradient(circle at center, #712A2AFF 30%, #060006 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100vh',
          height: '100vh',
        }}
      >
        {renderRing(12, 62, 'h', { x: -98, y: -34 })}
        {renderRing(60, 139, 'm', { x: -149, y: -10 })}
        {renderRing(60, 72, 's', { x: -58, y: -1 })}
      </div>
    </div>
  );
}

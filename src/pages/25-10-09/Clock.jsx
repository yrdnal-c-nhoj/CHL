import React, { useEffect, useRef, useState } from 'react';
import cinzel20251010 from './d1.ttf'; // Hours font
import roboto20251010 from './d2.otf'; // Minutes font
import orbitron20251010 from './d3.otf'; // Seconds font

export default function AnalogClock() {
  const secondRef = useRef(null);
  const minuteRef = useRef(null);
  const hourRef = useRef(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Inject fonts and background animation keyframes
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

      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);

    document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  // Clock rotation logic
  useEffect(() => {
    if (!fontsLoaded) return;

    const getTime = () => {
      const now = new Date();
      const second = now.getSeconds();
      const minute = now.getMinutes();
      const hour = now.getHours();

      if (secondRef.current)
        secondRef.current.style.transform = `rotate(${-6 * second}deg)`;
      if (minuteRef.current)
        minuteRef.current.style.transform = `rotate(${-6 * minute}deg)`;
      if (hourRef.current)
        hourRef.current.style.transform = `rotate(${-30 * hour}deg)`;
    };

    getTime();
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, [fontsLoaded]);

  // Dial configuration
  const dialConfig = {
    hour: { fontFamily: 'HoursFont', fontSize: '9vh', color: '#FF0000', fontWeight: 400, zIndex: 160 },
    minute: { fontFamily: 'MinutesFont', fontSize: '2.5vh', color: '#095A09FF', fontWeight: 300, zIndex: 120 },
    second: { fontFamily: 'SecondsFont', fontSize: '4vh', color: '#0000FF', fontWeight: 300, zIndex: 130 },
  };

  const renderDial = (count, size, type) => {
    const spans = [];
    const cfg = dialConfig[type];
    for (let s = 0; s < count; s++) {
      const rotation = type === 'hour' ? 30 * s : 6 * s;
      const content = type === 'hour' ? (s === 0 ? 12 : s) : s === 0 ? '' : s;
      spans.push(
        <span
          key={s}
          style={{
            position: 'absolute',
            width: '3vh',
            height: '3vh',
            lineHeight: '3vh',
            textAlign: 'center',
            transformOrigin: '50%',
            transform: `rotate(${rotation}deg) translateX(${size}vh)`,
            fontFamily: cfg.fontFamily,
            fontSize: cfg.fontSize,
            color: cfg.color,
            fontWeight: cfg.fontWeight,
            zIndex: cfg.zIndex,
          }}
        >
          {content}
        </span>
      );
    }
    return spans;
  };

  const renderDail = () => {
    const spans = [];
    for (let s = 0; s < 60; s++) {
      spans.push(
        <span
          key={s}
          style={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            lineHeight: '2vh',
            transformOrigin: '50%',
            textIndent: '100vh',
            overflow: 'hidden',
            transform: `rotate(${6 * s}deg) translateX(30vh)`,
            zIndex: 90,
          }}
        />
      );
    }
    return spans;
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
        background: 'linear-gradient(135deg, #95C9C2FF, #A9B073FF, #D1BB94FF, #A5C395FF)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 20s ease infinite',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100vw',
          height: '100vh',
          borderRadius: '50%',
          margin: '2vh',
          position: 'relative',
        }}
      >
        {/* Hour dial */}
        <div
          ref={hourRef}
          style={{
            width: '3vh',
            height: '3vh',
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            margin: 'auto',
            zIndex: 150,
            transition: '0.2s 0.2s ease-in',
          }}
        >
          {renderDial(12, 15, 'hour')}
        </div>

        {/* Minute dial */}
        <div
          ref={minuteRef}
          style={{
            width: '3vh',
            height: '3vh',
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            margin: 'auto',
            zIndex: 100,
            transition: '0.2s 0.2s ease-in',
          }}
        >
          {renderDial(60, 22, 'minute')}
        </div>

        {/* Second dial */}
        <div
          ref={secondRef}
          style={{
            width: '3vh',
            height: '3vh',
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            margin: 'auto',
            zIndex: 130,
            transition: '0.2s 0.2s ease-in',
          }}
        >
          {renderDial(60, 30, 'second')}
        </div>

        {/* Minute/second marks */}
        <div>{renderDail()}</div>

        {/* Thin orange line from center to right */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '50vw',
            height: '5vh',
            opacity: '0.5',
            backgroundColor: 'orange',
            transformOrigin: '0 50%',
            transform: 'translateY(-50%)',
            zIndex: 200,
          }}
        />
      </div>
    </div>
  );
}

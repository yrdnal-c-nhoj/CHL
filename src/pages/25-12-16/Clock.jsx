import React, { useState, useEffect } from 'react';
import font_2025_12_16 from '../../assets/ice.ttf';

const QuadClock = () => {
  const [time, setTime] = useState(Date.now());
  const [fontLoaded, setFontLoaded] = useState(false);

  // === Effect 1: Load custom font ===
  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace('font_2025_12_16', `url(${font_2025_12_16})`, {
          style: 'normal',
          weight: '400',
          display: 'swap',
        });

        const loadedFont = await font.load();
        document.fonts.add(loadedFont);
        setFontLoaded(true);
      } catch (err) {
        console.warn('Custom font failed to load, falling back to monospace', err);
        setFontLoaded(true); // Allow rendering with fallback
      }
    };

    loadFont();
  }, []); // Run once on mount

  // === Effect 2: Animation loop for smooth clock ===
  useEffect(() => {
    let animationId;
    const updateTime = () => {
      setTime(Date.now());
      animationId = requestAnimationFrame(updateTime);
    };
    updateTime();

    return () => cancelAnimationFrame(animationId);
  }, []); // Run once, continuously update

  // Time calculations
  const now = new Date(time);
  const milliseconds = now.getMilliseconds();
  const seconds = now.getSeconds() + milliseconds / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const hDeg = hours * 30;
  const mDeg = minutes * 6;
  const sDeg = seconds * 6;

  const CLOCK_SIZE = 130;
  const NUMBER_RADIUS = 35;

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    inset: 0,
    backgroundColor: '#475502FF',
    backgroundImage: `radial-gradient(circle, #A8784496, #3B4207DC), url("data:image/svg+xml,%3Csvg width='13' height='13' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0C6.716 0 0 6.716 0 15c8.284 0 15-6.716 15-15zM0 15c0 8.284 6.716 15 15 15 0-8.284-6.716-15-15-15zm30 0c0-8.284-6.716-15-15-15 0 8.284 6.716 15 15 15zm0 0c0 8.284-6.716 15-15 15 0-8.284-6.716-15-15-15z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
    margin: 0,
    padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  // Removed the <style> injection — FontFace API already handles it

  const handStyle = (deg, height, width, color) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    height,
    width,
    backgroundColor: color,
    borderRadius: '1vmin',
    boxShadow: `0 0 1vmin ${color}, 2px 2px 4px rgba(0,0,0,0.6)`,
  });

  const renderClockLayer = (transform, opacity = 1) => (
    <div
      style={{
        position: 'absolute',
        width: `calc(${CLOCK_SIZE}vmin - 4vmin)`,
        height: `calc(${CLOCK_SIZE}vmin - 4vmin)`,
        maxWidth: '96vw',
        maxHeight: '96vh',
        transform,
        opacity,
        pointerEvents: 'none',
      }}
    >
      {/* Numbers */}
      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
        const angle = (num * 30) * (Math.PI / 180);
        const x = 52 + NUMBER_RADIUS * Math.sin(angle);
        const y = 48 - NUMBER_RADIUS * Math.cos(angle);

        return (
          <div
            key={num}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${CLOCK_SIZE * 0.09}vmin`,
              color: '#F7F8CEFF',
              textShadow: '1px 2px 0px #333333, -1px -1px 0px #333333',
              fontFamily: fontLoaded ? 'font_2025_12_16, monospace' : 'monospace',
              opacity: fontLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            {num}
          </div>
        );
      })}

      {/* Hands */}
      <div style={handStyle(hDeg, `${CLOCK_SIZE * 0.25}vmin`, `${CLOCK_SIZE * 0.03}vmin`, '#EB31F5FF')} />
      <div style={handStyle(mDeg, `${CLOCK_SIZE * 0.38}vmin`, `${CLOCK_SIZE * 0.02}vmin`, '#41F6EDFF')} />
      <div style={handStyle(sDeg, `${CLOCK_SIZE * 0.45}vmin`, `${CLOCK_SIZE * 0.015}vmin`, '#FB6712FF')} />
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Crosshair lines */}
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: '#111010FF' }} />
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#100303FF' }} />

      {/* Four mirrored layers */}
      {renderClockLayer('scale(-1, 1)')}
      {renderClockLayer('scale(1, -1)')}
      {renderClockLayer('scale(-1, -1)')}
      {renderClockLayer('scale(1, 1)')}

      {/* Center dot */}
      <div
        style={{
          position: 'absolute',
          width: '2vmin',
          height: '2vmin',
          backgroundColor: 'white',
          borderRadius: '50%',
          zIndex: 10,
          boxShadow: '0 0 1vmin rgba(0,0,0,0.8)',
        }}
      />
    </div>
  );
};

export default QuadClock;

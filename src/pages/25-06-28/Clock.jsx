import React, { useEffect, useRef } from 'react';
import twentyFont from './twenty.otf';

const Clock24 = () => {
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();

  useEffect(() => {
    const font = new FontFace('twenty', `url(${twentyFont})`);
    font.load().then(() => document.fonts.add(font));

    const updateClock = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();
      const ms = now.getMilliseconds();

      const hourDeg = ((h % 24) + m / 60 + s / 3600) * 15;
      const minuteDeg = (m + s / 60) * 6;
      const secondDeg = (s + ms / 1000) * 6;

      if (hourRef.current) hourRef.current.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      if (secondRef.current) secondRef.current.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;

      requestAnimationFrame(updateClock);
    };

    requestAnimationFrame(updateClock);
  }, []);

  const pieSections = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360;
    return (
      <div
        key={`pie-${i}`}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%)',
          transform: `rotate(${angle}deg)`,
          transformOrigin: '50% 50%',
          background: i % 2 === 1 ? 'rgba(1, 24, 24, 0.2)' : 'transparent',
        }}
      />
    );
  });

  const numbers = Array.from({ length: 24 }, (_, i) => {
    const hour = (i % 24) || 24;
    const angle = (i / 24) * 360;
    const radius = 42;
    const x = 50 + radius * Math.sin((angle * Math.PI) / 180);
    const y = 50 - radius * Math.cos((angle * Math.PI) / 180);
    const isEven = hour % 2 === 0;

    return (
      <div
        key={`num-${hour}`}
        style={{
          position: 'absolute',
          fontSize: '6rem',
          fontFamily: 'twenty, sans-serif',
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          color: hour === 24 ? 'red' : isEven ? 'rgb(9, 9, 9)' : 'rgb(253, 249, 249)',
          textAlign: 'center',
        }}
      >
        {hour}
      </div>
    );
  });

  return (
    <div
      style={{
        margin: 0,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgb(161, 161, 160)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100vmin',
          height: '100vmin',
          borderRadius: '50%',
          overflow: 'hidden',
          fontFamily: 'twenty, sans-serif',
        }}
      >
        {pieSections}
        {numbers}
        <div
          ref={hourRef}
          style={{
            zIndex: 9,
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%) rotate(0deg)',
            width: '6.8%',
            height: '20%',
            background: 'repeating-linear-gradient(to bottom, black, black 4.167%, white 4.167%, white 8.333%)',
          }}
        />
        <div
          ref={minuteRef}
          style={{
            zIndex: 9,
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%) rotate(0deg)',
            width: '3.11%',
            height: '40%',
            background: 'repeating-linear-gradient(to bottom, black, black 4.167%, white 4.167%, white 8.333%)',
          }}
        />
        <div
          ref={secondRef}
          style={{
            zIndex: 9,
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%) rotate(0deg)',
            width: '1.7%',
            height: '50%',
            background: 'repeating-linear-gradient(to bottom, black, black 4.167%, white 4.167%, white 8.333%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '2%',
            height: '2%',
            background: 'rgb(237, 7, 15)',
            borderRadius: '50%',
            top: '49%',
            left: '49%',
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
};

export default Clock24;

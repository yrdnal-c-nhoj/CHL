/**
 * Asterisk Clock Component
 *
 * Features:
 * - Matrix-style falling character background
 * - Analog clock with custom font characters
 * - Smooth animations and transitions
 * - Responsive design
 */

import React, { useState, useEffect, useMemo, memo } from 'react';
import AsteriskFont1 from '../../../assets/fonts/26-02-17-ast.otf';
import AsteriskFont2 from '../../../assets/fonts/26-02-17-aster.otf';

/* Generate 12 unique random characters */
const generateChars = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.slice(0, 12);
};

/**
 * BackgroundGrid
 */
const BackgroundGrid = memo(({ windowSize, cellSize }) => {
  const columnCount = Math.ceil(windowSize.width / cellSize);
  const rowsPerColumn = 20;

  const streams = useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    return Array.from({ length: columnCount }, () => ({
      data: Array.from(
        { length: rowsPerColumn },
        () => chars[Math.floor(Math.random() * chars.length)],
      ),
      duration: 12 + Math.random() * 18,
      delay: Math.random() * -20,
    }));
  }, [columnCount]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        display: 'flex',
        pointerEvents: 'none',
        opacity: 0.3,
        overflow: 'hidden',
      }}
    >
      {streams.map((stream, colIdx) => (
        <div
          key={colIdx}
          style={{
            width: cellSize,
            display: 'flex',
            flexDirection: 'column',
            animation: `rain-rise ${stream.duration}s linear infinite`,
            animationDelay: `${stream.delay}s`,
          }}
        >
          {[...stream.data, ...stream.data, ...stream.data].map((char, i) => (
            <div
              key={i}
              style={{
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'AsteriskFont1',
                fontSize: '1.8rem',
                color: '#B103F6',
                userSelect: 'none',
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

/**
 * Main Clock
 */
const AsteriskClock = () => {
  const [time, setTime] = useState(new Date());

  const [clockChars, setClockChars] = useState(generateChars());

  const [visible, setVisible] = useState(true);

  const cellSize = 50;

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,

    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  /**
   * Setup fonts, resize, and clock tick
   */
  useEffect(() => {
    console.log('AsteriskClock: Component mounting');

    try {
      const style = document.createElement('style');

      style.textContent = `
        @font-face {
          font-family: 'AsteriskFont1';
          src: url('${AsteriskFont1}');
          font-display: block;
        }

        @font-face {
          font-family: 'AsteriskFont2';
          src: url('${AsteriskFont2}');
          font-display: block;
        }

        @keyframes rain-rise {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
      `;

      document.head.appendChild(style);
      console.log('AsteriskClock: Fonts loaded successfully');

      const resize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', resize);

      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);

      return () => {
        clearInterval(timer);
        window.removeEventListener('resize', resize);
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    } catch (error) {
      console.error('AsteriskClock: Error in useEffect:', error);
    }
  }, []);

  /**
   * Character fade cycle every 3 seconds
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setClockChars(generateChars());

        setVisible(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Clock hand angles
   */
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secondAngle = seconds * 6 - 90;
  const minuteAngle = minutes * 6 + seconds * 0.1 - 90;
  const hourAngle = hours * 30 + minutes * 0.5 - 90;

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#CFF6DA',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BackgroundGrid windowSize={windowSize} cellSize={cellSize} />

      <div
        style={{
          position: 'relative',
          width: 'min(75vw, 75vh)',
          height: 'min(75vw, 75vh)',
          zIndex: 10,
          border: '2px solid rgba(0,0,0,0.1)',
          borderRadius: '50%',
        }}
      >
        {/* Clock Characters */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {clockChars.map((char, i) => {
            const angle = i * 30 - 90;
            const x = 50 + 42 * Math.cos((angle * Math.PI) / 180);
            const y = 50 + 42 * Math.sin((angle * Math.PI) / 180);

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'AsteriskFont2',
                  fontSize: 'clamp(3rem, 15vh, 8rem)',
                  color: '#1C1C19',
                  textShadow: '2px 2px 0px #FBEF05',
                  userSelect: 'none',
                }}
              >
                {char}
              </div>
            );
          })}
        </div>

        {/* Clock Hands */}
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
          <line
            x1="100"
            y1="100"
            x2={100 + 30 * Math.cos((hourAngle * Math.PI) / 180)}
            y2={100 + 30 * Math.sin((hourAngle * Math.PI) / 180)}
            stroke="#333"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <line
            x1="100"
            y1="100"
            x2={100 + 45 * Math.cos((minuteAngle * Math.PI) / 180)}
            y2={100 + 45 * Math.sin((minuteAngle * Math.PI) / 180)}
            stroke="#333"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />

          <line
            x1="100"
            y1="100"
            x2={100 + 55 * Math.cos((secondAngle * Math.PI) / 180)}
            y2={100 + 55 * Math.sin((secondAngle * Math.PI) / 180)}
            stroke="#ff3333"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default AsteriskClock;

import React, { useState, useEffect, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
// Use the original fonts - they're not corrupted
import AsteriskFont1 from '../../../../assets/fonts/26-02-17-ast.otf?url';
import AsteriskFont2 from '../../../../assets/fonts/26-02-17-aster.otf?url';

/**
 * Types and Interfaces
 */
interface WindowSize {
  width: number;
  height: number;
}

interface StreamData {
  chars: string[];
  duration: number;
  delay: number;
  easing: string;
}

interface BackgroundGridProps {
  windowSize: WindowSize;
  cellSize: number;
}

/**
 * Helper to generate 12 random unique characters for the clock face
 */
const generateChars = (): string[] => {
  const charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  for (let i = charPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [charPool[i], charPool[j]] = [charPool[j], charPool[i]];
  }
  return charPool.slice(0, 12).filter(char => char !== undefined);
};

/**
 * Falling Character Background Component
 */
const BackgroundGrid: React.FC<BackgroundGridProps> = ({ windowSize, cellSize }) => {
  const columnCount = Math.ceil(windowSize.width / cellSize);
  const rowsPerColumn = 20;

  // Memoize streams so they don't rerender every second with the clock
  const streams = useMemo(() => {
    return Array.from({ length: columnCount }, (): StreamData => ({
      chars: Array.from({ length: rowsPerColumn }, () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return chars[Math.floor(Math.random() * chars.length)];
      }),
      duration: 20 + Math.random() * 30,
      delay: Math.random() * -30,
      easing: ['ease-in-out', 'ease-out', 'ease-in', 'ease-in-out'][Math.floor(Math.random() * 4)] || 'ease-in-out',
    }));
  }, [columnCount]);

  return (
    <>
      <style>
        {`
          @keyframes rain-rise {
            0% {
              transform: translateY(100%);
            }
            20% {
              transform: translateY(60%) translateY(-8px);
            }
            40% {
              transform: translateY(30%) translateY(4px);
            }
            60% {
              transform: translateY(10%) translateY(-6px);
            }
            80% {
              transform: translateY(-10%) translateY(3px);
            }
            100% {
              transform: translateY(-100%);
            }
          }
        `}
      </style>
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        display: 'flex',
        pointerEvents: 'none',
        opacity: 0.3,
        overflow: 'hidden'
      }}>
      {streams.map((stream, colIdx) => (
        <div
          key={colIdx}
          style={{
            width: cellSize,
            display: 'flex',
            flexDirection: 'column',
            animation: `rain-rise ${stream.duration}s ${stream.easing} infinite`,
            animationDelay: `${stream.delay}s`,
          }}
        >
          {/* Triple the data to ensure seamless looping in the translateY(-50%) animation */}
          {[...stream.chars, ...stream.chars, ...stream.chars].map((char, i) => (
            <div
              key={i}
              style={{
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'AsteriskFont1, sans-serif',
                fontSize: '1.8rem',
                color: '#B103F6',
                userSelect: 'none'
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
    </>
  );
};

/**
 * Main Asterisk Clock Component
 */
const AsteriskClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [clockChars, setClockChars] = useState<string[]>(generateChars());
  const [visible, setVisible] = useState<boolean>(true);
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  const cellSize = 50;
  
  // Font loading configuration - same pattern as other working components
  const fontConfigs = useMemo(() => [
    { fontFamily: 'AsteriskFont1', fontUrl: AsteriskFont1, options: { weight: 'normal', style: 'normal' } },
    { fontFamily: 'AsteriskFont2', fontUrl: AsteriskFont2, options: { weight: 'normal', style: 'normal' } }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  /**
   * Setup event listeners
   */
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    const clockTimer = setInterval(() => setTime(new Date()), 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(clockTimer);
    };
  }, []);

  /**
   * Character Shuffle Cycle
   */
  useEffect(() => {
    const shuffleInterval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setClockChars(generateChars());
        setVisible(true);
      }, 400);
    }, 3000);

    return () => clearInterval(shuffleInterval);
  }, []);

  // Clock Hand Calculations
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secondAngle = seconds * 6 - 90;
  const minuteAngle = minutes * 6 + seconds * 0.1 - 90;
  const hourAngle = hours * 30 + minutes * 0.5 - 90;

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      backgroundColor: '#CFF6DA',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <BackgroundGrid windowSize={windowSize} cellSize={cellSize} />

      <div style={{
        position: 'relative',
        width: 'min(75vw, 75vh)',
        height: 'min(75vw, 75vh)',
        zIndex: 10,
        border: '2px solid rgba(0,0,0,0.05)',
        borderRadius: '50%'
      }}>
        {/* Clock Characters (Numbers) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease'
        }}>
          {clockChars.map((char, i) => {
            const angle = i * 30 - 90;
            const x = 50 + 42 * Math.cos(angle * Math.PI / 180);
            const y = 50 + 42 * Math.sin(angle * Math.PI / 180);

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'AsteriskFont2, sans-serif',
                  fontSize: 'clamp(3rem, 14vh, 8rem)',
                  color: '#1C1C19',
                  textShadow: '2px 2px 0px #FBEF05',
                  userSelect: 'none'
                }}
              >
                {char}
              </div>
            );
          })}
        </div>

        {/* Analog Hands SVG */}
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          {/* Hour Hand */}
          <line
            x1="100" y1="100"
            x2={100 + 30 * Math.cos(hourAngle * Math.PI / 180)}
            y2={100 + 30 * Math.sin(hourAngle * Math.PI / 180)}
            stroke="#333" strokeWidth="6" strokeLinecap="round"
          />
          {/* Minute Hand */}
          <line
            x1="100" y1="100"
            x2={100 + 45 * Math.cos(minuteAngle * Math.PI / 180)}
            y2={100 + 45 * Math.sin(minuteAngle * Math.PI / 180)}
            stroke="#333" strokeWidth="4" strokeLinecap="round" opacity="0.8"
          />
          {/* Second Hand */}
          <line
            x1="100" y1="100"
            x2={100 + 55 * Math.cos(secondAngle * Math.PI / 180)}
            y2={100 + 55 * Math.sin(secondAngle * Math.PI / 180)}
            stroke="#ff3333" strokeWidth="2" strokeLinecap="round"
          />
          {/* Center Pin */}
          <circle cx="100" cy="100" r="3" fill="#333" />
        </svg>
      </div>
    </div>
  );
};

export default AsteriskClock;
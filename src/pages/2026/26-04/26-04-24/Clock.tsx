import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import fontUrl from '@/assets/fonts/2026/26-04-24-lissa.ttf';

/**
 * Utility to pad time numbers
 */
const formatTime = (num: number): string => num.toString().padStart(2, '0');

/**
 * Configuration Parameters
 * a/b = 3/2 creates the classic "pretzel" Lissajous knot
 */
const PARAMS = {
  a: 3,
  b: 2,
  delta: Math.PI / 2, 
  animationLength: 129, // Slightly slower for better readability
  spacing: 0.009,      // Spacing between characters
  clockCount: 12,      // Total instances of the time string
};

/**
 * Generates the SVG path string for a Lissajous curve based on container dimensions
 */
const generateLissajousPath = (width: number, height: number): string => {
  const { a, b, delta } = PARAMS;
  const numPoints = 120; 
  const pad = Math.min(width, height) * 0.15; // Slightly more padding
  const scaleX = (width - pad) / 2;
  const scaleY = (height - pad) / 2;
  const cx = width / 2;
  const cy = height / 2;

  let d = "";
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * 2 * Math.PI;
    const x = cx + scaleX * Math.sin(a * t + delta);
    const y = cy + scaleY * Math.sin(b * t);
    d += (i === 0 ? "M " : " L ") + `${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + " Z";
};

const LissajousClock: React.FC = () => {
  const time = useClockTime();
  const containerRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<string>('');
  
  // Format time string with trailing space for separation
  const timeString = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    return `${h}:${m}:${s}   `; 
  }, [time]);

  // Handle responsive path regeneration
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setPath(generateLissajousPath(clientWidth, clientHeight));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clockTrains = Array.from({ length: PARAMS.clockCount });

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw',
      background: 'linear-gradient(188deg, #818C9B 0%, #F3A8E9 50% , #CCABC1   100%)',
      overflow: 'hidden',
      cursor: 'none'
    }}>
      <style>{`
        @font-face {
          font-family: 'LissaFont';
          src: url('${fontUrl}') format('truetype');
        }
        @keyframes movePath {
          0% { offset-distance: 0%;  }
          100% { offset-distance: 100%;  }
        }
      `}</style>
      
      <div 
        ref={containerRef}
        style={{
          width: '85vw',
          height: '85vh',
          margin: 'auto',
          position: 'relative',
        }}
      >
        {path && clockTrains.map((_, trainIndex) => {
          const trainOffset = trainIndex / PARAMS.clockCount;
          
          return (
            <React.Fragment key={`train-${trainIndex}`}>
              {timeString.split('').map((char, charIndex) => {
                // Calculate delay so each character follows the previous one
                const delay = (trainOffset + (charIndex * PARAMS.spacing)) * PARAMS.animationLength;
                
                return (
                  <span
                    key={`${trainIndex}-${charIndex}`}
                    style={{
                      position: 'absolute',
                      color: '#3E5204',
                      fontFamily: 'LissaFont, system-ui, sans-serif',
                      fontSize: 'clamp(14px, 6vmin, 40px)',
                      whiteSpace: 'pre',
                      offsetPath: `path("${path}")`,
                      animation: `movePath ${PARAMS.animationLength}s linear infinite`,
                      animationDelay: `-${delay}s`,
                      willChange: 'offset-distance',
                      pointerEvents: 'none',
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default LissajousClock;
import React, { useMemo } from 'react';
import { useClockTime, calculateAngles } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import seFont from '@/assets/fonts/26-04-16-se.ttf';
import bgImage from '@/assets/images/2026/26-04/26-04-16/jamine.webp';
import tileImage from '@/assets/images/2026/26-04/26-04-16/pom.webp';

const ROMAN_NUMERALS = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

const Clock: React.FC = () => {
  const time = useClockTime();
  const angles = useMemo(() => calculateAngles(time), [time]);

  // Load custom font
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'SEClock', fontUrl: seFont }
  ], []);
  useSuspenseFontLoader(fontConfigs);

  // Constants for layout
  const clockSize = 70;
  const center = 50;
  const numeralRadius = 42; // Adjusted for better fit within the viewport

  // Memoize numerals to prevent re-calculation on every tick
  const numerals = useMemo(() => {
    return ROMAN_NUMERALS.map((numeral, index) => {
      const angle = (index * 30 - 90) * (Math.PI / 180);
      const x = center + Math.cos(angle) * numeralRadius;
      const y = center + Math.sin(angle) * numeralRadius;
      const rotation = index * 30;
      return { numeral, x, y, rotation };
    });
  }, [numeralRadius]);

  // Memoize the background tiles (expensive loop)
  const backgroundTiles = useMemo(() => {
    const tiles = [];
    const gap = 100;
    
    for (let ring = 1; ring < 10; ring++) {
      const ringOffset = ring * gap;
      const tilesPerSide = ring * 2;
      
      for (let side = 0; side < 4; side++) {
        for (let pos = 0; pos < tilesPerSide; pos++) {
          const offset = (pos - ring + 0.5) * gap;
          let left, top;
          
          switch (side) {
            case 0: left = `calc(50% + ${offset}px - 50px)`; top = `calc(50% - ${ringOffset}px - 50px)`; break;
            case 1: left = `calc(50% + ${ringOffset}px - 50px)`; top = `calc(50% + ${offset}px - 50px)`; break;
            case 2: left = `calc(50% + ${offset}px - 50px)`; top = `calc(50% + ${ringOffset}px - 50px)`; break;
            case 3: left = `calc(50% - ${ringOffset}px - 50px)`; top = `calc(50% + ${offset}px - 50px)`; break;
            default: left = '0'; top = '0';
          }
          
          tiles.push(
            <img
              key={`${ring}-${side}-${pos}`}
              src={tileImage}
              alt=""
              className="rotating-tile"
              style={{ left, top }}
            />
          );
        }
      }
    }
    return tiles;
  }, []);

  return (
    <div className="clock-viewport">
      <style>{`
        .clock-viewport {
          width: 100vw;
          height: 100dvh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          background: radial-gradient(circle, #F6EA09 0%, #CE8C09 80%, #8B5E00 100%);
          margin: 0;
          padding: 0;
        }

        @keyframes rotateTile {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .tile-container {
          position: absolute;
          width: 300vw;
          height: 300vh;
          left: -100vw;
          top: -100vh;
          z-index: 0;
        }

        .rotating-tile {
          position: absolute;
          width: 100px;
          height: 100px;
          object-fit: cover;
          animation: rotateTile 60s linear infinite;
        }

        @keyframes rotateCounterClockwise {
          from { transform: rotate(90deg); }
          to { transform: rotate(-270deg); }
        }

        .base-image-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: url(${bgImage});
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          animation: rotateCounterClockwise 60s linear infinite;
          z-index: 1;
        }

        @keyframes windFlow {
          0% { transform: translateX(-100%) skewX(-12deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateX(100vw) skewX(-12deg); opacity: 0; }
        }

        .wind-streak {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(149, 213, 178, 0.4), rgba(233, 196, 106, 0.3), transparent);
          border-radius: 2px;
          animation: windFlow 8s linear infinite;
          pointer-events: none;
          z-index: 2;
        }
      `}</style>

      {/* Tiles Layer */}
      <div className="tile-container">
        <img src={tileImage} alt="" className="rotating-tile" style={{ left: 'calc(50% - 50px)', top: 'calc(50% - 50px)' }} />
        {backgroundTiles}
      </div>

      {/* Center Image Layer */}
      <div className="base-image-layer" />

   

      {/* Clock Face */}
      <div
        style={{
          position: 'relative',
          width: `${clockSize}vmin`,
          height: `${clockSize}vmin`,
          zIndex: 10,
        }}
      >
        {numerals.map(({ numeral, x, y, rotation }, index) => (
          <span
            key={index}
            style={{
              position: 'absolute',
              fontFamily: 'SEClock, serif',
              fontSize: 'clamp(3rem, 6vw, 6rem)',
              color: '#D5ECE2',
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              textShadow: '1px 1px 12px rgb(64, 224, 208), 0 8px 1px rgba(0,0,0,0.8)',
            }}
          >
            {numeral}
          </span>
        ))}

        {/* Hour Hand */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transformOrigin: 'bottom center',
            width: '6px',
            height: '22%',
            background: 'linear-gradient(to top, #1b5e3f 0%, #40916c 50%, #74c69d 100%)',
            transform: `translate(-50%, -100%) rotate(${angles.hour}deg)`,
            boxShadow: '0 0 8px rgba(0,0,0,0.5)',
            zIndex: 13,
            borderRadius: '4px',
          }}
        />

        {/* Minute Hand */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transformOrigin: 'bottom center',
            width: '4px',
            height: '35%',
            background: 'linear-gradient(to top, #2d6a4f 0%, #52b788 50%, #95d5b2 100%)',
            transform: `translate(-50%, -100%) rotate(${angles.minute}deg)`,
            boxShadow: '0 0 8px rgba(0,0,0,0.5)',
            zIndex: 12,
            borderRadius: '3px',
          }}
        />

        {/* Second Hand */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transformOrigin: 'bottom center',
            width: '2px',
            height: '40%',
            background: 'linear-gradient(to top, #e07a5f 0%, #f4a261 50%, #e9c46a 100%)',
            transform: `translate(-50%, -100%) rotate(${angles.second}deg)`,
            boxShadow: '0 0 6px rgba(184,80,80,0.6)',
            zIndex: 11,
          }}
        />

        {/* Center Cap */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '16px',
            height: '16px',
            background: 'radial-gradient(circle at 30% 30%, #74c69d 0%, #2d6a4f 100%)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px rgba(0,0,0,0.8)',
            zIndex: 14,
          }}
        />
      </div>
    </div>
  );
};

export default Clock;
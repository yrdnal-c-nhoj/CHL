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

  // Load the custom font for this date
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'SEClock', fontUrl: seFont }
  ], []);
  useSuspenseFontLoader(fontConfigs);

  const angles = useMemo(() => calculateAngles(time), [time]);

  const clockSize = 70;
  const center = 50;
  const numeralRadius = 60;

  // Calculate position and rotation for each Roman numeral around the perimeter
  const numerals = useMemo(() => {
    return ROMAN_NUMERALS.map((numeral, index) => {
      const angle = (index * 30 - 90) * (Math.PI / 180);
      const x = center + Math.cos(angle) * numeralRadius;
      const y = center + Math.sin(angle) * numeralRadius;
      const rotation = index * 30; // Rotate to align with perimeter
      return { numeral, x, y, rotation };
    });
  }, []);

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#CE8C09',
    margin: 0,
    padding: 0,
  };

  const numeralStyle: React.CSSProperties = {
    position: 'absolute',
    fontFamily: 'SEClock, serif',
    fontSize: 'clamp(2rem, 4.5vw, 4.5rem)',
    color: '#D5ECE2',
    transform: 'translate(-50%, -50%)',
    textShadow: '0 0 12px rgba(64, 224, 208, 0.89), 0 2px 4px rgba(0,0,0,0.2)',
  };

  const handBaseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${center}%`,
    top: `${center}%`,
    transformOrigin: 'bottom center',
    borderRadius: '2px',
  };

  return (
    <div style={containerStyle}>
      {/* Tiled rotating images layer */}
      <style>{`
        @keyframes rotateTile {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          left: '-10%',
          top: '-10%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 200px)',
          gridTemplateRows: 'repeat(auto-fill, 200px)',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '200px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={tileImage}
              alt=""
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                animation: 'rotateTile 60s linear infinite',
              }}
            />
          </div>
        ))}
      </div>
      {/* Base image layer */}
      <style>{`
        @keyframes rotateCounterClockwise {
          from { transform: rotate(90deg); }
          to { transform: rotate(-270deg); }
        }
      `}</style>
      <div
        style={{
          position: 'absolute',
          width: '140%',
          height: '140%',
          left: '-20%',
          top: '-20%',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: 'rotateCounterClockwise 60s linear infinite',
        }}
      />
    
      {/* Animated wind streaks - southeast breeze flowing */}
      <style>{`
        @keyframes windFlow {
          0% { transform: translateX(-100%) skewX(-12deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateX(100vw) skewX(-12deg); opacity: 0; }
        }
        @keyframes windDrift {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .wind-streak {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(149, 213, 178, 0.4), rgba(233, 196, 106, 0.3), transparent);
          border-radius: 2px;
          animation: windFlow 8s linear infinite;
          pointer-events: none;
        }
        .wind-streak:nth-child(1) { top: 15%; width: 200px; animation-delay: 0s; }
        .wind-streak:nth-child(2) { top: 25%; width: 300px; animation-delay: 2s; animation-duration: 10s; }
        .wind-streak:nth-child(3) { top: 40%; width: 150px; animation-delay: 4s; animation-duration: 7s; }
        .wind-streak:nth-child(4) { top: 55%; width: 250px; animation-delay: 1s; animation-duration: 9s; }
        .wind-streak:nth-child(5) { top: 70%; width: 180px; animation-delay: 3s; animation-duration: 8s; }
        .wind-streak:nth-child(6) { top: 85%; width: 220px; animation-delay: 5s; animation-duration: 11s; }
      `}</style>
      <div className="wind-streak" style={{ left: '-200px' }} />
      <div className="wind-streak" style={{ left: '-300px' }} />
      <div className="wind-streak" style={{ left: '-150px' }} />
      <div className="wind-streak" style={{ left: '-250px' }} />
      <div className="wind-streak" style={{ left: '-180px' }} />
      <div className="wind-streak" style={{ left: '-220px' }} />
      <div
        style={{
          position: 'relative',
          width: `${clockSize}vmin`,
          height: `${clockSize}vmin`,
          borderRadius: '50%',
       }}
      >
        {/* Roman Numerals */}
        {numerals.map(({ numeral, x, y, rotation }, index) => (
          <span
            key={index}
            style={{
              ...numeralStyle,
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
          >
            {numeral}
          </span>
        ))}

        {/* Hour Hand */}
        <div
          style={{
            ...handBaseStyle,
            width: '6px',
            height: '25%',
            background: 'linear-gradient(to top, #1b5e3f 0%, #40916c 50%, #74c69d 100%)',
            transform: `translate(-50%, -100%) rotate(${angles.hour}deg)`,
            boxShadow: '0 0 8px rgba(0,0,0,0.5)',
            zIndex: 3,
          }}
        />

        {/* Minute Hand */}
        <div
          style={{
            ...handBaseStyle,
            width: '4px',
            height: '38%',
            background: 'linear-gradient(to top, #2d6a4f 0%, #52b788 50%, #95d5b2 100%)',
            transform: `translate(-50%, -100%) rotate(${angles.minute}deg)`,
            boxShadow: '0 0 8px rgba(0,0,0,0.5)',
            zIndex: 2,
          }}
        />

        {/* Second Hand */}
        <div
          style={{
            ...handBaseStyle,
            width: '2px',
            height: '42%',
            background: 'linear-gradient(to top, #e07a5f 0%, #f4a261 50%, #e9c46a 100%)',
            transform: `translate(-50%, -100%) rotate(${angles.second}deg)`,
            boxShadow: '0 0 6px rgba(184,80,80,0.6)',
            zIndex: 1,
          }}
        />

        {/* Center Cap */}
        <div
          style={{
            position: 'absolute',
            left: `${center}%`,
            top: `${center}%`,
            width: '14px',
            height: '14px',
            background: 'radial-gradient(circle at 30% 30%, #74c69d 0%, #2d6a4f 100%)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px rgba(0,0,0,0.8)',
            zIndex: 4,
          }}
        />

      </div>
    </div>
  );
};

export default Clock;

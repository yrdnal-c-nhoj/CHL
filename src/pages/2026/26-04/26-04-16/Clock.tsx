import React, { useMemo } from 'react';
import { useClockTime, calculateAngles } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import seFont from '@/assets/fonts/26-04-16-se.ttf';

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
  const numeralRadius = 30;

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
    backgroundColor: '#1a1a1a',
    margin: 0,
    padding: 0,
  };

  const numeralStyle: React.CSSProperties = {
    position: 'absolute',
    fontFamily: 'SEClock, serif',
    fontSize: 'clamp(1rem, 3.5vw, 2.5rem)',
    color: '#e8e0d0',
    transform: 'translate(-50%, -50%)',
    textShadow: '0 0 10px rgba(232, 224, 208, 0.3)',
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
      <div
        style={{
          position: 'relative',
          width: `${clockSize}vmin`,
          height: `${clockSize}vmin`,
          borderRadius: '50%',
          border: '3px solid #8b7355',
          boxShadow: `
            0 0 30px rgba(139, 115, 85, 0.3),
            inset 0 0 60px rgba(0, 0, 0, 0.5),
            0 0 0 8px #1a1a1a,
            0 0 0 11px #5a4a3a
          `,
          background: 'radial-gradient(circle at center, #2a2520 0%, #1a1815 100%)',
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
            background: 'linear-gradient(to top, #8b7355 0%, #c4a77d 100%)',
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
            background: 'linear-gradient(to top, #a09070 0%, #d4c4a0 100%)',
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
            background: 'linear-gradient(to top, #b85050 0%, #ff8080 100%)',
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
            background: 'radial-gradient(circle at 30% 30%, #d4c4a0 0%, #5a4a3a 100%)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px rgba(0,0,0,0.8)',
            zIndex: 4,
          }}
        />

        {/* Decorative tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          if (i % 5 === 0) return null;
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const r1 = 46;
          const r2 = 47;
          const x1 = center + Math.cos(angle) * r1;
          const y1 = center + Math.sin(angle) * r1;
          const x2 = center + Math.cos(angle) * r2;
          const y2 = center + Math.sin(angle) * r2;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x1}%`,
                top: `${y1}%`,
                width: `${x2 - x1}%`,
                height: `${y2 - y1}%`,
                transform: `rotate(${i * 6}deg)`,
                transformOrigin: `${center - x1}% ${center - y1}%`,
                background: '#5a4a3a',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Clock;

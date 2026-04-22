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
  
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'SEClock', fontUrl: seFont }
  ], []);
  useSuspenseFontLoader(fontConfigs);

  const angles = useMemo(() => calculateAngles(time), [time]);

  const numerals = useMemo(() => {
    const center = 50;
    const radius = 60;
    return ROMAN_NUMERALS.map((numeral, index) => {
      const angle = (index * 30 - 90) * (Math.PI / 180);
      return {
        numeral,
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        rotation: index * 30,
      };
    });
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100dvh', display: 'flex', justifyContent: 'center',
      alignItems: 'center', position: 'relative', overflow: 'hidden', backgroundColor: '#CE8C09'
    }}>
      <style>{`
        @keyframes rotateCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rotateCCW { from { transform: rotate(90deg); } to { transform: rotate(-270deg); } }
        @keyframes windFlow {
          0% { transform: translate3d(-100%, 0, 0) skewX(-12deg); opacity: 0; }
          15% { opacity: 0.3; }
          85% { opacity: 0.3; }
          100% { transform: translate3d(100vw, 0, 0) skewX(-12deg); opacity: 0; }
        }
        .hand { 
          position: absolute; left: 50%; top: 50%; 
          transform-origin: bottom center; border-radius: 2px;
          transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44);
          will-change: transform;
        }
      `}</style>

      {/* Optimized Tiled Layer */}
      <div style={{
        position: 'absolute', width: '300vmax', height: '300vmax',
        backgroundImage: `url(${tileImage})`, backgroundSize: '100px 100px',
        animation: 'rotateCW 60s linear infinite', opacity: 0.7, will-change: 'transform'
      }} />

      {/* Rotating Background Image */}
      <div style={{
        position: 'absolute', width: '140%', height: '140%',
        backgroundImage: `url(${bgImage})`, backgroundSize: 'contain',
        backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
        animation: 'rotateCCW 60s linear infinite', will-change: 'transform'
      }} />

      {/* Wind Streaks */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="wind-streak" style={{
          position: 'absolute', height: '2px', pointerEvents: 'none',
          width: `${150 + (i * 30)}px`, top: `${15 + (i * 14)}%`,
          background: 'linear-gradient(90deg, transparent, rgba(149, 213, 178, 0.4), transparent)',
          animation: `windFlow ${7 + i}s linear infinite`,
          animationDelay: `${i * 0.8}s`
        }} />
      ))}

      {/* Clock Face Container */}
      <div style={{ position: 'relative', width: '70vmin', height: '70vmin' }}>
        {numerals.map(({ numeral, x, y, rotation }, i) => (
          <span key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            fontFamily: 'SEClock, serif', fontSize: 'clamp(3rem, 6vw, 6rem)',
            color: '#D5ECE2', transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            textShadow: '1px 1px 12px rgb(64, 224, 208), 0 11px 1px rgb(0, 0, 0)',
            zIndex: 5
          }}>
            {numeral}
          </span>
        ))}

        {/* Hands */}
        <div className="hand" style={{
          width: '6px', height: '25%', zIndex: 8,
          background: 'linear-gradient(to top, #1b5e3f, #74c69d)',
          transform: `translate(-50%, -100%) rotate(${angles.hour}deg)`,
        }} />
        <div className="hand" style={{
          width: '4px', height: '38%', zIndex: 7,
          background: 'linear-gradient(to top, #2d6a4f, #95d5b2)',
          transform: `translate(-50%, -100%) rotate(${angles.minute}deg)`,
        }} />
        <div className="hand" style={{
          width: '2px', height: '42%', zIndex: 6,
          background: 'linear-gradient(to top, #e07a5f, #e9c46a)',
          transform: `translate(-50%, -100%) rotate(${angles.second}deg)`,
        }} />

        {/* Center Cap */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', width: '14px', height: '14px',
          background: 'radial-gradient(circle at 30% 30%, #74c69d, #2d6a4f)',
          borderRadius: '50%', transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px rgba(0,0,0,0.8)', zIndex: 10
        }} />
      </div>
    </div>
  );
};

export default Clock;
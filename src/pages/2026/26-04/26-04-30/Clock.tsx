import React, { useMemo, useState, useCallback } from 'react';
import pleiadesBg from '@/assets/images/2026/26-04/26-04-30/pleiades.webp';
import pleiadesFont from '@/assets/fonts/2026/26-04-30-pleides.otf';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

// Pleiades constellation: 6 elements (4 digits + A/P + M)
const positions = [
  { top: '25%', left: '50%' },    // Hour tens (top)
  { top: '42%', left: '35%' },    // Hour ones (left)
  { top: '45%', left: '50%' },    // Minute ones (center) - swapped
  { top: '40%', left: '65%' },    // Minute tens (right) - swapped
  { top: '60%', left: '38%' },    // A/P indicator (bottom left)
  { top: '60%', left: '62%' },    // M indicator (bottom right)
] as const;

// Pre-generated starfield with variety
const STAR_COUNT = 300;
type AnimType = 'twinkle' | 'pulse' | 'flicker';
type ColorType = 'white' | 'blue' | 'gold';
const STARS = Array.from({ length: STAR_COUNT }, (_, i) => {
  const seed = i * 9301 + 49297;
  const rand = (n: number) => ((seed * n * 16807) % 2147483647) / 2147483647;
  let animType: AnimType = 'twinkle';
  const animRoll = rand(6);
  if (animRoll > 0.7) animType = 'pulse';
  else if (animRoll > 0.5) animType = 'flicker';
  let colorType: ColorType = 'white';
  const colorRoll = rand(7);
  if (colorRoll > 0.85) colorType = 'blue';
  else if (colorRoll > 0.7) colorType = 'gold';
  return {
    id: i,
    top: `${rand(1) * 100}%`,
    left: `${rand(2) * 100}%`,
    size: rand(3) * 3 + 0.5,
    opacity: rand(4) * 0.6 + 0.4,
    delay: rand(5) * 5,
    duration: rand(8) * 2 + 2,
    animType,
    colorType,
  };
});

// Parallel shooting star pairs (6 pairs = 12 stars)
type StarPair = {
  id: number;
  startX: string;
  startY: string;
  angle: number;
  duration: number;
  length: number;
  distance: number;
  key: number; // Force re-render on angle change
};

// Generate truly random shooting star pair
const generateRandomPair = (id: number, key: number): StarPair => {
  // Truly random values that change every time
  return {
    id,
    startX: `${Math.random() * 100}%`,
    startY: `${Math.random() * 100}%`,
    angle: Math.random() * 360,
    duration: Math.random() * 0.8 + 0.3,
    length: Math.random() * 150 + 50,
    distance: Math.random() * 80 + 30,
    key,
  };
};

// Initialize with random pairs
const INITIAL_PAIRS = Array.from({ length: 6 }, (_, i) =>
  generateRandomPair(i, 0)
);

const fontConfigs: FontConfig[] = [
  { fontFamily: 'Pleiades', fontUrl: pleiadesFont }
];

const Clock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClockTime();

  // Shooting star pairs that rotate angles after each shot
  const [starPairs, setStarPairs] = useState<StarPair[]>(INITIAL_PAIRS);

  const regeneratePair = useCallback((id: number) => {
    setStarPairs((prev) =>
      prev.map((pair) =>
        pair.id === id
          ? generateRandomPair(id, pair.key + 1)
          : pair
      )
    );
  }, []);

  const { hourTens, hourOnes, minuteTens, minuteOnes, isAM } = useMemo(() => {
    let h = time.getHours();
    const isAM = h < 12;
    h = h % 12;
    if (h === 0) h = 12;
    const hStr = formatTime(h);
    const mStr = formatTime(time.getMinutes());
    return {
      hourTens: hStr[0],
      hourOnes: hStr[1],
      minuteTens: mStr[0],
      minuteOnes: mStr[1],
      isAM,
    };
  }, [time]);

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    backgroundImage: `url(${pleiadesBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  };

  const digitStyle = (index: 0 | 1 | 2 | 3): React.CSSProperties => ({
    position: 'absolute',
    top: positions[index].top,
    left: positions[index].left,
    fontSize: 'clamp(3rem, 12vw, 10rem)',
    color: '#fff',
    fontFamily: 'Pleiades, system-ui, sans-serif',
    fontWeight: 100,
    lineHeight: 1,
    textShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 60px rgba(200,220,255,0.6), 0 0 100px rgba(255,255,255,0.3)',
    transform: 'translate(-50%, -50%)',
  });

  const indicatorStyle = (index: 4 | 5, active: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: positions[index].top,
    left: positions[index].left,
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    color: active ? '#fff' : '#2a2a3a',
    fontFamily: 'Pleiades, system-ui, sans-serif',
    fontWeight: active ? 300 : 100,
    lineHeight: 1,
    transform: 'translate(-50%, -50%)',
    transition: 'color 0.5s ease, text-shadow 0.5s ease',
    textShadow: active
      ? '0 0 15px rgba(255,255,255,0.9), 0 0 40px rgba(200,220,255,0.5), 0 0 70px rgba(255,255,255,0.2)'
      : 'none',
  });

  return (
    <div style={containerStyle}>
      {STARS.map((star) => {
        const colors: Record<ColorType, string> = {
          white: '#fff',
          blue: '#a8d0ff',
          gold: '#ffd700',
        };
        const glowColors: Record<ColorType, string> = {
          white: 'rgba(255,255,255,0.6)',
          blue: 'rgba(100,180,255,0.6)',
          gold: 'rgba(255,215,0,0.5)',
        };
        const anims: Record<AnimType, string> = {
          twinkle: `twinkle ${star.duration}s infinite ${star.delay}s`,
          pulse: `pulse ${star.duration}s infinite ${star.delay}s`,
          flicker: `flicker ${star.duration * 0.7}s infinite ${star.delay}s`,
        };
        return (
          <span
            key={star.id}
            style={{
              position: 'absolute',
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              backgroundColor: colors[star.colorType],
              borderRadius: '50%',
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 3}px ${glowColors[star.colorType]}, 0 0 ${star.size * 6}px ${glowColors[star.colorType]}`,
              animation: anims[star.animType],
            }}
          />
        );
      })}
      {starPairs.map((star) => (
        <span
          key={`${star.id}-${star.key}`}
          style={{
            position: 'absolute',
            top: star.startY,
            left: star.startX,
            width: star.length,
            height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), #fff)',
            borderRadius: '50%',
            transform: `rotate(${star.angle}deg)`,
            opacity: 0,
            animation: `shoot-${star.id}-${star.key} ${star.duration}s linear forwards`,
            filter: 'blur(1px) drop-shadow(0 0 4px rgba(255,255,255,0.8))',
          }}
          onAnimationEnd={() => regeneratePair(star.id)}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; box-shadow: 0 0 4px currentColor; }
          50% { opacity: 1; box-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 0.8; }
          20%, 24%, 55% { opacity: 0.1; }
        }
        ${starPairs.map((s) => `
        @keyframes shoot-${s.id}-${s.key} {
          0% { transform: rotate(${s.angle}deg) translateX(0); opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { transform: rotate(${s.angle}deg) translateX(${s.distance}vw); opacity: 0; }
        }`).join('')}
      `}</style>
      <span style={digitStyle(0)}>{hourTens}</span>
      <span style={digitStyle(1)}>{hourOnes}</span>
      <span style={digitStyle(2)}>{minuteTens}</span>
      <span style={digitStyle(3)}>{minuteOnes}</span>
      <span style={indicatorStyle(4, true)}>{isAM ? 'A' : 'P'}</span>
      <span style={indicatorStyle(5, true)}>M</span>
    </div>
  );
};

export default Clock;

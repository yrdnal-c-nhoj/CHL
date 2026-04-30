import React, { useMemo, useState, useCallback, useEffect } from 'react';
import pleiadesBg from '@/assets/images/2026/26-04/26-04-30/pleiades.webp';
import pleiadesFont from '@/assets/fonts/2026/26-04-30-pleides.otf';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

// --- Types & Constants ---

type AnimType = 'twinkle' | 'pulse' | 'flicker';
type ColorType = 'white' | 'blue' | 'gold';

interface StarPair {
  id: number;
  startX: string;
  startY: string;
  angle: number;
  duration: number;
  length: number;
  distance: number;
  key: number;
}

const STAR_COUNT = 150;
const formatTime = (num: number): string => num.toString().padStart(2, '0');

const positions = [
  { top: '35%', left: '44%' },    // 0: Hour tens - Atlas (upper left of cluster)
  { top: '32%', left: '52%' },    // 1: Hour ones - Pleione (upper right, near Atlas)
  { top: '50%', left: '50%' },    // 2: Minute ones - Alcyone (center, brightest)
  { top: '45%', left: '58%' },    // 3: Minute tens - Merope (right of center)
  { top: '65%', left: '46%' },    // 4: A/P indicator - Electra (lower left)
  { top: '62%', left: '54%' },    // 5: M indicator - Maia (lower right)
] as const;

// --- Helper Functions ---

const generateRandomPair = (id: number, key: number): StarPair => ({
  id,
  startX: `${Math.random() * 100}%`,
  startY: `${Math.random() * 100}%`,
  angle: Math.random() * 360,
  duration: Math.random() * 0.8 + 0.4,
  length: Math.random() * 150 + 50,
  distance: Math.random() * 60 + 20,
  key,
});

// Pleiades cluster positions (7 sisters + Atlas/Pleione parents)
const PLEIADES_STARS = [
  { top: 35, left: 44, brightness: 0.9 }, // Atlas
  { top: 32, left: 52, brightness: 0.8 }, // Pleione
  { top: 50, left: 50, brightness: 1.0 }, // Alcyone (brightest)
  { top: 45, left: 58, brightness: 0.7 }, // Merope
  { top: 58, left: 42, brightness: 0.6 }, // Electra
  { top: 62, left: 56, brightness: 0.6 }, // Maia
  { top: 55, left: 48, brightness: 0.5 }, // Taygeta
  { top: 48, left: 40, brightness: 0.4 }, // Celeano
  { top: 40, left: 62, brightness: 0.4 }, // Sterope
];

const STARS = Array.from({ length: STAR_COUNT }, (_, i) => {
  const rand = Math.random;
  const animRoll = rand();
  const colorRoll = rand();

  // 70% of stars clustered around Pleiades positions, 30% scattered
  const useCluster = rand() < 0.7;
  let top, left;

  if (useCluster) {
    const clusterIndex = Math.floor(rand() * PLEIADES_STARS.length);
    const cluster = PLEIADES_STARS[clusterIndex]!;
    const spread = 6; // degrees of spread around cluster center
    top = cluster.top + (rand() * spread * 2 - spread);
    left = cluster.left + (rand() * spread * 2 - spread);
  } else {
    top = rand() * 100;
    left = rand() * 100;
  }

  return {
    id: i,
    top: `${top}%`,
    left: `${left}%`,
    size: rand() * 2.5 + 0.5,
    opacity: rand() * 0.5 + 0.4,
    delay: rand() * 5,
    duration: rand() * 3 + 2,
    animType: animRoll > 0.8 ? 'pulse' : animRoll > 0.6 ? 'flicker' : 'twinkle' as AnimType,
    colorType: colorRoll > 0.9 ? 'blue' : colorRoll > 0.8 ? 'gold' : 'white' as ColorType,
  };
});

const fontConfigs: FontConfig[] = [{ fontFamily: 'Pleiades', fontUrl: pleiadesFont }];

// --- Component ---

const PleiadesClock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClockTime();
  const [starPairs, setStarPairs] = useState<StarPair[]>(() =>
    Array.from({ length: 24 }, (_, i) => generateRandomPair(i, 0))
  );

  const regeneratePair = useCallback((id: number) => {
    // Random delay between 2-8 seconds before regenerating
    const delay = Math.random() * 6000 + 2000;
    setTimeout(() => {
      setStarPairs(prev => prev.map(p => p.id === id ? generateRandomPair(id, p.key + 1) : p));
    }, delay);
  }, []);

  const { hourTens, hourOnes, minuteTens, minuteOnes, isAM } = useMemo(() => {
    let h = time.getHours();
    const isAM = h < 12;
    h = h % 12 || 12;
    const hStr = formatTime(h);
    const mStr = formatTime(time.getMinutes());
    return { hourTens: hStr[0], hourOnes: hStr[1], minuteTens: mStr[0], minuteOnes: mStr[1], isAM };
  }, [time]);

  // Styles
  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    backgroundColor: '#02040a',
    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(30, 50, 100, 0.3), transparent), url(${pleiadesBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
  };

  const getDigitStyle = (index: number): React.CSSProperties => {
    const isCenter = index === 2; // Alcyone - brightest star
    return {
      position: 'absolute',
      top: positions[index].top,
      left: positions[index].left,
      fontSize: isCenter ? 'clamp(5rem, 18vw, 14rem)' : 'clamp(3rem, 12vw, 9rem)',
      color: '#fff',
      fontFamily: 'Pleiades, serif',
      fontWeight: 100,
      transform: 'translate(-50%, -50%)',
      textShadow: isCenter
        ? '0 0 30px rgba(255,255,255,1), 0 0 60px rgba(100,150,255,0.6), 0 0 90px rgba(100,150,255,0.3)'
        : '0 0 20px rgba(255,255,255,0.7), 0 0 40px rgba(100,150,255,0.3)',
      zIndex: isCenter ? 20 : 10,
      userSelect: 'none',
    };
  };

  const getIndicatorStyle = (index: number, active: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: positions[index].top,
    left: positions[index].left,
    fontSize: 'clamp(2rem, 6vw, 4rem)',
    fontFamily: 'Pleiades, serif',
    color: active ? '#fff' : 'rgba(255,255,255,0.1)',
    transform: 'translate(-50%, -50%)',
    textShadow: active ? '0 0 15px rgba(255,255,255,0.6)' : 'none',
    transition: 'all 1s ease-in-out',
  });

  return (
    <div style={containerStyle} aria-label={`Clock showing ${hourTens}${hourOnes}:${minuteTens}${minuteOnes} ${isAM ? 'AM' : 'PM'}`}>
      {/* Static Starfield */}
      {STARS.map((star) => (
        <span
          key={star.id}
          className={`star-${star.animType}`}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: star.colorType === 'blue' ? '#a8d0ff' : star.colorType === 'gold' ? '#ffd700' : '#fff',
            borderRadius: '50%',
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            boxShadow: `0 0 ${star.size * 2}px ${star.colorType === 'white' ? '#fff' : 'currentColor'}`,
          }}
        />
      ))}

      {/* Shooting Stars */}
      {starPairs.map((star) => (
        <span
          key={`${star.id}-${star.key}`}
          style={{
            position: 'absolute',
            top: star.startY,
            left: star.startX,
            width: star.length,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), #fff)',
            transformOrigin: 'left center',
            transform: `rotate(${star.angle}deg)`,
            opacity: 0,
            animation: `shoot-${star.id}-${star.key} ${star.duration}s ease-out forwards`,
          }}
          onAnimationEnd={() => regeneratePair(star.id)}
        />
      ))}

      {/* Digits and Indicators */}
      <span className="digit-shimmer" style={getDigitStyle(0)}>{hourTens}</span>
      <span className="digit-shimmer" style={getDigitStyle(1)}>{hourOnes}</span>
      <span className="digit-shimmer" style={getDigitStyle(3)}>{minuteTens}</span>
      <span className="digit-shimmer digit-shimmer-bright" style={getDigitStyle(2)}>{minuteOnes}</span>
      
      <span className="digit-shimmer" style={getIndicatorStyle(4, true)}>{isAM ? 'A' : 'P'}</span>
      <span className="digit-shimmer" style={getIndicatorStyle(5, true)}>M</span>

      <style>{`
        .star-twinkle { animation: twinkle infinite ease-in-out; }
        .star-pulse { animation: pulse infinite ease-in-out; }
        .star-flicker { animation: flicker infinite step-start; }

        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.5); opacity: 1; } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } 80% { opacity: 0.8; } }

        .digit-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        .digit-shimmer-bright {
          animation-duration: 2s;
        }

        @keyframes shimmer {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 0 20px rgba(255,255,255,0.7));
          }
          25% {
            filter: brightness(1.2) drop-shadow(0 0 35px rgba(255,255,255,0.9));
          }
          50% {
            filter: brightness(1) drop-shadow(0 0 25px rgba(255,255,255,0.7));
          }
          75% {
            filter: brightness(1.15) drop-shadow(0 0 30px rgba(150,200,255,0.8));
          }
        }

        ${starPairs.map(s => `
          @keyframes shoot-${s.id}-${s.key} {
            0% { transform: rotate(${s.angle}deg) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            30% { transform: rotate(${s.angle}deg) translateX(${s.distance}vw); opacity: 0; }
            100% { transform: rotate(${s.angle}deg) translateX(${s.distance}vw); opacity: 0; }
          }
        `).join('')}

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .digit-shimmer {
            font-size: clamp(2rem, 10vw, 6rem) !important;
          }
          .digit-shimmer-bright {
            font-size: clamp(2.5rem, 12vw, 7rem) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PleiadesClock;
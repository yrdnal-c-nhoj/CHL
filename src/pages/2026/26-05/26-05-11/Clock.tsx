import React, { Suspense, useMemo, useEffect, useState, useRef } from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader, ClockLoadingFallback } from '@/utils/fontLoader';
import clockFont from '@/assets/fonts/2026/26-05-11-stars.ttf';
import type { FontConfig } from '@/types/clock';


import styles from './Clock.module.css';



// ---------------- INTERFACES ----------------
interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  twinkleSpeed: number;
  delay: number;
  opacity: number;
}

// ---------------- CONFIGURATION ----------------
const NIGHT_SKY_CONFIG = {
  STAR_COUNT: 150,
  COLORS: {
    stars: [
      '#FFFFFF', // White
      '#FFE4B5', // Moccasin
      '#E6E6FA', // Lavender
      '#B0E0E6', // Powder blue
      '#FFB6C1', // Light pink
      '#98FB98', // Pale green
      '#DDA0DD', // Plum
    ],
  },
  TWINKLE_DURATION: {
    min: 1,
    max: 4,
  },
  SPEED: {
    min: 0.005,
    max: 0.05,
  },
  SIZE: {
    min: 1,
    max: 4,
  },
  DIGIT_FADE: {
    minOpacity: 0.3,
    maxOpacity: 1.0,
    updateInterval: 2000, // Update every 2 seconds
    transitionDuration: 3000, // 3 second smooth transitions
  },
} as const;

// ---------------- UTILITIES ----------------
const generateRandomStar = (id: number): Star => {
  const colors = NIGHT_SKY_CONFIG.COLORS.stars;
  
  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100, // Distribute across the screen
    size: Math.random() * (NIGHT_SKY_CONFIG.SIZE.max - NIGHT_SKY_CONFIG.SIZE.min) + NIGHT_SKY_CONFIG.SIZE.min,
    speed: Math.random() * (NIGHT_SKY_CONFIG.SPEED.max - NIGHT_SKY_CONFIG.SPEED.min) + NIGHT_SKY_CONFIG.SPEED.min,
    color: colors[Math.floor(Math.random() * colors.length)] || '#FFFFFF',
    twinkleSpeed: Math.random() * (NIGHT_SKY_CONFIG.TWINKLE_DURATION.max - NIGHT_SKY_CONFIG.TWINKLE_DURATION.min) + NIGHT_SKY_CONFIG.TWINKLE_DURATION.min,
    delay: Math.random() * -20, // Negative delay so stars start at different positions in the cycle
    opacity: Math.random() * 0.5 + 0.5,
  };
};

// ---------------- COMPONENTS ----------------
const StarField: React.FC = () => {
  const stars = useMemo(() => 
    Array.from({ length: NIGHT_SKY_CONFIG.STAR_COUNT }, (_, i) => generateRandomStar(i)),
  []);

  return (
    <div className={styles.starField}>
      {stars.map(star => (
        <div
          key={star.id}
          className={styles.star}
          style={{
            left: `${star.x}%`, 
            top: `${star.y}%`,
            width: `${star.size}px`, 
            height: `${star.size}px`, 
            color: star.color, // used by currentColor in CSS box-shadow
            backgroundColor: star.color, 
            ['--twinkle-speed' as any]: `${star.twinkleSpeed}s`,
            ['--fall-speed' as any]: `${5 / star.speed}s`, 
            ['--fall-delay' as any]: `${star.delay}s`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
};

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26-05-11',
    fontUrl: clockFont,
  },
];

const NightSkyInner: React.FC = () => {
  const currentTime = useClockTime();

  // Load date-specific font via Suspense
  useSuspenseFontLoader(fontConfigs);

  const timeStr = [
    currentTime.getHours(),
    currentTime.getMinutes(),
    currentTime.getSeconds(),
  ]
    .map((n) => n.toString().padStart(2, '0'))
    .join('');

  return (
    <main className={styles.container}>
      <div className={styles.nightSkyGradient}>
        <StarField />
      </div>

      <time
        dateTime={currentTime.toISOString()}
        className={styles.timeDisplay}
      >
        {timeStr.split('').map((char, i) => (
          <span key={i} className={styles.digitBox}>
            {char}
          </span>
        ))}
      </time>
    </main>
  );
};

const NightSky: React.FC = () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <NightSkyInner />
  </Suspense>
);

export default NightSky;

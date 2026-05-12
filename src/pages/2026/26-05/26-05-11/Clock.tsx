import React, { useEffect, useRef } from 'react';
import { useClockTime } from '@/utils/hooks';
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
} as const;

// ---------------- UTILITIES ----------------
const generateRandomStar = (id: number): Star => {
  const colors = NIGHT_SKY_CONFIG.COLORS.stars;
  
  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 120 - 20, // Start below viewport
    size: Math.random() * (NIGHT_SKY_CONFIG.SIZE.max - NIGHT_SKY_CONFIG.SIZE.min) + NIGHT_SKY_CONFIG.SIZE.min,
    speed: Math.random() * (NIGHT_SKY_CONFIG.SPEED.max - NIGHT_SKY_CONFIG.SPEED.min) + NIGHT_SKY_CONFIG.SPEED.min,
    color: colors[Math.floor(Math.random() * colors.length)] || '#FFFFFF',
    twinkleSpeed: Math.random() * (NIGHT_SKY_CONFIG.TWINKLE_DURATION.max - NIGHT_SKY_CONFIG.TWINKLE_DURATION.min) + NIGHT_SKY_CONFIG.TWINKLE_DURATION.min,
    opacity: Math.random() * 0.5 + 0.5,
  };
};

// ---------------- COMPONENTS ----------------
const StarField: React.FC = () => {
  const [stars, setStars] = React.useState<Star[]>(() => 
    Array.from({ length: NIGHT_SKY_CONFIG.STAR_COUNT }, (_, i) => generateRandomStar(i))
  );
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setStars(prevStars => 
        prevStars.map(star => ({
          ...star,
          y: star.y - star.speed < -10 ? 120 : star.y - star.speed,
        }))
      );
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
            backgroundColor: star.color,
            animationDuration: `${star.twinkleSpeed}s`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
};


// ---------------- MAIN NIGHT SKY COMPONENT ----------------
const NightSky: React.FC = () => {
  const currentTime = useClockTime();

  return (
    <div className={styles.container}>
      <div className={styles.nightSkyGradient}>
        <StarField />
      </div>
      
      <time dateTime={currentTime.toISOString()} className={styles.timeDisplay}>
        {currentTime.toLocaleTimeString()}
      </time>
    </div>
  );
};

export default NightSky;

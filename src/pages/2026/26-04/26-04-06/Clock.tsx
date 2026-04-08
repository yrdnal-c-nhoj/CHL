import React, { useState, useEffect, useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';

// Dynamically import all images from the assets folder
const imageModules = import.meta.glob('@/assets/images/2026/26-04/26-04-06/*', {
  eager: true,
  import: 'default',
});

const IMAGES = Object.values(imageModules).filter(
  (src): src is string => typeof src === 'string' && !src.includes('.DS_Store')
);

const getRandomPosition = () => ({
  top: `${Math.random() * 70}%`,
  left: `${Math.random() * 70}%`,
  transform: `scale(${0.5 + Math.random()})`,
});

const Clock: React.FC = () => {
  const time = useClockTime();
  
  // Start with all images loaded at random positions
  const [displayedImages, setDisplayedImages] = useState<Array<{ src: string; pos: React.CSSProperties; id: number }>>(() => {
    return IMAGES.map((src) => ({
      src,
      pos: getRandomPosition(),
      id: Date.now() + Math.random(),
    }));
  });

  // Track which image index to load next (sequential)
  const [imageIndex, setImageIndex] = useState(0);

  // Use the raw seconds value to trigger the effect
  const seconds = time.getSeconds();

  useEffect(() => {
    setDisplayedImages((prev) => {
      const nextSrc = IMAGES[imageIndex % IMAGES.length];
      if (!nextSrc) return prev;

      const nextImage = {
        src: nextSrc,
        pos: getRandomPosition(),
        id: Date.now(),
      };

      const next = [...prev, nextImage];
      if (next.length > 30) {
        next.shift();
      }

      return next;
    });

    setImageIndex((prev) => prev + 1);
  }, [seconds]);


  // Clock Hand Calculations
  const secondDegrees = (time.getSeconds() + time.getMilliseconds() / 1000) * 6;
  const minuteDegrees = (time.getMinutes() + time.getSeconds() / 60) * 6;
  const hourDegrees = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;

  // Format time for accessibility
  const timeLabel = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }, [time]);

  return (
    <div className={styles.container} role="img" aria-label={`Analog clock showing ${timeLabel}`}>
      {/* Background Images Layer */}
      {displayedImages.map((img) => (
        <img
          key={img.id}
          src={img.src}
          alt=""
          className={styles.backgroundImage}
          style={img.pos}
        />
      ))}

      {/* Clock SVG Layer */}
      <svg
        className={styles.clockSvg}
        viewBox="0 0 100 100"
        role="img"
        aria-label={`Time: ${timeLabel}`}
      >
        
        {/* Markers */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="50" y1="5" x2="50" y2={i % 3 === 0 ? "10" : "8"}
            stroke="#000"
            strokeWidth={i % 3 === 0 ? "1" : "0.5"}
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}

        {/* Hands */}
        <line x1="50" y1="50" x2="50" y2="25" stroke="#000" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${hourDegrees} 50 50)`} />
        <line x1="50" y1="50" x2="50" y2="15" stroke="#000" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${minuteDegrees} 50 50)`} />
        <line x1="50" y1="55" x2="50" y2="8" stroke="#f00" strokeWidth="0.7" strokeLinecap="round" transform={`rotate(${secondDegrees} 50 50)`} />

        <circle cx="50" cy="50" r="2" fill="#000" />
      </svg>
    </div>
  );
};

export default Clock;
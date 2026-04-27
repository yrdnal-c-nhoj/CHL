import React, { useState, useEffect, useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';

// Dynamically import all images from the assets folder
const imageModules = import.meta.glob('@/assets/images/2026/26-04/26-04-27/*', {
  eager: true,
  import: 'default',
});

const IMAGES = Object.values(imageModules).filter(
  (src): src is string => typeof src === 'string' && !src.includes('.DS_Store')
);

export const assets = IMAGES;

const getRandomPosition = () => ({
  top: `${Math.random() * 90}%`,
  left: `${Math.random() * 90}%`,
  transform: `scale(${0.1 + Math.random()})`,
});

const getRandomFilter = () => {
  const saturation = Math.random() * 3; // 0 to 3 (0 = grayscale, 3 = super saturated)
  return `saturate(${saturation})`;
};

const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100dvh',
  backgroundColor: '#fff',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const baseImageStyle: React.CSSProperties = {
  position: 'absolute',
  maxWidth: '250px',
  maxHeight: '250px',
  opacity: 0.8,
  transition: 'all 0.5s ease-in-out',
  zIndex: 1,
};

const digitalClockStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 100,
  fontFamily: 'monospace',
  fontSize: '15vmin',
  color: '#fff',
  textShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
  letterSpacing: '0.05em',
};

const Clock: React.FC = () => {
  const time = useClockTime();
  
  // Start with all images loaded at random positions with filters
  const [displayedImages, setDisplayedImages] = useState<Array<{ src: string; pos: React.CSSProperties; id: number; filter: string }>>(() => {
    return IMAGES.map((src) => ({
      src,
      pos: getRandomPosition(),
      id: Date.now() + Math.random(),
      filter: getRandomFilter(),
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
        filter: getRandomFilter(),
      };

      const next = [...prev, nextImage];
      if (next.length > 30) {
        next.shift();
      }

      return next;
    });

    setImageIndex((prev) => prev + 1);
  }, [seconds]);


  // Format digital time
  const timeLabel = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }, [time]);

  return (
    <div style={containerStyle} role="img" aria-label={`Digital clock showing ${timeLabel}`}>
      {/* Background Images Layer */}
      {displayedImages.map((img) => (
        <img
          key={img.id}
          src={img.src}
          alt=""
          style={{ ...baseImageStyle, ...img.pos, filter: img.filter }}
        />
      ))}

      {/* Digital Clock Display */}
      <div style={digitalClockStyle}>
        {timeLabel}
      </div>
    </div>
  );
};

export default Clock;
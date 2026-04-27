import React, { useState, useEffect, useMemo } from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import leverFont from '@/assets/fonts/2026/26-04-27-lever.ttf';
import styles from './Clock.module.css';

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

const Clock: React.FC = () => {
  const time = useClockTime();

  const fontConfigs = useMemo(() => [
    {
      fontFamily: 'Lever',
      fontUrl: leverFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  useSuspenseFontLoader(fontConfigs);
  
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
  const { hours, minutes } = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    return { hours: h, minutes: m, iso: `${h}:${m}` };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Background Images Layer */}
      {displayedImages.map((img) => (
        <img
          key={img.id}
          src={img.src}
          alt=""
          className={styles.baseImage}
          style={{ ...img.pos as React.CSSProperties, filter: img.filter }}
        />
      ))}

      {/* Digital Clock Display */}
      <time className={styles.digitalClock} dateTime={iso}>
        <span className={styles.digit}>{hours}</span>
        <span className={styles.colon}>:</span>
        <span className={styles.digit}>{minutes}</span>
      </time>
    </main>
  );
};

export default Clock;
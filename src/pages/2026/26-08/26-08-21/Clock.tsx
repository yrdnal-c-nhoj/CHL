import { formatTime } from '@/utils/clockUtils';
import { useMillisecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Clock.module.css';

import fontUrl from '@/assets/fonts/26fonts/26-08-21.ttf?url';

// Dynamically import all images from the assets folder
const imageModules = import.meta.glob(
  '@/assets/images/26_images/26-08/26-08-21/*',
  {
    eager: true,
    import: 'default',
  },
);

const IMAGES = Object.values(imageModules).filter(
  (src): src is string => typeof src === 'string' && !src.includes('.DS_Store'),
);

export const assets = [...IMAGES, fontUrl];

const fontConfigs = [
  {
    fontFamily: 'ClockFont_26_08_21',
    fontUrl,
  },
];

const getRandomPosition = () => ({
  top: `${Math.random() * 70}%`,
  left: `${Math.random() * 70}%`,
  transform: `scale(${0.5 + Math.random()})`,
});

const Clock =  () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  // Start with all images loaded at random positions
  const [displayedImages, setDisplayedImages] = useState<
    Array<{ src: string; pos: React.CSSProperties; id: number }>
  >(() => {
    return IMAGES.map((src) => ({
      src,
      pos: getRandomPosition(),
      id: Date.now() + Math.random(),
    }));
  });

  // Track which image index to load next (sequential)
  const [imageIndex, setImageIndex] = useState(0);
  const lastUpdateSecondRef = useRef<number | null>(null);

  // Use the raw seconds value to trigger the effect
  const secondsInt = time.getSeconds();
  const smoothSeconds = secondsInt + time.getMilliseconds() / 1000;

  useEffect(() => {
    // Only run the effect once per second
    if (secondsInt === lastUpdateSecondRef.current) return;
    lastUpdateSecondRef.current = secondsInt;

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
  }, [time, imageIndex, secondsInt]);

  // Clock Hand Calculations
  const secondDegrees = (time.getSeconds() + time.getMilliseconds() / 1000) * 6;
  const minuteDegrees = (time.getMinutes() + time.getSeconds() / 60) * 6;
  const hourDegrees = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;

  // Format time for accessibility
  const timeLabel = useMemo(() => {
    return formatTime(time, '24h'); // Using 24h format for consistency, adjust as needed
  }, [time]);

  return (
    <div
      className={styles.container}
      role="img"
      aria-label={`Analog clock showing ${timeLabel}`}
    >
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
        <g transform={`rotate(${smoothSeconds * 6} 50 50)`}>

        {/* Cardinal numbers */}
        <text x="50" y="16" textAnchor="middle" fontSize="12" fill="#000" className={styles.clockNumber}>12</text>
        <text x="84" y="54" textAnchor="middle" fontSize="12" fill="#000" className={styles.clockNumber}>3</text>
        <text x="50" y="90" textAnchor="middle" fontSize="12" fill="#000" className={styles.clockNumber}>6</text>
        <text x="16" y="54" textAnchor="middle" fontSize="12" fill="#000" className={styles.clockNumber}>9</text>

        {/* Hands */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="25"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinecap="round"
          transform={`rotate(${hourDegrees} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          stroke="#000"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${minuteDegrees} 50 50)`}
        />
        <line
          x1="50"
          y1="55"
          x2="50"
          y2="8"
          stroke="#f00"
          strokeWidth="0.7"
          strokeLinecap="round"
          transform={`rotate(${secondDegrees} 50 50)`}
        />

        <circle cx="50" cy="50" r="2" fill="#000" />
        </g>
      </svg>
    </div>
  );
};

export default Clock;

import { useMillisecondClock, formatTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useMemo, useRef, useState, memo } from 'react';
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
    <main
      className={styles.container}
      role="img"
      aria-label={`Analog clock showing ${timeLabel}`}
    >
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

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
        <text x="50" y="16" className={styles.clockNumber}>12</text>
        <text x="84" y="54" className={styles.clockNumber}>3</text>
        <text x="50" y="90" className={styles.clockNumber}>6</text>
        <text x="16" y="54" className={styles.clockNumber}>9</text>

        {/* Hands */}
        <line className={styles.hourHand} transform={`rotate(${hourDegrees} 50 50)`} x1="50" y1="50" x2="50" y2="25" />
        <line className={styles.minuteHand} transform={`rotate(${minuteDegrees} 50 50)`} x1="50" y1="50" x2="50" y2="15" />
        <line className={styles.secondHand} transform={`rotate(${secondDegrees} 50 50)`} x1="50" y1="55" x2="50" y2="8" />

        <circle className={styles.centerDot} cx="50" cy="50" r="2" />
        </g>
      </svg>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_08_21';
export default MemoizedClock;

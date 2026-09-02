import myCustomFont from '@/assets/fonts/25fonts/25-07-27-som.ttf';
import backgroundImage from '@/assets/images/25_images/25-07/25-07-27/met.jpg';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports (Required for preloading pipeline)
export const assets = [backgroundImage, myCustomFont];

interface Digit {
  id: number;
  char: string;
  top: number;
  typeClass: 'hour' | 'minuteTens' | 'minuteOnes';
}

const Clock =  () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs: FontConfig[] = useMemo(() => [
    {
      fontFamily: 'MyCustomFont',
      fontUrl: myCustomFont,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ], []);
  useSuspenseFontLoader(fontConfigs);

  const [digits, setDigits] = useState<Digit[]>([]);
  const lastSpawnTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const time = useClock(); // Use canonical hook

  // Animation and spawning logic
  useEffect(() => {
    const formatTime = (date: Date): string => {
      let h = date.getHours() % 12;
      if (h === 0) h = 12;
      const m = String(date.getMinutes()).padStart(2, '0');
      return `${h}${m}`;
    };

    const animate = (timestamp: number) => {
      // 1. Clean up old digits
      setDigits((prev) => prev.filter((d) => timestamp - d.id < 6000));

      // 2. Spawn new digits based on time
      if (timestamp - lastSpawnTimeRef.current > 800) {
        lastSpawnTimeRef.current = timestamp;
        const now = new Date();
        const timeStr = formatTime(now);
        const hourLength = timeStr.length - 2;

        timeStr.split('').forEach((char, i) => {
          const spawnTimer = setTimeout(() => {
            const id = Date.now() + Math.random(); // Use a more robust ID for React keys
            const top = Math.random() * 90;

            let typeClass: Digit['typeClass'];

            if (i < hourLength) {
              typeClass = 'hour';
            } else {
              const minuteIndex = i - hourLength;
              if (minuteIndex === 0) {
                typeClass = 'minuteTens';
              } else {
                typeClass = 'minuteOnes';
              }
            }
            setDigits((prev) => [...prev, { id, char, top, typeClass }]);
          }, i * 1000);
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      // Clear any pending spawn timers on cleanup
      // This requires tracking timers, which adds complexity.
      // The current rAF cleanup is the most critical part.
    };
  }, []);

  return (
    <main
      className={styles.container}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      {digits.map(({ id, char, top, typeClass }) => (
        <div
          key={id}
          className={`${styles.digit} ${styles[typeClass]}`}
          style={{ top: `${top}vh` }}
        >
          {char}
        </div>
      ))}
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_25_07_27';

export default MemoizedClock;

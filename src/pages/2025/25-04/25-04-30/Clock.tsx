import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  memo
} from 'react';
import styles from './Clock.module.css';

import secondImg from '@/assets/images/25_images/25-04/25-04-16/20.webp';
import minuteImg from '@/assets/images/25_images/25-04/25-04-16/200w.webp';
import hourImg from '@/assets/images/25_images/25-04/25-04-16/2hhj.webp';
import cakeGif from '@/assets/images/25_images/25-04/25-04-16/cake.gif';
import confGif from '@/assets/images/25_images/25-04/25-04-16/conf.gif';
import confJpg from '@/assets/images/25_images/25-04/25-04-16/conf.jpg';

export const assets = [cakeGif, minuteImg, hourImg, secondImg, confGif, confJpg];

interface ClockData {
  id: string;
  size: number;
  gravity: number;
  bounce: number;
  x: number;
  y: number;
  vy: number;
  squash: number;
  color: string;
  born: number;
}

// Component Props interface
interface GravityClockProps {
  // No props required for this component
}

const GravityClock: React.FC<GravityClockProps> = () => {
  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useClock();
  const [clocks, setClocks] = useState<ClockData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const lastSpawnTimeRef = useRef<number>(0);

  // Spawning logic
  useEffect(() => {
    const spawnClock = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const sizes = [30, 60, 100, 180, 260];
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      // Inverse Gravity: Large is slow, Small is fast
      const gravity = (2.2 / size + 0.005) * 10;

      // Higher bounce for larger "lighter" clocks
      const bounce = Math.min(0.92, 0.2 + size / 320);

      const newClock: ClockData = {
        id,
        size,
        gravity,
        bounce,
        x: Math.random() * 90,
        y: -size, // Start off-screen in pixels
        vy: 0,
        squash: 1, // 1 = normal, < 1 = squashed
        color: `hsl(${Math.floor(Math.random() * 360)}, 30%, 50%)`,
        born: Date.now(),
      };
      setClocks((prev) => [...prev, newClock]);
    };

    const now = currentTime.getTime();

    // Initialize with a spawn
    if (lastSpawnTimeRef.current === 0) {
      spawnClock();
      lastSpawnTimeRef.current = now;
    } else if (now - lastSpawnTimeRef.current > 1800) {
      spawnClock();
      lastSpawnTimeRef.current = now;
    }
  }, [currentTime]);

  // Animation loop
  const animate = () => {
    setClocks((prevClocks) => {
      // Use the actual pixel height of the viewport/container
      const containerHeight =
        containerRef.current?.getBoundingClientRect().height ||
        window.innerHeight;
      const floor = containerHeight; // Floor is the container height in pixels

      return prevClocks
        .filter((c) => Date.now() - c.born < 45000)
        .map((c) => {
          let nextVy = c.vy + c.gravity;
          let nextY = c.y + nextVy;
          let nextSquash;

          // 1. Calculate Stretch based on velocity (velocity-based elongation)
          // As it falls faster, it stretches slightly: scaleY > 1
          nextSquash = 1 + Math.abs(nextVy) * 0.05;

          // 2. Floor Collision & Squash
          if (nextY > floor - c.size) {
            nextY = floor - c.size;

            // If impact velocity is significant, trigger squash
            if (Math.abs(nextVy) > 1) {
              nextSquash = 0.6; // Flatten to 60% height
            }

            nextVy *= -c.bounce;
            if (Math.abs(nextVy) < 0.1) nextVy = 0;
          }

          // Smoothly return squash back to 1 if it was squashed
          const finalSquash = c.squash + (nextSquash - c.squash) * 0.2;

          return { ...c, y: nextY, vy: nextVy, squash: finalSquash };
        });
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  // Start animation loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <main ref={containerRef} className={styles.container}>
      <time dateTime={currentTime.toISOString()} className={styles.srOnly}>{currentTime.toLocaleTimeString()}</time>
      {clocks.map((clock) => (
        <ClockItem key={clock.id} clock={clock} currentTime={currentTime} />
      ))}
    </main>
  );
};

interface ClockItemProps {
  clock: ClockData;
  currentTime: Date;
}

const ClockItem: React.FC<ClockItemProps> = React.memo(({ clock, currentTime }) => {
  const h = (currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5;
  const m = currentTime.getMinutes() * 6;

  const scaleX = 1 / clock.squash;
  const scaleY = clock.squash;

  return (
    <div
      className={styles.clockItem}
      style={{
        width: `${clock.size}px`,
        height: `${clock.size}px`,
        left: `${clock.x}vw`,
        backgroundColor: clock.color,
        transform: `translateY(${clock.y}px) scale(${scaleX}, ${scaleY})`,
      }}
    >
      <div className={styles.clockFace}>
        <div className={`${styles.hand} ${styles.hourHand}`} style={{ transform: `translateX(-50%) rotate(${h}deg)` }} />
        <div className={`${styles.hand} ${styles.minuteHand}`} style={{ transform: `translateX(-50%) rotate(${m}deg)` }} />
      </div>
    </div>
  );
});
ClockItem.displayName = 'ClockItem';

const MemoizedGravityClock = memo(GravityClock);
MemoizedGravityClock.displayName = 'Clock_25_04_30';
export default MemoizedGravityClock;

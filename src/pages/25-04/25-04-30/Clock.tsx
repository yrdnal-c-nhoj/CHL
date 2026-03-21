import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import type { CSSProperties } from 'react';
import styles from './Clock.module.css';

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
  const currentTime = useSecondClock();
  const [clocks, setClocks] = useState<ClockData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  // Spawning logic
  useEffect(() => {
    const spawnClock = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const sizes = [30, 60, 100, 180, 260];
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      // Inverse Gravity: Large is slow, Small is fast
      const gravity = 2.2 / size + 0.005;
      
      // Higher bounce for larger "lighter" clocks
      const bounce = Math.min(0.92, 0.2 + size / 320);

      const newClock: ClockData = {
        id,
        size,
        gravity,
        bounce,
        x: Math.random() * 90,
        y: -20,
        vy: 0,
        squash: 1, // 1 = normal, < 1 = squashed
        color: `hsl(${Math.floor(Math.random() * 360)}, 30%, 50%)`,
        born: Date.now(),
      };
      setClocks((prev) => [...prev, newClock]);
    };

    const interval = setInterval(spawnClock, 1800);
    return () => clearInterval(interval);
  }, []);

  // Animation loop
  const animate = () => {
    setClocks((prevClocks) => {
      const floor =
        (containerRef.current?.offsetHeight || window.innerHeight) / 16;

      return prevClocks
        .filter((c) => Date.now() - c.born < 45000)
        .map((c) => {
          let nextVy = c.vy + c.gravity;
          let nextY = c.y + nextVy;
          let nextSquash = 1;
          const sizeRem = c.size / 16;

          // 1. Calculate Stretch based on velocity (velocity-based elongation)
          // As it falls faster, it stretches slightly: scaleY > 1
          nextSquash = 1 + Math.abs(nextVy) * 0.15;

          // 2. Floor Collision & Squash
          if (nextY > floor - sizeRem) {
            nextY = floor - sizeRem;

            // If impact velocity is significant, trigger squash
            if (Math.abs(nextVy) > 0.1) {
              nextSquash = 0.6; // Flatten to 60% height
            }

            nextVy *= -c.bounce;
            if (Math.abs(nextVy) < 0.01) nextVy = 0;
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
    <div ref={containerRef} className={styles.container}>
      {clocks.map((clock) => (
        <ClockItem key={clock.id} clock={clock} />
      ))}
    </div>
  );
};

const ClockItem: React.FC<{ clock: ClockData }> = ({ clock }) => {
  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();

  const h = (currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5;
  const m = currentTime.getMinutes() * 6;

  // Calculate the scale: squash affects Y, and to preserve volume, X does the opposite
  // (Traditional animation rule: if height goes down, width goes out)
  const scaleX = 1 / clock.squash;
  const scaleY = clock.squash;

  return (
    <div
      className={styles.clockItem}
      style={{
        width: `${clock.size / 16}rem`,
        height: `${clock.size / 16}rem`,
        left: `${clock.x}vw`,
        backgroundColor: clock.color,
        transform: `translateY(${clock.y}rem) scale(${scaleX}, ${scaleY})`,
      }}
    >
      <div className={styles.clockFace}>
        {/* Hour Hand */}
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{
            transform: `translateX(-50%) rotate(${h}deg)`,
          }}
        />
        {/* Minute Hand */}
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{
            transform: `translateX(-50%) rotate(${m}deg)`,
          }}
        />
      </div>
    </div>
  );
};

export default GravityClock;

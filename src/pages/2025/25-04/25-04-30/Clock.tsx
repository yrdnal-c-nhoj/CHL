import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Clock.module.css';

import secondImg from '@/assets/images/25_images/25-04/25-04-16/20.webp';
import minuteImg from '@/assets/images/25_images/25-04/25-04-16/200w.webp';
import hourImg from '@/assets/images/25_images/25-04/25-04-16/2hhj.webp';
import cakeGif from '@/assets/images/25_images/25-04/25-04-16/cake.gif';
import confGif from '@/assets/images/25_images/25-04/25-04-16/conf.gif';
import confJpg from '@/assets/images/25_images/25-04/25-04-16/conf.jpg';

export const assets = [
  cakeGif,
  minuteImg,
  hourImg,
  secondImg,
  confGif,
  confJpg,
];

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

interface ClockItemProps {
  clock: ClockData;
  currentTime: Date;
}

const GravityClock: React.FC = () => {
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  const currentTime = useClock();
  const currentTimeRef = useRef(currentTime);
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);
  const [clocks, setClocks] = useState<ClockData[]>([]);

  const containerRef = useRef<HTMLElement>(null);
  const requestRef = useRef<number | null>(null);
  const lastSpawnTimeRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);

  // The first three clocks contain one smallest, one largest,
  // and one randomly chosen intermediate clock, in random order.
  const initialSizesRef = useRef<number[] | null>(null);

  useEffect(() => {
    const now = currentTime.getTime();

    if (lastSpawnTimeRef.current === 0) {
      lastSpawnTimeRef.current = now;
      return;
    }

    if (now - lastSpawnTimeRef.current < 1800) return;

    lastSpawnTimeRef.current = now;

    const sizes = [30, 60, 100, 180, 260];

    if (initialSizesRef.current === null) {
      const middleSizes = [60, 100, 180];
      const middleSize =
        middleSizes[Math.floor(Math.random() * middleSizes.length)];

      const firstThree = [30, 260, middleSize];

      // Fisher-Yates shuffle.
      for (let i = firstThree.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [firstThree[i], firstThree[j]] = [firstThree[j], firstThree[i]];
      }

      initialSizesRef.current = firstThree;
    }

    const size =
      initialSizesRef.current.length > 0
        ? initialSizesRef.current.shift()!
        : sizes[Math.floor(Math.random() * sizes.length)];

    const sizeRatio = (size - 30) / 230;

    // Small clocks fall fast; large clocks fall slowly.
    const gravity = 1400 - sizeRatio * 1250;

    // Large clocks still bounce much higher, but lose
    // slightly more energy per impact than before.
    const bounce = 0.2 + sizeRatio * 0.68;

    const width = containerRef.current?.clientWidth ?? window.innerWidth;

    const maxX = Math.max(0, width - size);

    const clock: ClockData = {
      id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
      size,
      gravity,
      bounce,
      x: Math.random() * maxX,
      y: -size,
      vy: 0,
      squash: 1,
      color: `hsl(${Math.floor(Math.random() * 360)}, 35%, 55%)`,
      born: now,
    };

    setClocks((previous) => [...previous, clock]);
  }, [currentTime]);

  // Time-based physics and ground collisions.
  useEffect(() => {
    const animate = (timestamp: number) => {
      const previousTimestamp = lastFrameRef.current;
      lastFrameRef.current = timestamp;

      const dt =
        previousTimestamp === null
          ? 0
          : Math.min((timestamp - previousTimestamp) / 1000, 0.032);

      const container = containerRef.current;
      const floor = container?.clientHeight ?? window.innerHeight;
      const width = container?.clientWidth ?? window.innerWidth;
      const now = currentTimeRef.current.getTime();

      setClocks((previous) =>
        previous
          .filter((clock) => now - clock.born < 60000)
          .map((clock) => {
            const x = Math.min(clock.x, Math.max(0, width - clock.size));

            let y = clock.y;
            let vy = clock.vy;
            let squash = clock.squash;

            vy += clock.gravity * dt;
            y += vy * dt;

            const ground = Math.max(0, floor - clock.size);

            if (y >= ground) {
              y = ground;

              if (vy > 45) {
                vy = -vy * clock.bounce;

                // Subtle 6% compression; rebound velocity is
                // controlled separately by the bounce coefficient.
                squash = 0.94;
              } else {
                vy = 0;
              }
            }

            // Smoothly restore the clock's shape after impact.
            squash += (1 - squash) * Math.min(1, dt * 12);

            return {
              ...clock,
              x,
              y,
              vy,
              squash,
            };
          }),
      );

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }

      lastFrameRef.current = null;
    };
  }, []);

  return (
    <main ref={containerRef} className={styles.container}>
      <time dateTime={currentTime.toISOString()} className={styles.srOnly}>
        {currentTime.toLocaleTimeString()}
      </time>

      {clocks.map((clock) => (
        <ClockItem key={clock.id} clock={clock} currentTime={currentTime} />
      ))}
    </main>
  );
};

const ClockItem = memo(({ clock, currentTime }: ClockItemProps) => {
  const hours =
    (currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5;

  const minutes = currentTime.getMinutes() * 6;

  const clockStyle = {
    width: clock.size,
    height: clock.size,
    left: clock.x,
    backgroundColor: clock.color,
    transform: `translateY(${clock.y}px) scale(${1 / clock.squash}, ${clock.squash})`,
    '--clock-size': `${clock.size}px`,
  } as React.CSSProperties;

  return (
    <div className={styles.clockItem} style={clockStyle}>
      <div className={styles.clockFace}>
        {[12, 3, 6, 9].map((number) => (
          <span
            key={number}
            className={`${styles.marker} ${styles[`marker${number}` as keyof typeof styles]}`}
          >
            {number}
          </span>
        ))}

        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{
            transform: `translateX(-50%) rotate(${hours}deg)`,
          }}
        />

        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{
            transform: `translateX(-50%) rotate(${minutes}deg)`,
          }}
        />

        <div className={styles.pivot} />
      </div>
    </div>
  );
});

ClockItem.displayName = 'ClockItem';

const MemoizedGravityClock = memo(GravityClock);
MemoizedGravityClock.displayName = 'Clock_25_04_30';

export default MemoizedGravityClock;

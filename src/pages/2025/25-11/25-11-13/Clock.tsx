import { useEffect, useState, useRef, useCallback } from 'react';

import bgImage from '@/assets/images/2025/25-11/25-11-13/bg.webp';
import { useClockTime } from '@/utils/hooks';

import styles from './Clock.module.css';

export const assets = [bgImage];

interface ClockInstance {
  id: number;
  born: number;
  duration: number;
  direction: 'right-to-left' | 'left-to-right';
}

export default function RollingAnalogClock() {
  const [clocks, setClocks] = useState<ClockInstance[]>([]);
  const nextIdRef = useRef(0);

  /* ------------------------------------------------------------------
     SPAWN CLOCKS AT RANDOM INTERVALS
  ------------------------------------------------------------------ */
  useEffect(() => {
    let isMounted = true;
    let timerId: ReturnType<typeof setTimeout>;

    const spawnClock = () => {
      if (!isMounted) return;

      const duration = Math.random() * 12 + 3;
      const direction = Math.random() < 0.5 ? 'right-to-left' : 'left-to-right';
      
      setClocks((prev) => [
        ...prev,
        {
          id: nextIdRef.current++,
          born: Date.now(),
          duration: duration * 1000,
          direction,
        },
      ]);

      const delay = Math.random() * 1700 + 300;
      timerId = setTimeout(spawnClock, delay);
    };

    spawnClock();

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, []);

  /* ------------------------------------------------------------------
     REMOVE CLOCKS AFTER THEIR RANDOM DURATION
  ------------------------------------------------------------------ */
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setClocks((prev) => prev.filter((c) => now - c.born < c.duration));
    }, 500);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <main 
      className={styles.container} 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {clocks.map((clock) => (
        <SingleSlowRollingClock
          key={clock.id}
          duration={clock.duration / 1000}
          direction={clock.direction}
        />
      ))}
    </main>
  );
}

// --------------------------------------------------------------------

/* ==================================================================
   A SINGLE ROLLING CLOCK (with extended hands and marker position)
================================================================== */
interface SingleClockProps {
  duration: number; // in seconds
  direction: 'right-to-left' | 'left-to-right';
}

function SingleSlowRollingClock({ duration, direction }: SingleClockProps) {
  const clockRef = useRef<HTMLDivElement>(null);
  const handsRef = useRef<{
    hour: HTMLDivElement | null;
    minute: HTMLDivElement | null;
    second: HTMLDivElement | null;
  }>({ hour: null, minute: null, second: null });

  const now = useClockTime(); // Standardized animation loop

  // Set a large distance to ensure the clock travels completely off-screen
  const travelDistance = 150; // 150vw

  useEffect(() => {
    const d = now;
    const sec = d.getSeconds() + d.getMilliseconds() / 1000;
    const min = d.getMinutes() + sec / 60;
    const hr = (d.getHours() % 12) + min / 60;

    // Apply transforms
    if (handsRef.current.hour)
      handsRef.current.hour.style.transform = `translate(-50%, 0) rotate(${hr * 30}deg)`;
    if (handsRef.current.minute)
      handsRef.current.minute.style.transform = `translate(-50%, 0) rotate(${min * 6}deg)`;
    if (handsRef.current.second)
      handsRef.current.second.style.transform = `translate(-50%, 0) rotate(${sec * 6}deg)`;
  }, [now]);

  /* --------------------------------------
     Trigger roll with set duration and direction
  --------------------------------------- */
  useEffect(() => {
    const el = clockRef.current;
    if (!el) return;

    // Set starting and ending positions based on direction, using vw for guaranteed off-screen travel
    const isRightToLeft = direction === 'right-to-left';
    const startX = isRightToLeft
      ? `${travelDistance}vw`
      : `-${travelDistance}vw`;
    const endX = isRightToLeft ? `-${travelDistance}vw` : `${travelDistance}vw`;
    const rotation = isRightToLeft ? -720 : 720; // 2 full rotations

    // Starting position
    el.style.transform = `translateX(${startX}) translate(-50%, -50%) rotate(0deg)`;
    el.style.transition = 'none';

    // Force reflow
    void el.offsetWidth;

    // Begin roll
    requestAnimationFrame(() => {
      el.style.transition = `transform ${duration}s linear`;
      el.style.transform = `translateX(${endX}) translate(-50%, -50%) rotate(${rotation}deg)`;
    });
  }, [duration, direction, travelDistance]);

  // Initial position based on direction
  const initialX =
    direction === 'right-to-left'
      ? `${travelDistance}vw`
      : `-${travelDistance}vw`;

  return (
    <div
      ref={clockRef}
      className={styles.rollingClockWrapper}
      style={{
        transform: `translateX(${initialX}) translate(-50%, -50%)`,
      }}
    >
      <div className={styles.clockFace}>
        {/* 12 o'clock marker only (Moved out further) */}
        <div className={styles.marker12} />
        {/* hands */}
        <div
          ref={(el) => (handsRef.current.hour = el)}
          className={`${styles.hand} ${styles.handHour}`}
        />
        <div
          ref={(el) => (handsRef.current.minute = el)}
          className={`${styles.hand} ${styles.handMinute}`}
        />
        <div
          ref={(el) => (handsRef.current.second = el)}
          className={`${styles.hand} ${styles.handSecond}`}
        />
        <div className={styles.centerPin} />
      </div>
    </div>
  );
}

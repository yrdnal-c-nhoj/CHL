import React, { useEffect, useState, useRef, CSSProperties } from 'react';
// 🎯 Import the background image
import backgroundImageURL from '@/assets/images/2025/25-11/25-11-13/bg.webp';
import styles from './Clock.module.css';

// A unique ID generator for each rolling clock
let nextId = 0;

interface ClockInstance {
  id: number;
  born: number;
  duration: number;
  direction: 'right-to-left' | 'left-to-right';
}

export default function RollingAnalogClock() {
  const [clocks, setClocks] = useState<ClockInstance[]>([]);

  /* ------------------------------------------------------------------
     SPAWN CLOCKS AT RANDOM INTERVALS
  ------------------------------------------------------------------ */
  useEffect(() => {
    let isMounted = true;

    const spawnClock: React.FC = () => {
      if (!isMounted) return;

      // Random animation duration (3–15 seconds)
      const duration = Math.random() * 12 + 3; // 3 to 15 seconds
      // Random direction (50% chance each)
      const direction = Math.random() < 0.5 ? 'right-to-left' : 'left-to-right';
      setClocks((prev) => [
        ...prev,
        // duration is stored in milliseconds for cleanup
        {
          id: nextId++,
          born: Date.now(),
          duration: duration * 1000,
          direction,
        },
      ]);

      // Schedule next spawn after random delay (0.3–2 seconds)
      const delay = Math.random() * 1700 + 300; // 300ms to 2000ms
      setTimeout(spawnClock, delay);
    };

    // Start spawning
    spawnClock();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------
     REMOVE CLOCKS AFTER THEIR RANDOM DURATION
  ------------------------------------------------------------------ */
  useEffect(() => {
    const cleaner = setInterval(() => {
      setClocks((prev) => prev.filter((c) => Date.now() - c.born < c.duration));
    }, 200);
    return () => clearInterval(cleaner);
  }, []);

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url('${backgroundImageURL}')` }}
    >
      {clocks.map((clock) => (
        <SingleSlowRollingClock
          key={clock.id}
          duration={clock.duration / 1000} // Pass duration in seconds
          direction={clock.direction}
        />
      ))}
    </div>
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
  const [now, setNow] = useState(new Date());

  // Set a large distance to ensure the clock travels completely off-screen
  const travelDistance = 150; // 150vw

  /* --------------------------------------
     Update clock hands every second
  --------------------------------------- */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

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

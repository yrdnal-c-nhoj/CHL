import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

// Import assets at top level for bundler optimization
import scorpImage from '@/assets/images/2025/25-05/25-05-02/sand.webp?url';
import hourHandImage from '@/assets/images/2025/25-05/25-05-02/giphy1-ezgif.com-rotate(1).gif?url';
import minuteHandImage from '@/assets/images/2025/25-05/25-05-02/giphy1-ezgif.com-rotate(1).gif?url';
import secondHandImage from '@/assets/images/2025/25-05/25-05-02/giphy1-ezgif.com-rotate(1).gif?url';
import fontFile from '@/assets/fonts/2025/25-05-02-scorp.ttf?url';

// Component Props interface
interface ClockProps {
  // No props required for this component
}

// Clock number interface
interface ClockNumber {
  value: number;
  rotation: number;
}

// Hand position interface
interface HandPosition {
  degrees: number;
  scale: number;
}

const Clock: React.FC<ClockProps> = () => {
  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'Scorpion',
      fontUrl: fontFile,
    }
  ], []);
  
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useClockTime();
  const animationFrameRef = useRef<number>();
  const secondHandRef = useRef<HTMLDivElement>(null);
  const minuteHandRef = useRef<HTMLDivElement>(null);
  const hourHandRef = useRef<HTMLDivElement>(null);

  // Calculate hand positions
  const calculateHandPositions = useCallback((): {
    hour: HandPosition;
    minute: HandPosition;
    second: HandPosition;
  } => {
    const now = currentTime || new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    // Add subtle jitter for realistic movement
    const jitter = () => Math.random() * 2 - 1;
    
    const secondDegrees = seconds * 6 + jitter() * 0.3;
    const minuteDegrees = minutes * 6 + seconds / 10 + jitter() * 0.02;
    const hourDegrees = hours * 30 + minutes / 2 + jitter() * 0.005;

    // Calculate scaling effects
    const secondScale = 1 + Math.sin((seconds * Math.PI) / 30) * 0.05;
    const minuteScale = 1 + Math.sin((minutes * Math.PI) / 30) * 0.03;
    const hourScale = 1 + Math.sin((hours * Math.PI) / 6) * 0.02;

    return {
      hour: { degrees: hourDegrees, scale: hourScale },
      minute: { degrees: minuteDegrees, scale: minuteScale },
      second: { degrees: secondDegrees, scale: secondScale },
    };
  }, [currentTime]);

  // Update clock hands using requestAnimationFrame
  const updateClockHands = useCallback(() => {
    const positions = calculateHandPositions();

    if (secondHandRef.current) {
      secondHandRef.current.style.transform = `translate(-50%, -100%) rotate(${positions.second.degrees}deg) scaleY(${positions.second.scale})`;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.style.transform = `translate(-50%, -100%) rotate(${positions.minute.degrees}deg) scaleY(${positions.minute.scale})`;
    }
    if (hourHandRef.current) {
      hourHandRef.current.style.transform = `translate(-50%, -100%) rotate(${positions.hour.degrees}deg) scaleY(${positions.hour.scale})`;
    }

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(updateClockHands);
  }, [calculateHandPositions]);

  // Start animation loop
  useEffect(() => {
    updateClockHands();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateClockHands]);

  // Generate clock numbers
  const numbers = useMemo<ClockNumber[]>(() =>
    Array.from({ length: 12 }, (_, index): ClockNumber => ({
      value: index + 1,
      rotation: index * 30,
    }))
    , []);

  return (
    <main className={styles.container}>
      <img
        decoding="async"
        loading="lazy"
        src={scorpImage}
        alt="Background"
        className={styles.background}
      />

      <time dateTime={currentTime.toISOString()} className={styles.clockContainer}>
        <span style={{ display: 'none' }}>{currentTime.toLocaleTimeString()}</span>
        {/* Clock numbers */}
        {numbers.map((num) => (
          <div
            key={num.value}
            className={styles.number}
            style={{
              transform: `translate(-50%, -50%) rotate(${num.rotation}deg) translateY(-40vmin) rotate(-${num.rotation}deg)`,
            }}
          >
            {num.value}
          </div>
        ))}


        {/* Minute Hand */}
        <div className={styles.minuteHand} ref={minuteHandRef}>
          <img
            decoding="async"
            loading="lazy"
            src={minuteHandImage}
            alt="Minute Hand"
            className={styles.handImage}
          />
        </div>

        {/* Second Hand */}
        <div className={styles.secondHand} ref={secondHandRef}>
          <img
            decoding="async"
            loading="lazy"
            src={secondHandImage}
            alt="Second Hand"
            style={{ zIndex: 5 }}
            className={styles.handImage}
          />
        </div>

        {/* Hour Hand */}
        <div className={styles.hourHand} ref={hourHandRef}>
          <img
            decoding="async"
            loading="lazy"
            src={hourHandImage}
            alt="Hour Hand"
            className={styles.handImage}
          />
        </div>
      </time>
    </main>
  );
};

export default Clock;

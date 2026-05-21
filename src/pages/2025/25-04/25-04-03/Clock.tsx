import React, { useEffect, useRef, useMemo, useCallback, FC } from 'react';
import { useSecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import mobyFont from '@/assets/fonts/25fonts/25-04-03-moby.ttf?url';
import waves from '@/assets/images/2025/25-04/25-04-03/waves.gif';
import styles from './Clock.module.css';

// Component Props interface
interface MobyDickClockProps {
  // No props required for this component
}

// Clock position interface
interface ClockPosition {
  x: number;
  y: number;
  fontSize: number;
  opacity: number;
}

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets: string[] = [waves];

const MobyDickClock: FC<MobyDickClockProps> = () => {
  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'MobyClockFont',
      fontUrl: mobyFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  const clockRef = useRef<HTMLTimeElement>(null);
  const positionRef = useRef<ClockPosition>({ x: 0, y: 0, fontSize: 4, opacity: 1 });

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();

  // Calculate new clock position
  const calculateNewPosition = useCallback((): ClockPosition => {
    // Calculate random coordinates using the full viewport dimensions
    // Using percentage-based logic to ensure it stays visible on all screens
    const x = Math.random() * 70; // 0 to 70% of width
    const y = Math.random() * 70; // 0 to 70% of height

    const fontSize = 3 + Math.random() * 5; // rem
    const opacity = Math.random() * 0.7 + 0.3;

    return { x, y, fontSize, opacity };
  }, []);

  // Apply new position to the element
  const applyPosition = useCallback((position: ClockPosition): void => {
    const clock = clockRef.current;
    if (!clock) return;

    // Apply styles with smooth transition
    clock.style.transition =
      'left 3s ease-in-out, top 3s ease-in-out, font-size 3s ease-in-out, opacity 3s ease-in-out';
    
    // Using top/left avoids conflict with the CSS 'float' animation transform
    clock.style.left = `${position.x}%`;
    clock.style.top = `${position.y}%`;
    clock.style.fontSize = `${position.fontSize}rem`;
    clock.style.opacity = position.opacity.toString();
  }, []);

  // Separate effect for time updates to keep them efficient
  useEffect(() => {
    const clock = clockRef.current;
    if (!clock) return;

    clock.textContent = currentTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
    });
    clock.dateTime = currentTime.toISOString();
  }, [currentTime]);

  useEffect(() => {
    let animationFrameId: number;
    let lastMoveTime: number = 0;
    let nextMoveDelay: number = 3000 + Math.random() * 2000;
    let isInitialized: boolean = false;

    const clock = clockRef.current;
    if (clock) {
      clock.style.position = 'absolute';
    }

    const animate = (timestamp: number): void => {
      if (!isInitialized) {
        const pos = calculateNewPosition();
        positionRef.current = pos;
        applyPosition(pos);
        isInitialized = true;
        lastMoveTime = timestamp;
      } else if (timestamp - lastMoveTime >= nextMoveDelay) {
        const pos = calculateNewPosition();
        positionRef.current = pos;
        applyPosition(pos);
        lastMoveTime = timestamp;
        nextMoveDelay = 4000 + Math.random() * 2000;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [calculateNewPosition, applyPosition]);

  return (
    <div
      className={styles.container}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#000', // Fallback background
      }}
    >
      <time
        ref={clockRef}
        className={styles.mobyClock}
        style={{
          display: 'block',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <img
        src={waves}
        alt="waves"
        className={styles.backgroundImage}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default MobyDickClock;

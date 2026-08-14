import mobyFont from '@/assets/fonts/25fonts/25-04-03-moby.ttf?url';
import waves from '@/assets/images/25_images/25-04/25-04-03/waves.gif';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const fontConfigs = useMemo<FontConfig[]>(
    () => [
      {
        fontFamily: 'MobyClockFont',
        fontUrl: mobyFont,
        options: {
          weight: 'normal',
          style: 'normal',
        },
      },
    ],
    [],
  );

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  const clockRef = useRef<HTMLTimeElement>(null);
  const [position, setPosition] = useState<ClockPosition>({
    x: 0,
    y: 0,
    fontSize: 4,
    opacity: 1,
  });
  
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

  // State-driven position updates
  useEffect(() => {
    // Set initial position
    setPosition(calculateNewPosition());
    
    const scheduleNextMove = () => {
      const delay = 4000 + Math.random() * 2000;
      return setTimeout(() => {
        setPosition(calculateNewPosition());
      }, delay);
    };

    const timerId = scheduleNextMove();
    return () => clearTimeout(timerId);
  }, [calculateNewPosition, position]); // Re-run when position changes to schedule the next move

  return (
    <main
      className={styles.container}
      style={{ backgroundImage: `url(${waves})` }}
    >
      <time
        ref={clockRef}
        className={styles.mobyClock}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          fontSize: `${position.fontSize}rem`,
          opacity: position.opacity,
          zIndex: 1,
          transition: 'left 3s ease-in-out, top 3s ease-in-out, font-size 3s ease-in-out, opacity 3s ease-in-out',
        }}
      />
    </main>
  );
};

export default MobyDickClock;

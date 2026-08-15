import mobyFont from '@/assets/fonts/25fonts/25-04-03-moby.ttf?url';
import waves from '@/assets/images/25_images/25-04/25-04-03/waves.gif';
import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

  const [position, setPosition] = useState<ClockPosition>({
    x: 0,
    y: 0,
    fontSize: 4,
    opacity: 1,
  });
  
  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();

  // Memoize the formatted time string
  const timeString = useMemo(
    () =>
      currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }),
    [currentTime],
  );

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

  // State-driven position updates
  useEffect(() => {
    let timerId: number;
    // A self-scheduling function for a clean animation loop.
    const scheduleNextMove = () => {
      const delay = 4000 + Math.random() * 2000; // 4-6 seconds
      timerId = window.setTimeout(() => {
        setPosition(calculateNewPosition()); // Update position
        scheduleNextMove(); // And schedule the next update
      }, delay);
    }
    scheduleNextMove(); // Start the loop
    return () => clearTimeout(timerId);
  }, [calculateNewPosition]); // Only run once on mount

  return (
    <main
      className={styles.container}
      style={{ backgroundImage: `url(${waves})` }}
    >
      <time dateTime={currentTime.toISOString()} className={styles.srOnly}>{currentTime.toLocaleTimeString()}</time>

      {/* Accessible, screen-reader only time */}
      <SRTime time={currentTime} />

      {/* Visual time element */}
      <div
        className={styles.mobyClock}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          fontSize: `${position.fontSize}rem`,
          opacity: position.opacity,
          transition: 'left 3s ease-in-out, top 3s ease-in-out, font-size 3s ease-in-out, opacity 3s ease-in-out',
        }}
      >{timeString}</div>
    </main>
  );
};

const MemoizedMobyDickClock = React.memo(MobyDickClock);
MemoizedMobyDickClock.displayName = 'Clock_25_04_03';
export default MemoizedMobyDickClock;

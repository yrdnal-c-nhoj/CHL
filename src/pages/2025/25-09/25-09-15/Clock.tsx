import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';

// 1. Asset Exports
import m250915font from '@/assets/fonts/25fonts/25-09-15-plaid.ttf?url';
import backgroundImageUrl from '@/assets/images/25_images/25-09/25-09-15/plaid.jpg';

export const assets = [m250915font, backgroundImageUrl];

// 2. Styles
import styles from './Clock.module.css';

// --- Component Props & Font Config ---
interface SkewFlatClockProps {
  horizontalColors?: string[];
  verticalColors?: string[];
  verticalRepeats?: number;
  horizontalRepeats?: number;
}

const fontConfigs: FontConfig[] = [
  { fontFamily: 'PlaidFont', fontUrl: m250915font },
];

const ClockComponent: React.FC<SkewFlatClockProps> = ({
  horizontalColors = ['#BB100A', '#FFFFFF', '#026033'],
  verticalColors = ['#BB100A', '#FFFFFF', '#026033'],
  verticalRepeats = 40,
  horizontalRepeats = 30,
}) => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClock(); // UseSecondClock is sufficient for HH:MM
  const [hue, setHue] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Format time for display
  const timeStr = useMemo(() => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    hours = hours % 12 || 12; // 12-hour format
    return `${hours}:${minutes}_`;
  }, [time]);

  // Animation loop for hue rotation
  useEffect(() => {
    const animate = () => {
      setHue((prev) => (prev + 0.2) % 360);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Memoize the grid generation to prevent re-rendering on every frame
  const TartanGrid = useMemo(() => {
    const createGrid = (colors: string[]) => {
      const rows = [];
      for (let row = 0; row < verticalRepeats; row++) {
        const rowColor = colors[row % colors.length];
        const cols = [];
        for (let col = 0; col < horizontalRepeats; col++) {
          cols.push(
            <span key={`${row}-${col}`} style={{ color: rowColor }}>
              {timeStr}
            </span>,
          );
        }
        rows.push(<div key={row}>{cols}</div>);
      }
      return rows;
    };
    return {
      horizontal: createGrid(horizontalColors),
      vertical: createGrid(verticalColors),
    };
  }, [horizontalColors, verticalColors, horizontalRepeats, verticalRepeats, timeStr]);

  return (
    <main className={styles.container} style={{ filter: `hue-rotate(${hue}deg)` }}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.backgroundGrid}>
        {/* Horizontal threads */}
        <div className={`${styles.tartanGrid} ${styles.horizontal}`}>
          {TartanGrid.horizontal}
        </div>

        {/* Vertical threads */}
        <div className={`${styles.tartanGrid} ${styles.vertical}`}>
          {TartanGrid.vertical}
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_09_15';

export default MemoizedClock;

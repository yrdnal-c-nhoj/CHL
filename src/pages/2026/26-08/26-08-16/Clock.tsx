import React, { useMemo } from 'react';

// 0. Hooks
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';

// 1. Asset Exports
import fontUrl from '@/assets/fonts/26fonts/26-08-16.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-08/26-08-16/crab.webm';
import moonImage from '@/assets/images/26_images/26-08/26-08-16/moon.webp';

// --- Styles ---
import styles from './Clock.module.css';

export const assets = [backgroundImage, moonImage, fontUrl];

// --- Font Configuration ---
const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_08_16', fontUrl },
];

// 2. Main Component
const ClockComponent: React.FC = () => {
  const time = useSecondClock();

  // Load font via Suspense
  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes } = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    return { hours: h, minutes: m };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Accessible time for screen readers */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <video
        className={styles.video}
        src={backgroundImage}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* This div will handle the single, centered image */}
      <div
        aria-hidden="true"
        className={styles.centeredOverlay}
        style={{ backgroundImage: `url(${moonImage})` }}
      />

      {/* Digital Clock Display */}
      <div className={styles.digitalClock}>
        <span>{hours}</span>
        <span>{minutes}</span>
      </div>
    </main>
  );
};

// 3. Performance Wrapper
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_16';

export default MemoizedClock;
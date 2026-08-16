import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports (for preloading)
import fontUrl from '@/assets/fonts/26fonts/26-08-14-halo.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-08/26-08-14/angel.mp4';

export const assets = [backgroundImage, fontUrl];

// 2. Font Configuration
const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_14',
    fontUrl,
  },
];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the canonical hook to get time that updates every second.
  const time = useSecondClock();

  useSuspenseFontLoader(fontConfigs);

  // Memoize the formatted time to prevent recalculating on every render.
  const { hours, minutes, seconds } = useMemo(() => ({
    hours: String(time.getHours()).padStart(2, '0'),
    minutes: String(time.getMinutes()).padStart(2, '0'),
    seconds: String(time.getSeconds()).padStart(2, '0'),
  }), [time]);
  return (
    <main
      className={styles.container}
    >
      <video
        className={styles.backgroundVideo}
        src={backgroundImage}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      {/* A simple digital clock display, centered on the screen. */}
      <time className={styles.digitalClock}>
        <span>{hours}</span>
        <span className={styles.separator}>:</span>
        <span>{minutes}</span>
        <span className={styles.separator}>:</span>
        <span>{seconds}</span>
      </time>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_14';

export default MemoizedClock;
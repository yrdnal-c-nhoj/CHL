import clockVideo from '@/assets/images/26_images/26-08/26-08-04/buster.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { memo, useMemo } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports (Required for preloading pipeline)
// import backgroundImage from '@/assets/images/your-image.webp';
// import fontUrl from '@/assets/fonts/your-font.otf?url';

export const assets: string[] = [
  clockVideo,
  // If you had a custom font for this clock, you'd add fontUrl here too.
];

// 2. Font Configuration (if custom fonts are used)
const fontConfigs: FontConfig[] = [
  // Example:
  // { fontFamily: 'ClockFont_26_08_04', fontUrl: 'path/to/your/font.ttf?url' }
  // For this analog clock, we might not need a custom font for digits,
  // but if you had any text elements, you could define it here.
];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the standardized time hook
  const time = useSecondClock(); // or useMillisecondClock() for smooth

  // Load fonts via Suspense (component must be in <Suspense> boundary)
  useSuspenseFontLoader(fontConfigs);

  // Calculate angles for analog clock hands
  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Calculate degrees for each hand
    // Second hand: 360 degrees / 60 seconds = 6 degrees per second
    const secondAngle = seconds * 6;
    // Minute hand: 360 degrees / 60 minutes = 6 degrees per minute
    // Add seconds contribution: (seconds / 60) * 6 degrees
    const minuteAngle = minutes * 6 + (seconds / 60) * 6;
    // Hour hand: 360 degrees / 12 hours = 30 degrees per hour
    // Add minutes contribution: (minutes / 60) * 30 degrees
    const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;

    return { hourAngle, minuteAngle, secondAngle };
  }, [time]);

  // Accessible standard ISO/time display for assistive tech
  const timeString = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;

  return (
    <main className={styles.container}>
      <div className={styles.videoWrapper}>
        <video
          src={clockVideo}
          className={styles.backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {timeString}
      </time>

      {/* Clock UI */}
      <div className={styles.analogClock}>
        <div className={styles.face}>
          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }}
          />
          <div className={styles.centerDot} />
        </div>
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_04';

export default MemoizedClock;
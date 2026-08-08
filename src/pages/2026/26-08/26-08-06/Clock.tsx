import clockVideo from '@/assets/images/26_images/26-08/26-08-04/buster.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { memo, useMemo } from 'react';
import styles from './Clock.module.css';

// Import the font with the corresponding date from the assets folder
import fontUrl from '@/assets/fonts/26fonts/26-08-04.ttf?url';

// 1. Asset Exports (Required for preloading pipeline)

export const assets: string[] = [
  clockVideo, // The preloader only handles single-video assets correctly. The font is handled by useSuspenseFontLoader.
];

// 2. Font Configuration (if custom fonts are used)
const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_04',
    fontUrl,
  },
];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the standardized time hook
  // 16ms = ~60 FPS updates for perfectly smooth, continuous forward movement
  const time = useMillisecondClock(16);

  // Load fonts via Suspense (component must be in <Suspense> boundary)
  useSuspenseFontLoader(fontConfigs);

  // Calculate angles for analog clock hands
  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const hours = time.getHours() % 12; // Use 12-hour format
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    // Calculate degrees for each hand
    // Second hand: 360 degrees / 60 seconds = 6 degrees per second
    const secondAngle = (seconds + milliseconds / 1000) * 6;
    // Minute hand: 360 degrees / 60 minutes = 6 degrees per minute
    // Add seconds contribution: (seconds / 60) * 6 degrees
    const minuteAngle = (minutes + seconds / 60) * 6;
    // Hour hand: 360 degrees / 12 hours = 30 degrees per hour
    // Add minutes contribution: (minutes / 60) * 30 degrees
    const hourAngle = (hours + minutes / 60) * 30;

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
          {/* Render numbers 1-12 on the clock face */}
          {Array.from({ length: 12 }, (_, i) => {
            const hour = i + 1;
            // Each hour is 30 degrees (360 / 12)
            const angle = hour * 30;
            return (
              <div
                key={`num-${hour}`}
                className={styles.number}
                style={{ '--angle': `${angle}deg` } as React.CSSProperties}
              >
                {hour}
              </div>
            );
          })}
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
import lionImage from '@/assets/images/26_images/26-08/26-08-08/lion.webp';
import clockVideo from '@/assets/images/26_images/26-08/26-08-08/mount.mp4';
import { useClockAngles } from '@/hooks/useClockAngles';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks/useSmoothClock';
import React, { memo } from 'react';
import styles from './Clock.module.css';

// Import the local font file from the assets folder using the ?url suffix.
import fontUrl from '@/assets/fonts/26fonts/26-08-08.ttf?url';

// 1. Asset Exports (Required for preloading pipeline)

export const assets: string[] = [
  clockVideo, // The preloader only handles single-video assets correctly. The font is handled by useSuspenseFontLoader.
  lionImage,
  fontUrl, // Explicitly export the font for preloading.
];

// 2. Font Configuration: Use the canonical Suspense loader with the local font file.
const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_08',
    fontUrl,
  },
];

// Roman numerals for the clock face
const ROMAN_NUMERALS = [
  'i',
  'ii',
  'iii',
  'iv',
  'v',
  'vi',
  'vii',
  'viii',
  'ix',
  'x',
  'xi',
  'xii',
];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the standardized time hook
  // 16ms = ~60 FPS updates for perfectly smooth, continuous forward movement
  const time = useMillisecondClock(16);

  // Load fonts via Suspense, the project's standard and correct method.
  useSuspenseFontLoader(fontConfigs);

  // Calculate angles for analog clock hands
  // Use the shared hook for angle calculations for consistency and maintainability.
  const { hourAngle, minAngle: minuteAngle } = useClockAngles(time);

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
        <img
          src={lionImage}
          className={styles.overlayImage}
          alt="" // Decorative image, alt text is not needed
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
                {ROMAN_NUMERALS[i]}
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
MemoizedClock.displayName = 'Clock_26_08_08';

export default MemoizedClock;
import React, { memo, useMemo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-07-30.ttf?url';
import phobosVideo from '@/assets/images/26_images/26-07/26-07-31/phobos.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

// 1. Asset Exports (Required for preloading pipeline)
export const assets = [phobosVideo, fontUrl];

// 2. Font Configuration
const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_31',
    fontUrl,
  },
];

// 3. Main Component
const PhobosClockComponent: React.FC = () => {
  // Use the standardized time hook
  const time = useMillisecondClock();

  // Load fonts via Suspense, this will pause rendering until the font is ready
  useSuspenseFontLoader(fontConfigs);

  // Memoize angle calculations for performance
  const { hourAngle, minuteAngle, secondAngle, isoTime } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();
    return {
      hourAngle: (hours % 12) * 30 + minutes * 0.5,
      minuteAngle: minutes * 6 + seconds * 0.1,
      secondAngle: seconds * 6 + milliseconds * 0.006,
      isoTime: time.toISOString(),
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <video
        src={phobosVideo}
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Accessible time for screen readers */}
      <time dateTime={isoTime} className="sr-only">
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.clocksWrapper}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className={styles.clockFace}>
            <div
              className={`${styles.hand} ${styles.hourHand}`}
              style={{ transform: `rotate(${hourAngle}deg)` }}
            />
            <div
              className={`${styles.hand} ${styles.minuteHand}`}
              style={{ transform: `rotate(${minuteAngle}deg)` }}
            />
            <div
              className={`${styles.hand} ${styles.secondHand}`}
              style={{ transform: `rotate(${secondAngle}deg)` }}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedPhobosClock = memo(PhobosClockComponent);
MemoizedPhobosClock.displayName = 'Clock_2026_07_31';

export default MemoizedPhobosClock;
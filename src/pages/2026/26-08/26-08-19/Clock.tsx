import SRTime from '@/components/SRTime';
import { useClockAngles } from '@/hooks/useClockAngles';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// ====================================================================================
// 1. ASSET EXPORTS (Required for preloading)
//    - Import your background images and font files here.
//    - The `?url` suffix is required for fonts.
// ====================================================================================
import fontUrl from '@/assets/fonts/26fonts/26-07-10.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-08/26-08-19/map.webp';

export const assets = [backgroundImage, fontUrl];

// ====================================================================================
// 2. FONT CONFIGURATION (Required for custom fonts)
//    - Define the font family name that will be used in the CSS.
// ====================================================================================
const fontConfigs: FontConfig[] = [
  { fontFamily: 'MyAnalogClockFont', fontUrl },
];

// ====================================================================================
// 3. MAIN COMPONENT
// ====================================================================================
const AnalogClockComponent: React.FC = () => {
  // A. Use the canonical time hook. `useMillisecondClock` provides smooth animation.
  //    For a ticking second hand, `useSecondClock` is more performant.
  const time = useMillisecondClock();

  // B. Load fonts via Suspense. This will pause rendering until the font is ready.
  useSuspenseFontLoader(fontConfigs);

  // C. Use the shared `useClockAngles` hook for memoized angle calculations.
  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  // D. Memoize dynamic style objects to prevent re-creation on every render.
  const hourHandStyle = useMemo(() => ({
    transform: `rotate(${hourAngle}deg)`,
  }), [hourAngle]);

  const minuteHandStyle = useMemo(() => ({
    transform: `rotate(${minAngle}deg)`,
  }), [minAngle]);

  const secondHandStyle = useMemo(() => ({
    transform: `rotate(${secAngle}deg)`,
  }), [secAngle]);

  return (
    // E. Root element must be `<main>`.
    <main
      className={styles.container}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* F. Use the shared <SRTime> component for accessibility. */}
      <SRTime time={time} />

      <div className={styles.clockFace}>
        {/* You can add clock face markings here (e.g., 12, 3, 6, 9) */}

        <div className={styles.centerDot} />

        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={hourHandStyle}
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={minuteHandStyle}
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={secondHandStyle}
        />
      </div>
    </main>
  );
};

// ====================================================================================
// 4. PERFORMANCE WRAPPER (Required)
//    - Wrap the component in `React.memo` to prevent unnecessary re-renders.
//    - Set a unique `displayName` for easier debugging in React DevTools.
// ====================================================================================
const MemoizedAnalogClock = React.memo(AnalogClockComponent);
MemoizedAnalogClock.displayName = 'Clock_26_08_19';

export default MemoizedAnalogClock;
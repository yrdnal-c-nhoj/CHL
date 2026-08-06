import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

import fontUrl from '@/assets/fonts/26fonts/26-08-03.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-08/26-08-03/bakermiller.webp';

// 1. Asset Exports (Required for preloading pipeline)
export const assets: string[] = [backgroundImage, fontUrl];

// 2. Font Configuration (if custom fonts are used)
const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_08_03', fontUrl },
];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the standardized time hook
  const time = useSecondClock(); // or useMillisecondClock() for smooth

  // Load fonts via Suspense (component must be in <Suspense> boundary)
  useSuspenseFontLoader(fontConfigs);

  // Memoize expensive calculations
  const { hours, minutes } = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    return { hours: h, minutes: m };
  }, [time]);

  return (
    <main
      className={styles.container}
      style={{ '--bg-image': `url(${backgroundImage})` } as React.CSSProperties}
    >
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      {/* Clock UI */}
      <div className={styles.clockFace}>
        <span>{hours}:{minutes}</span>
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_03';

export default MemoizedClock;
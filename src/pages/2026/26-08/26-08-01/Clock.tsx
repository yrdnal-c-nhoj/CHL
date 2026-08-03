import React, { useMemo } from 'react';

import { useSecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

// Import shared shape components
import Cube from './Cube';
import Pyramid from './Pyramid';
import Sphere from './Sphere';

// 1. Asset Exports (Required for preloading pipeline)
export const assets = [];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the standardized time hook
  const time = useSecondClock();

  // Memoize expensive calculations
  const { hours, minutes, seconds } = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    return { hours: h, minutes: m, seconds: s };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {`${hours}:${minutes}:${seconds}`}
      </time>

      {/* Clock UI */}
      <div className={styles.cubesWrapper}>
        <Cube value={hours} label="Hours" />
        <Sphere value={minutes} label="Minutes" />
        <Pyramid value={seconds} label="Seconds" />
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_01';

export default MemoizedClock;
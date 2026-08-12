import { useSecondClock } from '@/utils/hooks';
import React, { memo, useMemo } from 'react';
import styles from './Clock.module.css';

// No external assets are needed for this simple clock.
export const assets: string[] = [];

const Clock_26_08_12: React.FC = () => {
  const time = useSecondClock();

  const { timeString, accessibleTime } = useMemo(() => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
    const hours12 = String(time.getHours() % 12 || 12);

    return {
      timeString: `${hours}:${minutes}:${seconds}`,
      accessibleTime: `${hours12}:${minutes}:${seconds} ${ampm}`,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.digitalClock}>
        {timeString}
      </time>

      {/* Screen-reader only accessible time */}
      <span className={styles.srOnly} aria-live="polite">
        {accessibleTime}
      </span>
    </main>
  );
};

const MemoizedClock = memo(Clock_26_08_12);
MemoizedClock.displayName = 'Clock_26_08_12';

export default MemoizedClock;
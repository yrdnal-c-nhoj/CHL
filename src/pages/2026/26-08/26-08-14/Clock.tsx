import React from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports (for preloading)
// NOTE: Please replace these placeholder paths with your actual assets.
import backgroundImage from '@/assets/images/26_images/26-08/26-08-14/angel.mp4';

export const assets = [backgroundImage];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Get the current time once for the accessibility element. No hook needed.
  const time = new Date();
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
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_14';

export default MemoizedClock;
import React from 'react';

// 0. Hooks
import { useSecondClock } from '@/utils/hooks';

// 1. Asset Exports
import backgroundImage from '@/assets/images/26_images/26-08/26-08-18/crab.webm';
import moonImage from '@/assets/images/26_images/26-08/26-08-18/moon.webp';

// --- Styles ---
import styles from './Clock.module.css';

export const assets = [backgroundImage, moonImage];

// 2. Main Component
const FullscreenVideoComponent: React.FC = () => {
  const time = useSecondClock();

  return (
    <main className={styles.container}>
      {/* Accessible time for screen readers */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <video
        className={styles.video}
        src={backgroundImage}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <img
        src={moonImage}
        alt=""
        aria-hidden="true"
        className={styles.overlayImage}
      />
    </main>
  );
};

// 3. Performance Wrapper
const MemoizedFullscreenVideo = React.memo(FullscreenVideoComponent);
MemoizedFullscreenVideo.displayName = 'Clock_26_08_18';

export default MemoizedFullscreenVideo;
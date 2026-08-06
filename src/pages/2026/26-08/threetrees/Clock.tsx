import { useSecondClock } from '@/utils/hooks';
import React from 'react';

import hoursVideo from '@/assets/images/26_images/26-08/26-08-03/hours.mp4?url';
import minutesVideo from '@/assets/images/26_images/26-08/26-08-03/minutes.mp4?url';
import secondsVideo from '@/assets/images/26_images/26-08/26-08-03/seconds.mp4?url';
import styles from './Clock.module.css';

// 1. Asset Exports (Required for preloading pipeline)
export const assets: string[] = [hoursVideo, minutesVideo, secondsVideo];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the standardized time hook
  const time = useSecondClock();

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  return (
    <main className={styles.container}>
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toTimeString()}
      </time>

      {/* Clock UI */}
      <div className={styles.videoWrapper}>
        <div className={styles.videoContainer}>
          <video
            src={hoursVideo}
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
          />
          <span className={styles.timeOverlay}>{hours}</span>
        </div>
        <div className={styles.videoContainer}>
          <video
            src={minutesVideo}
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
          />
          <span className={styles.timeOverlay}>{minutes}</span>
        </div>
        <div className={styles.videoContainer}>
          <video
            src={secondsVideo}
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
          />
          <span className={styles.timeOverlay}>{seconds}</span>
        </div>
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_03';

export default MemoizedClock;
import React, { Suspense } from 'react';
import { useClockTime } from '@/utils/hooks';
import styles from './Clock.module.css';
import clockVideo from '@/assets/images/2026/26-05/26-05-18/26-05-18.mp4';

const ClockContent: React.FC = () => {
  const currentTime = useClockTime();

  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.backgroundVideo}
      >
        <source src={clockVideo} type="video/mp4" />
      </video>

      <time dateTime={currentTime.toISOString()} className={styles.digitalTime}>
        {currentTime.toLocaleTimeString()}
      </time>
    </>
  );
};

const DigitalClock: React.FC = () => {
  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <ClockContent />
      </Suspense>
    </div>
  );
};

export default DigitalClock;

import React, { Suspense } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import { ClockLoadingFallback } from '@/utils/fontLoader';
import SRTime from '@/components/SRTime';
import backgroundVideo from '@/assets/images/26_images/26-04/26-04-23/sunflower.mp4';
import styles from './Clock.module.css';

export const assets = [backgroundVideo];

const ClockInner = () => {
  const time = useSmoothClock();

  return (
    <div className={styles.container}>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      <SRTime time={time} />
    </div>
  );
};

const Clock = () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <ClockInner />
  </Suspense>
);

Clock.displayName = 'Clock_26_04_23';

export default Clock;

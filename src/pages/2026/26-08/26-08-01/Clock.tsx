import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useIsDesktop, useSecondClock } from '@/utils/hooks';
import React from 'react';

import bgImage from '@/assets/images/26_images/26-08/26-08-01/bg.webp';
import styles from './Clock.module.css';

export const assets: string[] = [bgImage];

// --- Font Configuration (Canonical Pattern) ---
const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'Pirata One',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Pirata+One&display=swap',
  },
  {
    fontFamily: 'Space Grotesk',
    fontUrl:
      'https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap',
  },
  {
    fontFamily: 'Teko',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Teko&display=swap',
  },
];

const ClockComponent: React.FC = () => {
  const time = useSecondClock();
  const isDesktop = useIsDesktop(); // Still needed for the dynamic background image style

  // Load fonts via Suspense, this will prevent rendering until fonts are ready
  useSuspenseFontLoader(fontConfigs);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  // The background image is the only style that remains dynamic.
  const backgroundStyle: React.CSSProperties = {
    backgroundImage: isDesktop
      ? `image(from url(${bgImage}) rotate 90deg)`
      : `url(${bgImage})`,
  };

  return (
    <main className={styles.container}>
      <div
        aria-hidden="true"
        className={styles.background}
        style={backgroundStyle}
      />
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {`${hours}:${minutes}:${seconds}`}
      </time>

      <div aria-hidden="true" className={styles.contentWrapper}>
        <div className={`${styles.shapeBase} ${styles.hours}`}>{hours}</div>
        <div className={`${styles.shapeBase} ${styles.minutes}`}>
          {minutes}
        </div>
        <div className={`${styles.shapeBase} ${styles.seconds}`}>
          {seconds}
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_01'; // Corrected from previous response

export default MemoizedClock;
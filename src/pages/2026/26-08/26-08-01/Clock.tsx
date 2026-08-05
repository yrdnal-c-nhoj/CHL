import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useEffect } from 'react';

import secondsFont from '@/assets/fonts/26fonts/26--08-01-seconds.ttf?url';
import hoursFont from '@/assets/fonts/26fonts/26-08-01-hours.ttf?url';
import minutesFont from '@/assets/fonts/26fonts/26-08-01-minutes.ttf?url';
import bgImage from '@/assets/images/26_images/26-08/26-08-01/bg.webp';
import styles from './Clock.module.css';

export const assets: string[] = [bgImage, hoursFont, minutesFont, secondsFont];

// --- Font Configuration (Canonical Pattern) ---
const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_08_01_Hours', fontUrl: hoursFont },
  { fontFamily: 'ClockFont_26_08_01_Minutes_Local', fontUrl: minutesFont },
  { fontFamily: 'ClockFont_26_08_01_Seconds', fontUrl: secondsFont },
];

const ClockComponent: React.FC = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  // This effect removes the default browser margin from the body, ensuring the component fills the viewport.
  // It also provides a cleanup function to restore the original margin when the component unmounts.
  useEffect(() => {
    const originalMargin = document.body.style.margin;
    document.body.style.margin = '0';

    return () => {
      document.body.style.margin = originalMargin;
    };
  }, []);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  return (
    <main
      className={styles.container}
      style={{ '--bg-image': `url(${bgImage})` } as React.CSSProperties}
    >
      <div aria-hidden="true" className={styles.background} />
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
MemoizedClock.displayName = 'Clock_26_08_01';

export default MemoizedClock;

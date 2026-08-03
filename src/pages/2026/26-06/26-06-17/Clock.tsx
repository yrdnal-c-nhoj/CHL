import React, { useMemo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-06-17.ttf?url';
import carVideo from '@/assets/images/26_images/26-06/26-06-17/avalanche.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [carVideo, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_17',
    fontUrl,
  },
];

const DigitalClock: React.FC = () => {
  const time = useSecondClock();

  // Load fonts via Suspense, this will pause rendering until the font is ready
  useSuspenseFontLoader(fontConfigs);

  const digits = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    return `${h}${m}${s}`.split('');
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Accessible time for screen readers */}
      <time dateTime={time.toISOString()} className={styles.semanticTime}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.digitalClock}>
        {digits.map((digit, index) => (
          <div key={index} className={styles.digitBox}>{digit}</div>
        ))}
      </div>

      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={carVideo}
      />
    </main>
  );
};

const MemoizedDigitalClock = React.memo(DigitalClock);
MemoizedDigitalClock.displayName = 'Clock_2026_06_17';

export default MemoizedDigitalClock;
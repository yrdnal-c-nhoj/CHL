import React, { useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import myFontWoff2 from '@/assets/fonts/2025/25-08-02-hea.ttf';
// Standardized naming: YY-MM-DD-name.webp
import bg2 from '@/assets/images/2025/25-08/25-08-02/25-08-02-em.webp';
import styles from './Clock.module.css';

// BTS: Export assets for the preloading pipeline
export { bg2 };

// BTS: Export font config for pre-buffering
export const fontConfigs = [
  {
    fontFamily: 'hea',
    fontUrl: myFontWoff2,
    options: { weight: 'normal', style: 'normal' }
  }
];

const DigitalClock: React.FC = () => {
  const time = useClockTime();

  // BTS: Suspend until font is ready to prevent FOUC
  useSuspenseFontLoader(fontConfigs);

  const displayTime = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }, [time]);

  return (
    <main>
      {/* Full-Screen Background Layer for bg2, stretched with distortion */}
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${bg2})` }}
      />

      {/* Clock Display */}
      <time dateTime={time.toISOString()} className={styles.container}>
        {displayTime}
      </time>
    </main>
  );
};

export default DigitalClock;

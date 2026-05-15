// BTS: Use named imports for hooks and types to satisfy the 'automatic' JSX runtime
import { useMemo, type FC } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import myFontWoff2 from '@/assets/fonts/2025/25-08-02-hea.woff2';
import { formatTime } from '@/utils/clockUtils';
// Standardized naming: YY-MM-DD-name.webp
import bg2 from '@/assets/images/2025/25-08/25-08-02/25-08-02-em.webp';
import styles from './Clock.module.css';

// BTS: Export assets for the preloading pipeline
export const assets = [bg2];

// BTS: Export font config for pre-buffering
export const fontConfigs = [
  {
    fontFamily: 'hea',
    fontUrl: myFontWoff2,
    options: { weight: 'normal', style: 'normal' }
  }
];

const DigitalClock: FC = () => {
  const time = useClockTime();

  // BTS: Suspend until font is ready to prevent FOUC
  useSuspenseFontLoader(fontConfigs);

  const displayTime = useMemo(() => {
    return formatTime(time, '24h'); // Using 24h format for consistency, adjust as needed
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

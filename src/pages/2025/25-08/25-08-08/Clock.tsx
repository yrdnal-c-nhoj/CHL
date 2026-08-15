import fontFile_2025_11_01 from '@/assets/fonts/25fonts/25-08-08-q.otf';
import bgImage from '@/assets/images/25_images/25-08/25-08-08/q.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports (Required for preloading pipeline)
export const assets = [bgImage, fontFile_2025_11_01];

const DigitalClock: React.FC = () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = useMemo(() => [
    {
      fontFamily: 'MyCustomFont',
      fontUrl: fontFile_2025_11_01,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ], []);
  useSuspenseFontLoader(fontConfigs);

  const time = useMillisecondClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const hundredths = Math.floor(time.getMilliseconds() / 10)
    .toString()
    .padStart(2, '0');

  // Memoize the time string to prevent re-renders if the time hasn't changed
  const timeString = useMemo(() => `${hours}${minutes}${seconds}${hundredths}`, [hours, minutes, seconds, hundredths]);

  return (
    <main
      className={styles.container}
      style={{
        backgroundImage: `url(${bgImage})`,
        // The offsetX state was unused, so I've set it to 0.
        // If you plan to animate this, you can re-introduce the state.
        backgroundPosition: `0px 0px`,
      }}
    >
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.timeDisplay}>
        {timeString.split('').map((digit, index) => (
          <div key={index} className={styles.digitBox}>
            {digit}
          </div>
        ))}
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(DigitalClock);
MemoizedClock.displayName = 'Clock_25_08_08';

export default MemoizedClock;

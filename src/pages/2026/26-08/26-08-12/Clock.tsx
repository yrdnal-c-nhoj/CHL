import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports
import tileVideo from '@/assets/images/26_images/26-08/26-08-12/tile.mp4';
// Import the font with the corresponding date from the assets folder
import fontUrl from '@/assets/fonts/26fonts/26-08-12.ttf?url';

export const assets: string[] = [tileVideo, fontUrl];

// 2. Font Configuration
const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_12',
    fontUrl,
  },
];

// 3. Main Component
const ClockComponent: React.FC = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const timeString = useMemo(() => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    return `${hours}${minutes}${seconds}`;
  }, [time]);

  return (
    <main className={styles.container}>
      <div className={styles.videoGrid}>
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className={styles.videoTile}>
            <video
              src={tileVideo}
              className={styles.tileVideo}
              autoPlay
              loop
              muted
            />
          </div>
        ))}
      </div>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.digitalClock}>
        <span className={styles.digit}>{timeString[0]}</span>
        <span className={styles.digit}>{timeString[1]}</span>
        <span className={styles.digit}>{timeString[2]}</span>
        <span className={styles.digit}>{timeString[3]}</span>
        <span className={styles.digit}>{timeString[4]}</span>
        <span className={styles.digit}>{timeString[5]}</span>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_12';

export default MemoizedClock;
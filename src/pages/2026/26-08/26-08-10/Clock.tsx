import fontUrl from '@/assets/fonts/26fonts/26-08-10.ttf';
import fairVideo from '@/assets/images/26_images/26-08/26-08-10/fair.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { memo, useMemo } from 'react';
import styles from './Clock.module.css';

// Export assets for the preloading pipeline, as per ARCHITECTURE.md
export const assets: string[] = [fairVideo, fontUrl + '?url'];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_10',
    // The font loader hook requires the '?url' suffix
    fontUrl: fontUrl + '?url',
  },
];

const Clock_26_08_10: React.FC = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const { timeString, accessibleTime } = useMemo(() => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
    const hours12 = String(time.getHours() % 12 || 12);

    return {
      timeString: `${hours}:${minutes}:${seconds}`,
      accessibleTime: `${hours12}:${minutes}:${seconds} ${ampm}`,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <div className={styles.videoWrapper}>
        <video
          className={styles.backgroundVideo}
          src={fairVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <time dateTime={time.toISOString()} className={styles.digitalClock}>
        {timeString}
      </time>

      {/* Screen-reader only accessible time */}
      <span className={styles.srOnly} aria-live="polite">
        {accessibleTime}
      </span>
    </main>
  );
};

const MemoizedClock = memo(Clock_26_08_10);
MemoizedClock.displayName = 'Clock_26_08_10';

export default MemoizedClock;
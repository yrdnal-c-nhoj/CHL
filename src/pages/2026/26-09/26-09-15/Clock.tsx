import type { FontConfig } from '@/types/clock';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

import backgroundVideo from '@/assets/images/26_images/26-09/26-09-15/hamhed.webm';
import fontUrl from '@/assets/fonts/26fonts/26-09-15.ttf?url';
import styles from './Clock.module.css';

export const assets: string[] = [backgroundVideo, fontUrl];

const fontConfigs: FontConfig[] = [{ fontFamily: 'Hammerhead', fontUrl }];

const formatTime = (value: number) => value.toString().padStart(2, '0');

const Clock_26_09_15 = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClock();
  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        className={styles.background}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Two columns: left column has tens digit, right column has ones digit */}
      {/* Three rows: hours (top), minutes (middle), seconds (bottom) */}
      <time className={styles.display} dateTime={time.toISOString()} aria-label="Current time">
        <div className={styles.row}>
          <span className={styles.segment}>{hours[0]}</span>
          <span className={styles.segment}>{hours[1]}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.segment}>{minutes[0]}</span>
          <span className={styles.segment}>{minutes[1]}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.segment}>{seconds[0]}</span>
          <span className={styles.segment}>{seconds[1]}</span>
        </div>
      </time>
    </main>
  );
};

Clock_26_09_15.displayName = 'Clock_26_09_15';

export default Clock_26_09_15;

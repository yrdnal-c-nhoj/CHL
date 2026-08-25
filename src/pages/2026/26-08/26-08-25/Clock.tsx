import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';

import fontUrl from '@/assets/fonts/26fonts/26-08-25a.otf?url';
import backgroundVideo from '@/assets/images/26_images/26-08/26-08-25/radar.webm';
import radarOverlay from '@/assets/images/26_images/26-08/26-08-25/radar3.webp';
import styles from './Clock.module.css';

export const assets: string[] = [backgroundVideo, radarOverlay, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_25',
    fontUrl,
  },
];

const Clock = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');

  return (
    <main className={styles.container}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.backgroundVideo}
        src={backgroundVideo}
        aria-hidden="true"
      />

      <img
        src={radarOverlay}
        className={styles.overlayImage}
        alt=""
        aria-hidden="true"
      />

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.digitalClock}>
        <div className={styles.hourGroup}>
          <span className={styles.digit}>{hours[0]}</span>
          <span className={styles.digit}>{hours[1]}</span>
        </div>
        <div className={styles.minuteGroup}>
          <span className={styles.digit}>{minutes[0]}</span>
          <span className={styles.digit}>{minutes[1]}</span>
        </div>
      </div>
    </main>
  );
};

Clock.displayName = 'Clock_26_08_25';
export default Clock;

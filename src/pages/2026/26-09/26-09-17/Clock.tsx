import type { FontConfig } from '@/types/clock';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

import backgroundVideo from '@/assets/images/26_images/26-09/26-09-17/dance.webm';
import bubblesOverlay from '@/assets/images/26_images/26-09/26-09-17/bubbles.webp';
import fontUrl from '@/assets/fonts/26fonts/26-09-17.otf?url';
import styles from './Clock.module.css';

export const assets: string[] = [backgroundVideo, bubblesOverlay, fontUrl];

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
      <div className={styles.background}>
        <video
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className={styles.bubblesOverlay} style={{ backgroundImage: `url(${bubblesOverlay})` }} />
      <time className={styles.display} dateTime={time.toISOString()} aria-label="Current time">
        <span className={styles.segment}>{hours[0]}</span>
        <span className={styles.segment}>{hours[1]}</span>
        <span className={styles.segment}>{minutes[0]}</span>
        <span className={styles.segment}>{minutes[1]}</span>
        <span className={styles.segment}>{seconds[0]}</span>
        <span className={styles.segment}>{seconds[1]}</span>
      </time>
    </main>
  );
};

Clock_26_09_15.displayName = 'Clock_26_09_15';

export default Clock_26_09_15;

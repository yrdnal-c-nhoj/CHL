import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

import backgroundVideo from '@/assets/images/26_images/26-09/26-09-17/dance.webm';
import bubblesOverlay from '@/assets/images/26_images/26-09/26-09-17/bubbles.webp';
import fontUrl from '@/assets/fonts/26fonts/26-09-17.otf?url';
import styles from './Clock.module.css';

export const assets: string[] = [backgroundVideo, bubblesOverlay, fontUrl];

const fontConfigs: FontConfig[] = [{ fontFamily: 'Hammerhead', fontUrl }];

const pad2 = (value: number) => value.toString().padStart(2, '0');

const Clock_26_09_17 = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClock();

  const rawHours = time.getHours();
  const hours = (rawHours % 12 || 12).toString();
  const minutes = pad2(time.getMinutes());
  const ampm = rawHours >= 12 ? 'pm' : 'am';

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
      <div
        className={styles.bubblesOverlay}
        style={{ backgroundImage: `url(${bubblesOverlay})` }}
      />
      <div className={styles.display} aria-hidden="true">
        {hours.split('').map((digit, index) => (
          <span key={`h${index}`} className={styles.segment}>{digit}</span>
        ))}
        <span className={styles.colon}>:</span>
        {minutes.split('').map((digit, index) => (
          <span key={`m${index}`} className={styles.segment}>{digit}</span>
        ))}
        <span className={styles.ampm}>{ampm}</span>
      </div>
      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_17.displayName = 'Clock_26_09_17';

export default Clock_26_09_17;

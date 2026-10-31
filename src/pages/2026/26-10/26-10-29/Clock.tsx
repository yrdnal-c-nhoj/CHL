import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-29/rave.mp4';
import font from '@/assets/fonts/26fonts/26-10-29.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_29',
  fontUrl: font,
};

const Clock_26_10_29 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const digits = [...hours, ...minutes, ...seconds];

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <div className={styles.digitalClock} aria-hidden="true">
        {digits.map((digit, i) => (
          <span
            key={i}
            className={`${styles.digitBox} ${styles[`digit${i + 1}`]}`}
          >
            <span className={styles.digit}>{digit}</span>
          </span>
        ))}
      </div>
      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_29.displayName = 'Clock_26_10_29';
export default Clock_26_10_29;

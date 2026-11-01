import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-31/threads.mp4';
import font from '@/assets/fonts/26fonts/26-10-31.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_31',
  fontUrl: font,
};

const Clock_26_10_31 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const chars = [
    hours[0],
    hours[1],
    ':',
    minutes[0],
    minutes[1],
    ':',
    seconds[0],
    seconds[1],
  ];

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
        {chars.map((char, i) =>
          char === ':' ? (
            <span key={i} className={styles.separator}>
              {char}
            </span>
          ) : (
            <span key={i} className={styles.digitBox}>
              {char}
            </span>
          ),
        )}
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_31.displayName = 'Clock_26_10_31';
export default Clock_26_10_31;

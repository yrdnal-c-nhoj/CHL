import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-31/threads.mp4';
import font from '@/assets/fonts/26fonts/26-10-31.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const fontConfig = {
  fontFamily: 'ClockFont_26_10_31',
  fontUrl: font,
};

const Clock_26_10_31 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const hhmmss = time.toLocaleTimeString('en-GB', { hour12: false });

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
        {hhmmss.split('').map((char, i) => (
          <span
            key={i}
            className={char === ':' ? styles.separator : styles.digitBox}
          >
            {char}
          </span>
        ))}
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_31.displayName = 'Clock_26_10_31';
export default Clock_26_10_31;

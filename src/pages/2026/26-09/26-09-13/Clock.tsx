
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

import airpoVideo from '@/assets/images/26_images/26-09/26-09-13/chair.webm';
import font from '@/assets/fonts/26fonts/26-09-13.ttf?url';

import styles from './Clock.module.css';

export const assets = [airpoVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_13',
  fontUrl: font,
};

const Clock_26_09_13 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useMillisecondClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  // Two digits representing hundredths of a second.
  const milliseconds = Math.floor(time.getMilliseconds() / 10)
    .toString()
    .padStart(2, '0');

  const displayTime = `${hours}${minutes}${seconds}${milliseconds}`;

  return (
    <main className={styles.container}>
      <video
        className={styles.image}
        src={airpoVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className={styles.clock}>
        {displayTime.split('').map((digit, index) => (
          <span
            key={`${index}-${digit}`}
            className={styles.digitBox}
          >
            {digit}
          </span>
        ))}
      </div>

      <time
        dateTime={time.toISOString()}
        className={styles.srOnly}
      >
        {`${hours}:${minutes}:${seconds}.${milliseconds}`}
      </time>
    </main>
  );
};

Clock_26_09_13.displayName = 'Clock_26_09_13';

export default Clock_26_09_13;

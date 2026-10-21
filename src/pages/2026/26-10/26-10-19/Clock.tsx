import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-19/day.webm';
import font from '@/assets/fonts/26fonts/26-10-19.ttf?url';

export const assets = [font, backgroundVideo];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_19',
  fontUrl: font,
};

const formatDigits = (value: number): string =>
  value.toString().padStart(2, '0');

const Clock_26_10_19 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();

  const hours = formatDigits(time.getHours());
  const minutes = formatDigits(time.getMinutes());

  const display = `${hours}:${minutes}`;

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
        disablePictureInPicture
      />

      <div className={styles.digitalDisplay}>
        {display.split('').map((char, index) => (
          <span
            key={index}
            className={char === ':' ? styles.colon : styles.digit}
          >
            {char}
          </span>
        ))}
      </div>
    </main>
  );
};

Clock_26_10_19.displayName = 'Clock_26_10_19';

export default Clock_26_10_19;

import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';

import clockFont from '@/assets/fonts/26fonts/26-10-23.ttf?url';
import virgoImage from '@/assets/images/26_images/26-10/26-10-23/virgo.webp';
import wheatImage from '@/assets/images/26_images/26-10/26-10-23/wheat.webp';

import styles from './Clock.module.css';

export const assets = [clockFont, virgoImage, wheatImage];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_23',
  fontUrl: clockFont,
};

const formatDigits = (value: number): string =>
  value.toString().padStart(2, '0');

const Clock_26_10_23 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();
  const displayTime = [
    formatDigits(time.getHours()),
    formatDigits(time.getMinutes()),
    formatDigits(time.getSeconds()),
  ].join(':');
  const timeCharacters = Array.from(displayTime);

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.imageLayers} aria-hidden="true">
        <img className={styles.wheatLayer} src={wheatImage} alt="" />
        <img className={styles.virgoLayer} src={virgoImage} alt="" />
      </div>

      <div className={styles.digitalDisplay} aria-hidden="true">
        <span className={styles.time}>
          {timeCharacters.map((character, index) => (
            <span
              className={character === ':' ? styles.separator : styles.digit}
              key={`${character}-${index}`}
            >
              {character}
            </span>
          ))}
        </span>
      </div>
    </main>
  );
};

Clock_26_10_23.displayName = 'Clock_26_10_23';

export default Clock_26_10_23;

import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import backgroundVideo from '@/assets/images/26_images/26-11/26-11-04/eagle.mp4';
import font from '@/assets/fonts/26fonts/26-11-04.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_04',
  fontUrl: font,
};

const DIGIT_TO_LETTER: Record<string, string> = {
  '0': 'F',
  '1': '4',
  '2': '6',
  '3': 'N',
  '4': 'Y',
  '5': 'P',
  '6': 'H',
  '7': '7',
  '8': 'v',
  '9': 'Z',
};

const Clock_26_11_04 = () => {
  const time = useSmoothClock(16);
  useSuspenseFontLoader([fontConfig]);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}${minutes}${seconds}`;
  const digits = timeString.split('');

  const mapDigits = (str: string) =>
    str
      .split('')
      .map((ch) => DIGIT_TO_LETTER[ch] ?? ch)
      .join('');

  const mappedDigits = digits.map(mapDigits);

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
      <SRTime time={time} />
      <div className={styles.grid} aria-hidden="true">
        {/* Mobile: 2 cols × 3 rows (HH, MM, SS each in own row) */}
        {/* Desktop: 1 row × 6 cols */}
        {mappedDigits.map((digit, index) => (
          <div key={index} className={styles.digitBox}>
            <span className={styles.digit}>{digit}</span>
          </div>
        ))}
      </div>
    </main>
  );
};

Clock_26_11_04.displayName = 'Clock_26_11_04';
export default Clock_26_11_04;

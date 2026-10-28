import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import font from '@/assets/fonts/26fonts/26-10-09.ttf?url';

import img1 from '@/assets/images/26_images/26-10/26-10-09/windows.webp';
import img2 from '@/assets/images/26_images/26-10/26-10-09/windows2.webp';
import img3 from '@/assets/images/26_images/26-10/26-10-09/windows3.webp';
import img4 from '@/assets/images/26_images/26-10/26-10-09/windows4.webp';
import img5 from '@/assets/images/26_images/26-10/26-10-09/windows5.webp';
import img6 from '@/assets/images/26_images/26-10/26-10-09/windows6.webp';
import img7 from '@/assets/images/26_images/26-10/26-10-09/windows7.webp';
import img8 from '@/assets/images/26_images/26-10/26-10-09/windows8.webp';
import img9 from '@/assets/images/26_images/26-10/26-10-09/windows9.webp';
import img10 from '@/assets/images/26_images/26-10/26-10-09/windows10.webp';
import img11 from '@/assets/images/26_images/26-10/26-10-09/windows11.webp';

import styles from './Clock.module.css';

const backgroundImages = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
];

export const assets = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  font,
];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_09',
  fontUrl: font,
};

const pad = (value: number): string => value.toString().padStart(2, '0');

const Clock_26_10_09 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();

  // 24-hour digital display with leading zeros: HH:MM:SS
  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  // Cycle through background images — one per second
  const numImages = backgroundImages.length;
  const currentIndex = time.getSeconds() % numImages;

  return (
    <main className={styles.container}>
      {/* Background image layers with cross-fade */}
      <div className={styles.backgroundWrapper}>
        {backgroundImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            className={
              i === currentIndex
                ? styles.backgroundImageActive
                : styles.backgroundImageInactive
            }
            loading={i === currentIndex ? 'eager' : 'lazy'}
            draggable={false}
          />
        ))}
      </div>

      {/* Digital clock display (24-hour, leading zeros, no AM/PM) */}
      <div className={styles.digitalDisplay} aria-hidden="true">
        <span className={styles.digitGroup}>
          {hours.split('').map((d, i) => (
            <span key={`h${i}`} className={styles.digitBox}>
              {d}
            </span>
          ))}
        </span>
        <span className={styles.colon}>:</span>
        <span className={styles.digitGroup}>
          {minutes.split('').map((d, i) => (
            <span key={`m${i}`} className={styles.digitBox}>
              {d}
            </span>
          ))}
        </span>
        <span className={styles.colon}>:</span>
        <span className={styles.digitGroup}>
          {seconds.split('').map((d, i) => (
            <span key={`s${i}`} className={styles.digitBox}>
              {d}
            </span>
          ))}
        </span>
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_09.displayName = 'Clock_26_10_09';

export default Clock_26_10_09;

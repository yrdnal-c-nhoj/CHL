import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import airpoImage from '@/assets/images/26_images/26-09/26-09-04/dickson.webm';
import font from '@/assets/fonts/26fonts/26-09-04.ttf?url';
import styles from './Clock.module.css';

export const assets = [airpoImage, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_04',
  fontUrl: font,
};

const Clock_26_09_04 = () => {
  useSuspenseFontLoader([fontConfig]);
  const time = useClock();

  const rawHours = time.getHours();
  const hours12 = rawHours % 12 || 12;
  const hours = hours12.toString();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = rawHours >= 12 ? 'PM' : 'AM';

  const fullTimeString = `${hours}:${minutes} ${ampm}`;

  return (
    <main className={styles.container}>
      {/* Digital Clock Overlay */}
      <div className={styles.clock}>
        <div className={styles.timeGroup}>
          {hours.split('').map((d, i) => (
            <span key={`h${i}`} className={styles.digitBox}>
              {d}
            </span>
          ))}
        </div>
        <span className={styles.colon}>:</span>
        <div className={styles.timeGroup}>
          {minutes.split('').map((d, i) => (
            <span key={`m${i}`} className={styles.digitBox}>
              {d}
            </span>
          ))}
        </div>
        <div className={styles.ampmGroup}>
          {ampm.split('').map((char, i) => (
            <span key={`ampm${i}`} className={styles.digitBox}>
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Video Element */}
      <video
        src={airpoImage}
        className={styles.image}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Screen-reader-only time */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {fullTimeString}
      </time>
    </main>
  );
};

Clock_26_09_04.displayName = 'Clock_26_09_04';

export default Clock_26_09_04;
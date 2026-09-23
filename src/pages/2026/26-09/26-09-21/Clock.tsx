import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import fontUrl from '@/assets/fonts/26fonts/26-09-19.otf?url';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-21/narrator.webm';
import styles from './Clock.module.css';

export const assets = [fontUrl, backgroundVideo];

const FONT_FAMILY = 'ClockFont_26_09_19';

const fontConfig: FontConfig = {
  fontFamily: FONT_FAMILY,
  fontUrl,
};

const Clock = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(50);

  const hours24 = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';

  const hourDigits = hours12.toString().split('');
  const minuteDigits = minutes.split('');

  return (
    <main className={styles.container}>
      <video
        className={styles.backgroundLayer}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source src={backgroundVideo} type="video/webm" />
      </video>

      <SRTime time={time} />

      <div className={styles.digitalDisplay} aria-hidden="true">
        {hourDigits.map((digit, index) => (
          <span key={`h${index}`} className={styles.digitBox}>
            {digit}
          </span>
        ))}
        <span className={styles.separator} aria-hidden="true">:</span>
        {minuteDigits.map((digit, index) => (
          <span key={`m${index}`} className={styles.digitBox}>
            {digit}
          </span>
        ))}
        <span className={styles.ampm}>{ampm}</span>
      </div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_09_21';
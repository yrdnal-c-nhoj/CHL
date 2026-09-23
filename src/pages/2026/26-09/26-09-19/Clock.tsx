import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import fontUrl from '@/assets/fonts/26fonts/26-09-19.otf?url';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-19/implode.webm';
import styles from './Clock.module.css';

export const assets = [fontUrl, backgroundVideo];

const FONT_FAMILY = 'ClockFont_26_09_19';

const fontConfig: FontConfig = {
  fontFamily: FONT_FAMILY,
  fontUrl,
};

const formatDigits = (value: number, length = 2): string =>
  value.toString().padStart(length, '0');

const digitPair = (value: string): [string, string] => [
  value.charAt(0),
  value.charAt(1),
];

const Clock = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(50);

  const hours = formatDigits(time.getHours());
  const minutes = formatDigits(time.getMinutes());
  const seconds = formatDigits(time.getSeconds());
  const centiseconds = formatDigits(time.getMilliseconds(), 3).slice(0, 2);

  const digits = [
    ...digitPair(hours),
    ...digitPair(minutes),
    ...digitPair(seconds),
    ...digitPair(centiseconds),
  ];

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

      <div className={styles.digitalDisplay} aria-hidden="true">
        {digits.map((digit, index) => (
          <span key={index} className={styles.digitBox}>
            {digit}
          </span>
        ))}
      </div>

      <SRTime time={time} />
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_09_19';

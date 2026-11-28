import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import styles from './Clock.module.css';
import backgroundVideo from '@/assets/images/26_images/26-11/26-11-25/acro.mp4';
import font from '@/assets/fonts/26fonts/26-11-25.ttf?url';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_25',
  fontUrl: font,
};

// Custom letters for each hour position (12 positions)
// Index 0 = 12 o'clock position, then clockwise
const HOUR_LETTERS = [
  'o',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'Y',
];

// Hand characters - using capital A for hour, B for minute
const HOUR_HAND_CHAR = 'a';
const MINUTE_HAND_CHAR = 'a';

const Clock_26_11_25 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;

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
      <div className={styles.clockFace} aria-hidden="true">
        {/* Hour letters at 85% radius - following established geometric pattern */}
        {HOUR_LETTERS.map((letter, i) => {
          const num = i + 1;
          const angle = num * 30;
          const radius = 85; // percentage of clock face radius

          const left = 50 + radius * Math.sin((angle * Math.PI) / 180);
          const top = 50 - radius * Math.cos((angle * Math.PI) / 180);

          return (
            <div
              key={letter}
              className={styles.number}
              style={
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                } as React.CSSProperties
              }
            >
              {letter}
            </div>
          );
        })}

        {/* Hands using font characters */}
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ '--rotation': `${hourDeg}deg` } as React.CSSProperties}
          aria-hidden="true"
        >
          {HOUR_HAND_CHAR}
        </div>
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ '--rotation': `${minuteDeg}deg` } as React.CSSProperties}
          aria-hidden="true"
        >
          {MINUTE_HAND_CHAR}
        </div>
      </div>
    </main>
  );
};

Clock_26_11_25.displayName = 'Clock_26_11_25';

export default Clock_26_11_25;

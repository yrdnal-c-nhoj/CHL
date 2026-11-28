import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import styles from './Clock.module.css';
import backgroundImage from '@/assets/images/26_images/26-11/26-11-27/golden-key-bali-east-paradise-ezgif.com-remove-background.gif';

export const assets = [backgroundImage];

const ROMAN_NUMERALS = [
  'XII',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
];

const Clock_26_11_27 = () => {
  const time = useSmoothClock(16);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;

  return (
    <main
      className={styles.container}
      style={
        {
          '--background-image': `url(${backgroundImage})`,
        } as React.CSSProperties
      }
    >
      <SRTime time={time} />
      <div className={styles.clockFace} aria-hidden="true">
        {/* Roman numerals at 85% radius - matching 26-11-25 geometric pattern */}
        {ROMAN_NUMERALS.map((numeral, i) => {
          const angle = i * 30; // 30 degrees per hour, XII at 0° (top)
          const radius = 85; // percentage of clock face radius

          const left = 50 + radius * Math.sin((angle * Math.PI) / 180);
          const top = 50 - radius * Math.cos((angle * Math.PI) / 180);

          return (
            <div
              key={numeral}
              className={styles.numeral}
              style={
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                } as React.CSSProperties
              }
            >
              {numeral}
            </div>
          );
        })}

        {/* Hour hand */}
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ '--rotation': `${hourDeg}deg` } as React.CSSProperties}
          aria-hidden="true"
        />

        {/* Minute hand */}
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ '--rotation': `${minuteDeg}deg` } as React.CSSProperties}
          aria-hidden="true"
        />
      </div>
    </main>
  );
};

Clock_26_11_27.displayName = 'Clock_26_11_27';

export default Clock_26_11_27;

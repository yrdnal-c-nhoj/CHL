import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import styles from './Clock.module.css';
import backgroundVideo from '@/assets/images/26_images/26-11/26-11-25/acro.mp4';
import font from '@/assets/fonts/26fonts/26-11-25-subset.ttf?url';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_25',
  fontUrl: font,
};

const NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const Clock_26_11_25 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourDeg = (hours + minutes / 60 + seconds / 3600) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

  return (
    <main className={styles.container}>
      <video
        className={styles.backgroundVideo}
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <SRTime time={time} />

      <div className={styles.clockFace} aria-hidden="true">
        {/* Twelve evenly spaced numbers */}
        {NUMBERS.map((number, index) => {
          const angle = index * 30;

          return (
            <div
              key={number}
              className={styles.number}
              style={
                {
                  '--angle': `${angle}deg`,
                  '--radius': '39%',
                } as React.CSSProperties
              }
            >
              {number}
            </div>
          );
        })}

        {/* Sixty evenly spaced tick marks */}
        {Array.from({ length: 60 }, (_, index) => {
          const major = index % 5 === 0;

          return (
            <div
              key={index}
              className={styles.tick}
              style={
                {
                  '--angle': `${index * 6}deg`,
                  '--tick-radius': '46%',
                  '--tick-height': major ? '12px' : '5px',
                  '--tick-width': major ? '3px' : '1px',
                  '--tick-opacity': major ? 1 : 0.5,
                } as React.CSSProperties
              }
            />
          );
        })}

        {/* Hands */}
        <div
          className={styles.hand}
          data-hand="hour"
          style={{ '--rotation': `${hourDeg}deg` } as React.CSSProperties}
        />

        <div
          className={styles.hand}
          data-hand="minute"
          style={{ '--rotation': `${minuteDeg}deg` } as React.CSSProperties}
        />

        <div
          className={styles.hand}
          data-hand="second"
          style={{ '--rotation': `${secondDeg}deg` } as React.CSSProperties}
        />

        <div className={styles.centerDot} />
      </div>
    </main>
  );
};

Clock_26_11_25.displayName = 'Clock_26_11_25';

export default Clock_26_11_25;

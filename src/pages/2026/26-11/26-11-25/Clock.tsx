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

const Clock_26_11_25 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

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
        {/* Hour numbers at 85% radius */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => (
          <div
            key={num}
            className={styles.number}
            style={{ '--angle': `${i * 30}deg` } as React.CSSProperties}
          >
            {num}
          </div>
        ))}

        {/* Tick marks at 92% radius */}
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className={styles.tick}
            style={
              {
                '--angle': `${i * 6}deg`,
                '--major': i % 5 === 0 ? '1' : '0',
              } as React.CSSProperties
            }
          />
        ))}

        {/* Hands */}
        <div
          className={styles.hand}
          style={{ '--rotation': `${hourDeg}deg` } as React.CSSProperties}
          data-hand="hour"
        />
        <div
          className={styles.hand}
          style={{ '--rotation': `${minuteDeg}deg` } as React.CSSProperties}
          data-hand="minute"
        />
        <div
          className={styles.hand}
          style={{ '--rotation': `${secondDeg}deg` } as React.CSSProperties}
          data-hand="second"
        />
        <div className={styles.centerDot} />
      </div>
    </main>
  );
};

Clock_26_11_25.displayName = 'Clock_26_11_25';

export default Clock_26_11_25;

import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

import type { FontConfig } from '@/types/clock';
import type { CSSProperties } from 'react';
import flyImage from '@/assets/images/26_images/26-10/26-10-16/fly.webp';
import callistoImage from '@/assets/images/26_images/26-10/26-10-16/callisto.webp';
import cowVideo from '@/assets/images/26_images/26-10/26-10-16/cow.webm';
import clockFont from '@/assets/fonts/26fonts/26-10-16.ttf?url';

export const assets = [flyImage, callistoImage, cowVideo, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_16',
  fontUrl: clockFont,
};

const romanNumerals = [
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

const Clock = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const s = time.getSeconds() + time.getMilliseconds() / 1000;
  const m = time.getMinutes() + s / 60;
  const h = (time.getHours() % 12) + m / 60;

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.layers}>
        <video
          className={`${styles.layer} ${styles.cowLayer}`}
          src={cowVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
        <div
          className={styles.borders}
          style={
            { '--callisto-image': `url(${callistoImage})` } as CSSProperties
          }
        >
          <div className={`${styles.borderStrip} ${styles.borderTop}`} />
          <div className={`${styles.borderStrip} ${styles.borderRight}`} />
          <div className={`${styles.borderStrip} ${styles.borderBottom}`} />
          <div className={`${styles.borderStrip} ${styles.borderLeft}`} />
        </div>
        <img
          className={`${styles.layer} ${styles.flyLayer}`}
          src={flyImage}
          alt=""
        />
      </div>

      <div className={styles.analogClock}>
        {romanNumerals.map((numeral, i) => {
          const angle = i * 30;
          return (
            <span
              key={i}
              className={styles.numeral}
              style={{
                left: `${50 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
                top: `${50 - 40 * Math.cos((angle * Math.PI) / 180)}%`,
              }}
            >
              {numeral}
            </span>
          );
        })}

        <div
          className={styles.hand}
          style={{ transform: `rotate(${h * 30}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ transform: `rotate(${m * 6}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ transform: `rotate(${s * 6}deg)` }}
        />
      </div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_10_16';

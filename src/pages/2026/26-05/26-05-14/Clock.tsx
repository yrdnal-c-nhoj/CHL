import React, { useMemo } from 'react';
import styles from './Clock.module.css';
import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

// Hardcode the 3 images in this folder so we don't scan the folder at runtime.
// These are the only assets in `src/assets/images/2026/26-05/26-05-14/`.
import balloon from '@/assets/images/2026/26-05/26-05-14/balloon.webp';
import balloon2 from '@/assets/images/2026/26-05/26-05-14/balloon2.webp';
import balloon3 from '@/assets/images/2026/26-05/26-05-14/balloon3.webp';
import balloon4 from '@/assets/images/2026/26-05/26-05-14/balloons4.webp';
import fontUrl from '@/assets/fonts/2026/26-05-14.ttf?url';


const background1 = balloon;
const background2 = balloon2;
const background3 = balloon3;
const background4 = balloon4;

const assetConfigs = [
  { src: background4, hue: 0, saturation: 4.0, zIndex: 0, opacity: 1.0 },
  { src: background3, hue: 45, saturation: 1.4, zIndex: 2, opacity: 1.0 },
  { src: background2, hue: 10, saturation: 2.0, zIndex: 3, opacity: 1.0 },
  { src: background1, hue: 280, saturation: 1.1, zIndex: 4, opacity: 1.0 },
];

export const assets = assetConfigs.map((c) => c.src);

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_05_14',
    fontUrl,
  },
];

const AnalogClock: React.FC = () => {
  const time = useSmoothClock();
  useSuspenseFontLoader(fontConfigs);

  const { hourDeg, minuteDeg, secondDeg, isoTime } = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours();

    const totalSeconds = s + ms / 1000;
    const totalMinutes = m + totalSeconds / 60;
    const totalHours = (h % 12) + totalMinutes / 60;

    return {
      secondDeg: totalSeconds * 6,
      minuteDeg: totalMinutes * 6,
      hourDeg: totalHours * 30,
      isoTime: time.toISOString(),
    };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Render layered background images with custom filters and z-index order */}
      {assetConfigs.map((config, idx) => (
        <img
          key={config.src}
          src={config.src}
          alt=""
          className={styles.backgroundImage}
          aria-hidden="true"
          style={{
            zIndex: config.zIndex,
            opacity: config.opacity,
            filter: `hue-rotate(${config.hue}deg) saturate(${config.saturation})`,
          }}
        />
      ))}

      <div className={styles.analogClock}>
        <time className={styles.face} dateTime={isoTime}>
          {/* Digits */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={styles.digit}
              style={{
                transform: `rotate(${i * 30}deg) translate(0, -46%) rotate(${-i * 30}deg)`,
              }}
            >
              {i === 0 ? '12' : String(i)}
            </div>
          ))}

          {/* Hands */}
          <div className={styles.hourHand} style={{ transform: `rotate(${hourDeg}deg)` }} />
          <div className={styles.minuteHand} style={{ transform: `rotate(${minuteDeg}deg)` }} />
          <div className={styles.secondHand} style={{ transform: `rotate(${secondDeg}deg)` }} />

          <div className={styles.centerDot} />
        </time>
      </div>

    </main>
  );
};

export default AnalogClock;

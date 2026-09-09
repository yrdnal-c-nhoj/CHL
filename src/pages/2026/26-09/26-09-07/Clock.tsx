import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import launchVideo from '@/assets/images/26_images/26-09/26-09-07/launch.webm';
import fontUrl from '@/assets/fonts/26fonts/26-09-07.ttf?url';
import { useMemo, useState } from 'react';
import styles from './Clock.module.css';

export const assets = [launchVideo, fontUrl];

const FONT_FAMILY = 'ClockFont_26_09_07';

const fontConfig: FontConfig = {
  fontFamily: FONT_FAMILY,
  fontUrl,
};

const CYCLE_MS = 53000;
const MIN_FALL_SECONDS = 8;
const SLOWEST_FALL_SECONDS = 42;

const seededRandom = (seed: number): number => {
  let h = seed >>> 0;
  h ^= h >>> 16;
  h = (h * 0x45d9f3b) >>> 0;
  h ^= h >>> 16;
  h = (h * 0x45d9f3b) >>> 0;
  h ^= h >>> 16;
  return h / 4294967296;
};

const Clock_26_09_07 = () => {
  useSuspenseFontLoader([fontConfig]);
  const time = useClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const allDigits = [
    ...hours.split(''),
    ...minutes.split(''),
    ...seconds.split(''),
  ];

  const DIGIT_COUNT = allDigits.length;
  const [mountTime] = useState(() => time.getTime());
  const cycle = Math.floor((time.getTime() - mountTime) / CYCLE_MS);

  const durations = useMemo(() => {
    const entries = Array.from({ length: DIGIT_COUNT }, (_, i) => ({
      i,
      r: seededRandom(cycle * 131 + i + 7),
    }));
    entries.sort((a, b) => a.r - b.r);

    const minDuration = MIN_FALL_SECONDS + seededRandom(cycle * 97 + 5) * 2;

    const durs: number[] = [];
    entries.forEach((entry, rank) => {
      durs[entry.i] =
        rank === DIGIT_COUNT - 1
          ? SLOWEST_FALL_SECONDS
          : minDuration +
            (rank / (DIGIT_COUNT - 1)) * (SLOWEST_FALL_SECONDS - minDuration);
    });
    return durs;
  }, [cycle, DIGIT_COUNT]);

  const fullTimeString = `${hours}:${minutes}:${seconds}`;

  return (
    <main className={styles.container}>
      <video
        src={launchVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.clock}>
        {allDigits.map((digit, index) => (
          <span
            key={`${cycle}-${index}`}
            className={`${styles.digitBox} ${styles.falling}`}
            style={{ animationDuration: `${durations[index]}s` }}
          >
            {digit}
          </span>
        ))}
      </div>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {fullTimeString}
      </time>
    </main>
  );
};

Clock_26_09_07.displayName = 'Clock_26_09_07';

export default Clock_26_09_07;
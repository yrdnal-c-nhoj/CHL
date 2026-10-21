import { memo } from 'react';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import tumbGif from '@/assets/images/25_images/25-05/25-05-04/tumb-ezgif.com-optimize.gif';
import spinnGif from '@/assets/images/25_images/25-05/25-05-04/spinn.gif';
import edGif from '@/assets/images/25_images/25-05/25-05-04/ed-ezgif.com-optimize.gif';
import wallpaperGif from '@/assets/images/25_images/25-05/25-05-04/wallpapaer-ezgif.com-optimize.gif';
import styles from './Clock.module.css';

export const assets = [tumbGif, spinnGif, edGif, wallpaperGif];

const fontConfigs: FontConfig[] = [];

const Clock = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClock();

  const secDeg = time.getSeconds() * 6;
  const minDeg = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hrDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.slideshow}>
        {[tumbGif, spinnGif, edGif].map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={styles.slide}
            style={{ animationDelay: `${i * 3}s` }}
          />
        ))}
      </div>

      <div className={styles.analogClock}>
        <div
          className={styles.hand}
          style={{
            height: '6px',
            background: 'rgb(113, 107, 113)',
            transform: `translateX(-50%) rotate(${hrDeg}deg)`,
          }}
        />
        <div
          className={styles.hand}
          style={{
            height: '6px',
            background: 'rgb(65, 69, 69)',
            transform: `translateX(-50%) rotate(${minDeg}deg)`,
          }}
        />
        <div
          className={styles.hand}
          style={{
            height: '2px',
            background: 'rgb(200, 0, 0)',
            transform: `translateX(-50%) rotate(${secDeg}deg)`,
          }}
        />
      </div>

      <img src={wallpaperGif} alt="" className={styles.wallpaper} />
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_25_05_04';
export default MemoizedClock;

import customFont from '@/assets/fonts/26fonts/26-08-09.ttf?url';
import rubikVideo from '@/assets/images/26_images/26-08/26-08-12/rubik.mp4?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { memo, useMemo } from 'react';
import styles from './Clock.module.css';

export const assets: string[] = [rubikVideo, customFont];

const FONT_FAMILY = 'ClockFont_26_08_09';
interface ClockProps {
  /** Size of each video tile in CSS units (e.g. '200px', '20vw', '15rem') */
  tileSize?: string;
  /** Number of tile copies to render to cover large or high-resolution screens */
  tileCount?: number;
}

const Clock_26_08_12: React.FC<ClockProps> = ({
  tileSize = '300px',
  tileCount = 64,
}) => {
  const fontConfigs = useMemo<FontConfig[]>(() => [{ fontFamily: FONT_FAMILY, fontUrl: customFont }], []);
  useSuspenseFontLoader(fontConfigs);

  const time = useMillisecondClock();

  const { hours, minutes, seconds, milliseconds, accessibleTime } = useMemo(() => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const milliseconds = String(Math.floor(time.getMilliseconds() / 10)).padStart(2, '0');
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
    const hours12 = String(time.getHours() % 12 || 12);

    return {
      hours,
      minutes,
      seconds,
      milliseconds,
      accessibleTime: `${hours12}:${minutes}:${seconds}.${milliseconds} ${ampm}`,
    };
  }, [time]);

  // Dynamically compute the grid style based on the configurable tile size
  const gridStyle = useMemo(
    () => ({ gridTemplateColumns: `repeat(auto-fit, minmax(${tileSize}, 1fr))`, gridAutoRows: tileSize }),
    [tileSize],
  );

  return (
    <main className={styles.container}>
      <div className={styles.videoGridWrapper}>
        <div className={styles.videoGrid} style={gridStyle}>
          {Array.from({ length: tileCount }).map((_, i) => (
            <video
              key={i}
              src={rubikVideo}
              autoPlay
              muted
              loop
              playsInline
              style={tileVideoStyle}
            />
          ))}
        </div>
      </div>

      <time dateTime={time.toISOString()} className={`${styles.digitalClock} ${styles.fontLoaded}`}>
        <span className={styles.timePart}>{hours}</span>
        <span className={styles.timePart}>{minutes}</span>
        <span className={styles.timePart}>{seconds}</span>
        <span className={styles.timePart}>{milliseconds}</span>
      </time>

      <span aria-live="polite" className={styles.srOnly}>
        {accessibleTime}
      </span>
    </main>
  );
};

const MemoizedClock = memo(Clock_26_08_12);
MemoizedClock.displayName = 'Clock_26_08_09';

export default MemoizedClock;
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

// Assets
import fontUrl from '@/assets/fonts/26fonts/26-08-05.ttf?url';
import backgroundVideo from '@/assets/images/26_images/26-08/26-08-05/gravity.webm';
import styles from './Clock.module.css';

export const assets: string[] = [backgroundVideo, fontUrl];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_08_05', fontUrl },
];

// --- GRID & SPACING CONFIGURATION ---
const CLOCKS_PER_SET = 10;
const SPACING_VH = 20;

const DisplayDigits: React.FC<{ hours: string; minutes: string; seconds: string; milliseconds: string }> = React.memo(
  ({ hours, minutes, seconds, milliseconds }) => (
    <>
      <span className={styles.digitBox}>{hours[0]}</span>
      <span className={styles.digitBox}>{hours[1]}</span>
      <span className={styles.separator}>:</span>
      <span className={styles.digitBox}>{minutes[0]}</span>
      <span className={styles.digitBox}>{minutes[1]}</span>
      <span className={styles.separator}>:</span>
      <span className={styles.digitBox}>{seconds[0]}</span>
      <span className={styles.digitBox}>{seconds[1]}</span>
      <span className={styles.separator}>:</span>
      <span className={styles.digitBox}>{milliseconds[0]}</span>
      <span className={styles.digitBox}>{milliseconds[1]}</span>
    </>
  ),
);
DisplayDigits.displayName = 'DisplayDigits';

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useSmoothClock(16);

  const clocks = useMemo(
    () =>
      Array.from({ length: CLOCKS_PER_SET * 2 }, (_, i) => ({
        id: i,
        topOffset: `${i * SPACING_VH}vh`,
      })),
    [],
  );

  const { hours, minutes, seconds, milliseconds, isoTime } = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(time.getMilliseconds() / 10)).padStart(2, '0');
    return {
      hours: h,
      minutes: m,
      seconds: s,
      milliseconds: ms,
      isoTime: `${h}:${m}:${s}.${ms}`,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <div className={styles.videoWrapper}>
        <video
          src={backgroundVideo}
          className={styles.backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <time dateTime={isoTime} className={styles.srOnly}>
        {isoTime}
      </time>

      <div className={styles.clockContainer}>
        {clocks.map(({ id, topOffset }) => (
          <div key={id} className={styles.clockFace} style={{ top: topOffset }}>
            <DisplayDigits hours={hours} minutes={minutes} seconds={seconds} milliseconds={milliseconds} />
          </div>
        ))}
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_05';

export default MemoizedClock;

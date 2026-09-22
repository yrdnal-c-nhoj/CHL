import { memo, useMemo } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import bgVideo from '@/assets/images/26_images/26-04/26-04-26/jetson.mp4';
import jetFont from '@/assets/fonts/26fonts/26-04-26-jet.ttf?url';

import styles from './Clock.module.css';

export const assets = [bgVideo, jetFont];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'Jet',
    fontUrl: jetFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

const Clock = () => {
  const time = useSmoothClock();

  useSuspenseFontLoader(fontConfigs);

  const { displayHours, displayMinutes, displaySeconds } = useMemo(() => {
    return {
      displayHours: formatTime(time.getHours()),
      displayMinutes: formatTime(time.getMinutes()),
      displaySeconds: formatTime(time.getSeconds()),
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <time
        dateTime={time.toISOString()}
        className={styles.srOnly}
      >
        {time.toLocaleTimeString()}
      </time>

      <video
        src={bgVideo}
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className={styles.clockWrapper}>
        <time
          className={styles.timeDisplay}
          dateTime={time.toISOString()}
          aria-label={`${displayHours}:${displayMinutes}:${displaySeconds}`}
        >
          <div className={styles.digitBox}>
            <span className={styles.digit}>{displayHours[0]}</span>
          </div>

          <div className={styles.digitBox}>
            <span className={styles.digit}>{displayHours[1]}</span>
          </div>

          <span className={styles.separator}>:</span>

          <div className={styles.digitBox}>
            <span className={styles.digit}>{displayMinutes[0]}</span>
          </div>

          <div className={styles.digitBox}>
            <span className={styles.digit}>{displayMinutes[1]}</span>
          </div>

          <span className={styles.separator}>:</span>

          <div className={styles.digitBox}>
            <span className={styles.digit}>{displaySeconds[0]}</span>
          </div>

          <div className={styles.digitBox}>
            <span className={styles.digit}>{displaySeconds[1]}</span>
          </div>
        </time>
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_04_26';

export default MemoizedClock;

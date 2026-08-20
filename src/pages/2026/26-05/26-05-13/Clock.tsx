import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo, memo } from 'react';

import dripFont from '@/assets/fonts/26fonts/26-05-13.otf?url';
import bgVideo from '@/assets/images/26_images/26-05/26-05-13/26-05-13-yves.mp4?url';
import analogBgImage from '@/assets/images/26_images/26-05/26-05-13/klein.webp';
import styles from './Clock.module.css';

export const assets = [dripFont, analogBgImage, bgVideo];

const AnalogClock =  () => {
  const now = useMillisecondClock();

  if (!now) return null;

  const fontConfigs = useMemo(
    () => [
      {
        fontFamily: 'BorrowedAnalog',
        fontUrl: dripFont,
        options: {
          weight: 'normal',
          style: 'normal',
        },
      },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, seconds, timeText } = useMemo(() => {
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    return {
      hours: h,
      minutes: m,
      seconds: s,
      timeText: `${h}:${m}:${s}`,
    };
  }, [now]);

  return (
    <main className={styles.container}>
      <time dateTime={now.toISOString()} className={styles.srOnly}>{now.toLocaleTimeString()}</time>

      {/* Video Layer (behind background image) */}
      <video
        className={styles.videoLayer}
        src={bgVideo}
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Background Layer */}
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: `url(${analogBgImage})`,
        }}
      />
      {/* Digital Time Layer */}
      <div className={styles.face}>
        <time className={styles.digitalTime} dateTime={now.toISOString()} aria-label={`Current time ${timeText}`}>
          <span className={styles.digitGroup} aria-hidden="true">
            <span className={styles.digitBox}>{hours[0]}</span>
            <span className={styles.digitBox}>{hours[1]}</span>
            <span className={styles.digitBox}>{minutes[0]}</span>
            <span className={styles.digitBox}>{minutes[1]}</span>
            <span className={styles.digitBox}>{seconds[0]}</span>
            <span className={styles.digitBox}>{seconds[1]}</span>
          </span>
        </time>
      </div>
    </main>
  );
};

const MemoizedAnalogClock = memo(AnalogClock);
MemoizedAnalogClock.displayName = 'Clock_26_05_13';
export default MemoizedAnalogClock;

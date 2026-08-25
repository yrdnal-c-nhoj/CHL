import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React from 'react';

import tornadoVideo from '@/assets/images/26_images/26-08/26-08-20/tornado.mp4';
import tornadoVideoWebM from '@/assets/images/26_images/26-08/26-08-20/tornado.webm';
import fontUrl from '@/assets/fonts/26fonts/26-08-20.ttf?url';
import styles from './Clock.module.css';

export const assets: string[] = [tornadoVideo, tornadoVideoWebM, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_20',
    fontUrl,
  },
];

const ClockComponent = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  return (
    <main className={styles.container}>
      <div className={styles.videoWrapper}>
        <video
          className={styles.video}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={tornadoVideo} type="video/mp4" />
          <source src={tornadoVideoWebM} type="video/webm" />
        </video>
      </div>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.digitalClock}>
        <span className={styles.digit}>{hours[0]}</span>
        <span className={styles.digit}>{hours[1]}</span>
        <span className={styles.colon}>:</span>
        <span className={styles.digit}>{minutes[0]}</span>
        <span className={styles.digit}>{minutes[1]}</span>
        <span className={styles.colon}>:</span>
        <span className={styles.digit}>{seconds[0]}</span>
        <span className={styles.digit}>{seconds[1]}</span>
      </div>
    </main>
  );
};

ClockComponent.displayName = 'Clock_26_08_20';
export default ClockComponent;

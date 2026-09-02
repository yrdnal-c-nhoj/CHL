import type { FontConfig } from '@/types/clock';

import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { memo, useEffect, useRef } from 'react';

import customFont from '@/assets/fonts/26fonts/26-08-27.ttf?url';
import tileImage from '@/assets/images/26_images/26-08/26-08-27/1.webp?url';
import seahorseVideo from '@/assets/images/26_images/26-08/26-08-27/2.webm';
import styles from './Clock.module.css';

export const assets = [seahorseVideo, tileImage];

const CenteredVideoBackground = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = seahorseVideo;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.play().catch(() => {
      // ignore unhandled promise rejection
    });

    return () => {
      video.pause();
      video.src = '';
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={styles.video}
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  );
});
CenteredVideoBackground.displayName = 'CenteredVideoBackground';

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'ClockFont',
    fontUrl: customFont,
  },
];

const DigitalClock = () => {
  const currentTime = useSmoothClock(50);

  useSuspenseFontLoader(FONT_CONFIGS);

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  return (
    <main className={styles.container}>
      <div
        className={styles.tileBackground}
        style={{ '--tile-image': `url(${tileImage})` } as React.CSSProperties}
        aria-hidden="true"
      />
      <CenteredVideoBackground />

      <div className={styles.face}>
        <time dateTime={currentTime.toISOString()} className={styles.digitGroup}>
          <span className={styles.digitBox}>{hours[0]}</span>
          <span className={styles.digitBox}>{hours[1]}</span>
          <span className={styles.digitBox}>{minutes[0]}</span>
          <span className={styles.digitBox}>{minutes[1]}</span>
          <span className={styles.digitBox}>{seconds[0]}</span>
          <span className={styles.digitBox}>{seconds[1]}</span>
        </time>
      </div>
    </main>
  );
};

const MemoizedClock = memo(DigitalClock);
MemoizedClock.displayName = 'Clock_26_08_27';
export default MemoizedClock;

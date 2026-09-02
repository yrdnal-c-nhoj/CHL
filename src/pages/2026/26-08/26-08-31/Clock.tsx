import React, { memo, useMemo } from 'react';
import fontUrl from '@/assets/fonts/26fonts/26-08-10.otf?url';
import fairVideo from '@/assets/images/26_images/26-08/26-08-31/fireworks.webm';
import img0 from '@/assets/images/26_images/26-08/26-08-31/0.webp';
import img1 from '@/assets/images/26_images/26-08/26-08-31/1.webp';
import img2 from '@/assets/images/26_images/26-08/26-08-31/2.webp';
import img3 from '@/assets/images/26_images/26-08/26-08-31/3.webp';
import img4 from '@/assets/images/26_images/26-08/26-08-31/4.webp';
import img5 from '@/assets/images/26_images/26-08/26-08-31/5.webp';
import img6 from '@/assets/images/26_images/26-08/26-08-31/6.webp';
import img7 from '@/assets/images/26_images/26-08/26-08-31/7.webp';
import img8 from '@/assets/images/26_images/26-08/26-08-31/8.webp';
import img9 from '@/assets/images/26_images/26-08/26-08-31/9.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets: string[] = [fairVideo, fontUrl, img0, img1, img2, img3, img4, img5, img6, img7, img8, img9];

const FONT_FAMILY = 'ClockFont_26_08_10';

const fontConfigs: FontConfig[] = [
  {
    fontFamily: FONT_FAMILY,
    fontUrl,
  },
];

const DIGIT_IMAGES: Record<string, string> = {
  '0': img0,
  '1': img1,
  '2': img2,
  '3': img3,
  '4': img4,
  '5': img5,
  '6': img6,
  '7': img7,
  '8': img8,
  '9': img9,
};

const Clock_26_08_10 = () => {
  const time = useSmoothClock();
  useSuspenseFontLoader(fontConfigs);

  const { accessibleTime, timeChars } = useMemo(() => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
    const hours12 = String(time.getHours() % 12 || 12);

    return {
      accessibleTime: `${hours12}:${minutes} ${ampm}`,
      timeChars: `${hours}${minutes}`.split(''),
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <div className={styles.videoWrapper}>
        <video
          className={styles.backgroundVideo}
          src={fairVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <time
        dateTime={time.toISOString()}
        aria-hidden="true"
        className={`${styles.digitalClock} ${styles.fontLoaded}`}
      >
        {timeChars.map((char, index) => (
          <img
            key={index}
            src={DIGIT_IMAGES[char]}
            alt={char}
            className={styles.digit}
          />
        ))}
      </time>

      {/* Screen-reader accessible time */}
      <span className={styles.srOnly} aria-live="polite">
        {accessibleTime}
      </span>
    </main>
  );
};

const MemoizedClock = memo(Clock_26_08_10);
MemoizedClock.displayName = 'Clock_26_08_10';

export default MemoizedClock;

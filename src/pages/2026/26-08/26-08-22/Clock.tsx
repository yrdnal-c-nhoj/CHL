import wallFont from '@/assets/fonts/26fonts/26-08-22.ttf';
import bgImage from '@/assets/images/26_images/26-08/26-08-22/mar.webp';

import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';

import { memo, useEffect, useMemo, useRef, useState } from 'react';

import styles from './Clock.module.css';

export const assets: string[] = [bgImage, wallFont];

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'Wall_26-08-22',
    fontUrl: wallFont,
  },
];

const padZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);

const Clock = () => {
  useSuspenseFontLoader(FONT_CONFIGS);

  const time = useSecondClock();
  const [offset, setOffset] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const imageWidthRef = useRef(0);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const onLoad = () => {
      imageWidthRef.current = img.offsetWidth;
    };
    img.addEventListener('load', onLoad);
    if (img.complete && img.naturalWidth !== 0) {
      onLoad();
    }
    return () => img.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const speed = 10;

    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      setOffset((previousOffset) => {
        const nextOffset = previousOffset + (delta * speed) / 1000;
        const limit = imageWidthRef.current || window.innerWidth * 2;
        return nextOffset >= limit ? 0 : nextOffset;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const formattedTime = useMemo(() => {
    const hours = padZero(time.getHours());
    const minutes = padZero(time.getMinutes());
    const seconds = padZero(time.getSeconds());

    return {
      hours,
      minutes,
      seconds,
      isoString: time.toISOString(),
      displayString: `${hours}:${minutes}:${seconds}`,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <div
        className={styles.panorama}
        style={{
          transform: `translate3d(${-offset}px, 0, 0)`,
        }}
      >
        <img
          src={bgImage}
          alt=""
          draggable={false}
          ref={imgRef}
          className={styles.panoramaImage}
        />
        <img
          src={bgImage}
          alt=""
          draggable={false}
          className={styles.panoramaImage}
        />
      </div>

      <div className={styles.clockGrid}>
        <div className={styles.digitWrapper}>{formattedTime.hours[0]}</div>
        <div className={styles.digitWrapper}>{formattedTime.hours[1]}</div>
        <div className={styles.digitWrapper}>{formattedTime.minutes[0]}</div>
        <div className={styles.digitWrapper}>{formattedTime.minutes[1]}</div>
        <div className={styles.digitWrapper}>{formattedTime.seconds[0]}</div>
        <div className={styles.digitWrapper}>{formattedTime.seconds[1]}</div>
      </div>

      <time dateTime={formattedTime.isoString} className={styles.srOnly}>
        {formattedTime.displayString}
      </time>
    </main>
  );
};

const MemoizedClock = memo(Clock);

MemoizedClock.displayName = 'Clock_26_08_22';

export default MemoizedClock;

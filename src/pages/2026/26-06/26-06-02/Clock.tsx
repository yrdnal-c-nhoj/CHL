import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import styles from './Clock.module.css';

import m1 from '@/assets/images/26_images/26-06/26-06-02/1.webp';
import m3 from '@/assets/images/26_images/26-06/26-06-02/3.webp';
import m4 from '@/assets/images/26_images/26-06/26-06-02/4.webp';
import m5 from '@/assets/images/26_images/26-06/26-06-02/5.webp';
import tile from '@/assets/images/26_images/26-06/26-06-02/tile.webp';

const fontUrl = new URL(
  '../../../../assets/fonts/26fonts/26-06-02.otf',
  import.meta.url,
).href;

const ALL_IMAGES = [m1, m3, m4, m5] as const;
export const assets = [...ALL_IMAGES, tile];

interface ImageData {
  id: number;
  src: string;
  style: React.CSSProperties;
}

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_02',
    fontUrl,
  },
];

const VTEC =  () => {
  const time = useSmoothClock();

  const [visibleImages, setVisibleImages] = useState<ImageData[]>([]);
  const idCounter = useRef(0);
  const [hasMounted, setHasMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout>>();

  useSuspenseFontLoader(fontConfigs);

  const createRandomImage = useCallback((src: string): ImageData => {
    const size = Math.random() * 25 + 15;
    const rotation = Math.random() * 360;

    return {
      id: idCounter.current++,
      src,
      style: {
        left: `${Math.random() * 85 - 5}%`,
        top: `${Math.random() * 85 - 5}%`,
        width: `${size}vmin`,
        transform: `rotate(${rotation}deg)`,
        zIndex: idCounter.current,
      },
    };
  }, []);

  const cycleImage = useCallback(() => {
    setVisibleImages((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const replaceIndex = Math.floor(Math.random() * next.length);
      const randomImg = ALL_IMAGES[Math.floor(Math.random() * ALL_IMAGES.length)] as string;
      next[replaceIndex] = createRandomImage(randomImg);
      return next;
    });
    intervalRef.current = setTimeout(cycleImage, 1000);
  }, [createRandomImage]);

  useEffect(() => {
    const initialSet = ALL_IMAGES.flatMap((src) => {
      const count = src === m1 ? 6 : 3;
      return Array.from({ length: count }, () => createRandomImage(src));
    });

    setVisibleImages(initialSet);
    setHasMounted(true);
    intervalRef.current = setTimeout(cycleImage, 1000);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [cycleImage, createRandomImage]);

  return (
    <main
      className={styles.container}
      style={{
        backgroundImage: `url(${tile})`,
        backgroundPosition: 'center',
        backgroundSize: '15dvh',
      }}
    >
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <time
        className={styles.digitalClock}
        dateTime={time.toISOString()}
        style={{ fontFamily: 'ClockFont_26_06_02' }}
      >
        {[
          time.getHours(),
          time.getMinutes(),
          time.getSeconds(),
        ].flatMap(unit => String(unit).padStart(2, '0').split(''))
         .map((char, i) => (
          <span key={i} className={styles.digitBox}>{char}</span>
        ))}
      </time>

      {visibleImages.map((img) => (
        <img
          key={img.id}
          src={img.src}
          className={
            hasMounted ? styles.vtecImageNoPopIn : styles.vtecImage
          }
          style={img.style}
          alt=""
        />
      ))}
    </main>
  );
};

const MemoizedVTEC = memo(VTEC);
MemoizedVTEC.displayName = 'Clock_26_06_02';
export default MemoizedVTEC;

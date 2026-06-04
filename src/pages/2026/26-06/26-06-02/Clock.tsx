import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Clock.module.css';

import m1 from '@/assets/images/26_images/26-06/26-06-02/1.webp';
// import m2 from '@/assets/images/26_images/26-06/26-06-02/2.webp';
import m3 from '@/assets/images/26_images/26-06/26-06-02/3.webp';
import m4 from '@/assets/images/26_images/26-06/26-06-02/4.webp';
import m5 from '@/assets/images/26_images/26-06/26-06-02/5.webp';
import tile from '@/assets/images/26_images/26-06/26-06-02/tile.webp';

// Import the font with the corresponding date from the assets folder
const fontUrl = new URL(
  '../../../../assets/fonts/26fonts/26-06-02.otf',
  import.meta.url,
).href;

const ALL_IMAGES = [m1, m3, m4, m5] as const; // Explicitly list the 4 imported images
export const assets = [...ALL_IMAGES, tile];

interface ImageData {
  id: number;
  src: string;
  style: React.CSSProperties;
}

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_02',
    // eslint tooling may not understand the ?url import; runtime font loader still expects a string.
    fontUrl, // fontUrl is always a string from new URL().href
  },
];

const VTEC: React.FC = () => {
  const time = useClockTime();

  const [visibleImages, setVisibleImages] = useState<ImageData[]>([]);
  const idCounter = useRef(0);
  const [hasMounted, setHasMounted] = useState(false);


  // Load and suspend rendering until the custom font is ready
  useSuspenseFontLoader(fontConfigs);

  const createRandomImage = useCallback((src: string): ImageData => {
    const size = Math.random() * 25 + 15; // Random size between 15% and 40% vmin
    const rotation = Math.random() * 360; // Full 360 degree random angle

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
  }, [createRandomImage]);

  useEffect(() => {
    // Display all 4 images initially with randomized placement/angles
    const initialSet = ALL_IMAGES.map((src) => createRandomImage(src));
    setVisibleImages(initialSet);
    setHasMounted(true);

    // Start cycling every 1 second
    const interval = setInterval(cycleImage, 1000);
    return () => clearInterval(interval);
  }, [cycleImage, createRandomImage]);

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${tile})`,
        backgroundPosition: 'center',
      }}
    >
      <time
        className={styles.digitalClock}
        dateTime={time.toISOString()}
        style={{ fontFamily: 'ClockFont_26_06_02' }}
      >
        {[
          time.getHours(),
          time.getMinutes(),
          time.getSeconds(),
        ].map(unit => String(unit).padStart(2, '0'))
         .join('')
         .split('')
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
    </div>
  );
};

export default VTEC;
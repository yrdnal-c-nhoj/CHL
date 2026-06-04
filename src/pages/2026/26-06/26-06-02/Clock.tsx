import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Clock.module.css';

// Asset Imports from the matching date folder (26-06-02)
import m1 from '@/assets/images/26_images/26-06/26-06-02/1.webp';
import m2 from '@/assets/images/26_images/26-06/26-06-02/2.webp';
import m3 from '@/assets/images/26_images/26-06/26-06-02/3.webp';
import m4 from '@/assets/images/26_images/26-06/26-06-02/4.webp';
import { default as m5, default as m6, default as m7 } from '@/assets/images/26_images/26-06/26-06-02/5.webp';

import tile from '@/assets/images/26_images/26-06/26-06-02/tile.webp';

// Import the font with the corresponding date from the assets folder
import fontUrl from '@/assets/fonts/26fonts/26-06-02.ttf?url';

const ALL_IMAGES = [m1, m2, m3, m4, m5, m6, m7];

interface ImageData {
  id: number;
  src: string;
  style: React.CSSProperties;
}

const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_06_02', fontUrl },
];

const VTEC: React.FC = () => {
  const time = useClockTime();
  const [visibleImages, setVisibleImages] = useState<ImageData[]>([]);
  const idCounter = useRef(0);

  // Load and suspend rendering until the custom font is ready
  useSuspenseFontLoader(fontConfigs);

  const createRandomImage = useCallback((src: string): ImageData => {
    const size = Math.random() * 25 + 15; // Random size between 15% and 40% of viewport
    const rotation = Math.random() * 60 - 30; // Random rotation between -30 and 30 deg

    return {
      id: idCounter.current++,
      src,
      style: {
        left: `${Math.random() * 70}%`,
        top: `${Math.random() * 70}%`,
        width: `${size}vmin`,
        transform: `rotate(${rotation}deg)`,
        zIndex: idCounter.current,
      },
    };
  }, []);

  const cycleImage = useCallback(() => {
    const randomImg = ALL_IMAGES[Math.floor(Math.random() * ALL_IMAGES.length)];
    const newImage = createRandomImage(randomImg);

    setVisibleImages((prev) => {
      const next = [...prev, newImage];
      // "Paste in the first one and delete the last one"
      // We maintain the double-set count (10 images if using 5 source files)
      const limit = ALL_IMAGES.length * 2;
      if (next.length > limit) {
        return next.slice(1);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    // Display all images twice initially with randomized placement/angles
    const initialSet = [...ALL_IMAGES, ...ALL_IMAGES].map((src) =>
      createRandomImage(src)
    );
    setVisibleImages(initialSet);

    // Start cycling every 1 second
    const interval = setInterval(cycleImage, 1000);
    return () => clearInterval(interval);
  }, [cycleImage, createRandomImage]);

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${tile})` }}>
      <div 
        className={styles.digitalClock} 
        style={{ fontFamily: 'ClockFont_26_06_02' }}
      >
        {String(time.getHours()).padStart(2, '0')}:
        {String(time.getMinutes()).padStart(2, '0')}:
        {String(time.getSeconds()).padStart(2, '0')}
      </div>

      {visibleImages.map((img) => (
        <img
          key={img.id}
          src={img.src}
          className={styles.vtecImage}
          style={img.style}
          alt=""
        />
      ))}
    </div>
  );
};

export default VTEC;
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Clock.module.css';

// Asset Imports from the matching date folder (26-04-12)
import m1 from '@/assets/images/26_images/26-04/26-04-12/1.webp';
import m10 from '@/assets/images/26_images/26-04/26-04-12/10.gif';
import m11 from '@/assets/images/26_images/26-04/26-04-12/11.gif';
import m12 from '@/assets/images/26_images/26-04/26-04-12/12.webp';
import m13 from '@/assets/images/26_images/26-04/26-04-12/13.webp';
import m2 from '@/assets/images/26_images/26-04/26-04-12/2.gif';
import m3 from '@/assets/images/26_images/26-04/26-04-12/3.gif';
import m4 from '@/assets/images/26_images/26-04/26-04-12/4.gif';
import m5 from '@/assets/images/26_images/26-04/26-04-12/5.gif';
import m6 from '@/assets/images/26_images/26-04/26-04-12/6.webp';
import m7 from '@/assets/images/26_images/26-04/26-04-12/7.webp';
import m8 from '@/assets/images/26_images/26-04/26-04-12/8.gif';
import m9 from '@/assets/images/26_images/26-04/26-04-12/9.webp';

const ALL_IMAGES = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13];

interface ImageData {
  id: number;
  src: string;
  style: React.CSSProperties;
}

const VTEC: React.FC = () => {
  const [visibleImages, setVisibleImages] = useState<ImageData[]>([]);
  const idCounter = useRef(0);

  const cycleImage = useCallback(() => {
    const randomImg = ALL_IMAGES[Math.floor(Math.random() * ALL_IMAGES.length)];
    const size = Math.random() * 25 + 15; // Random size between 15% and 40% of viewport
    const rotation = Math.random() * 60 - 30; // Random rotation between -30 and 30 deg
    
    const newImage: ImageData = {
      id: idCounter.current++,
      src: randomImg,
      style: {
        left: `${Math.random() * 70}%`,
        top: `${Math.random() * 70}%`,
        width: `${size}vmin`,
        transform: `rotate(${rotation}deg)`,
        zIndex: idCounter.current,
      },
    };

    setVisibleImages((prev) => {
      const next = [...prev, newImage];
      // Cycle through: layer in a new one while eliminating an oldest one
      // We keep up to 6 images on screen at once
      if (next.length > 6) {
        return next.slice(1);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    // Add a new random image every 2.5 seconds
    const interval = setInterval(cycleImage, 2500);
    cycleImage(); // Initial spawn
    return () => clearInterval(interval);
  }, [cycleImage]);

  return (
    <div className={styles.container}>
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
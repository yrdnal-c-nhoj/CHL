import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Clock.module.css';

// Asset Imports from the matching date folder (26-06-02)
import m1 from '@/assets/images/26_images/26-06/26-06-02/1.webp';
import m2 from '@/assets/images/26_images/26-06/26-06-02/2.webp';
import m3 from '@/assets/images/26_images/26-06/26-06-02/3.webp';
import m4 from '@/assets/images/26_images/26-06/26-06-02/4.webp';
import m5 from '@/assets/images/26_images/26-06/26-06-02/5.webp';
import m6 from '@/assets/images/26_images/26-06/26-06-02/6.webp';

const ALL_IMAGES = [m1, m2, m3, m4, m5, m6];

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
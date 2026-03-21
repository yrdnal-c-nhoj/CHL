import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import font_2024_12_05 from '../../../assets/fonts/25-12-03-dog.ttf?url';
import styles from './Clock.module.css';

const PuppyClockComponent: React.FC = () => {
  const [images, setImages] = useState<{ current: string; next: string }>({ current: '', next: '' });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [time, setTime] = useState(new Date());

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'CustomFont', fontUrl: font_2024_12_05 }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const getNewPuppy = useCallback(async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();

      if (data.status === 'success') {
        const nextUrl = data.message;

        // PRELOADER: Create an off-screen image to "warm" the cache
        const img = new Image();
        img.src = nextUrl;
        img.onload = () => {
          // 1. Set the 'next' image behind the current one
          setImages((prev) => ({ ...prev, next: nextUrl }));

          // 2. Trigger the fade transition
          setIsTransitioning(true);

          // 3. After CSS transition finishes (500ms), swap them permanently
          setTimeout(() => {
            setImages({ current: nextUrl, next: '' });
            setIsTransitioning(false);
          }, 600);
        };
      }
    } catch (error) {
      console.error('Error fetching puppy:', error);
    }
  }, []);

  // Clock tick (Standardized to rAF)
  useEffect(() => {
    let frameId: number;
    const tick = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Image rotation logic
  useEffect(() => {
    getNewPuppy(); // Initial load
    const imageInterval = setInterval(getNewPuppy, 5000);
    return () => {
      clearInterval(imageInterval);
    };
  }, [getNewPuppy]);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${hours}${minutes.toString().padStart(2, '0')} ${ampm}`
      .split('')
      .join(' ');
  };

  return (
    <div className={styles.container}>
      {/* BACKGROUND LAYER 1: The "Old" or Static Image */}
      <div
        className={styles.layer}
        style={{
          backgroundImage: `url(${images.current})`,
          zIndex: 1, // Static layer is lower
        }}
      />

      {/* BACKGROUND LAYER 2: The "New" incoming Image */}
      <div
        className={styles.layer}
        style={{
          backgroundImage: `url(${images.next})`,
          opacity: isTransitioning ? 1 : 0,
          zIndex: 2, // Transitioning layer is higher
        }}
      />

      {/* TIME OVERLAY */}
      <div className={styles.clock}>{formatTime(time)}</div>
    </div>
  );
};

export default PuppyClockComponent;

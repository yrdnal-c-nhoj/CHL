import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import type { FontConfig } from '@/types/clock';
import { formatTime } from '@/utils/clockUtils';
import dogFontUrl from '@/assets/fonts/25fonts/25-12-03-dog.ttf?url';
import styles from './Clock.module.css';

export const fontConfigs: FontConfig[] = [
  { fontFamily: 'CustomFont', fontUrl: dogFontUrl },
];

const PuppyClockComponent: React.FC = () => {
  const [images, setImages] = useState<{ current: string; next: string }>({
    current: '',
    next: '',
  });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const time = useClockTime();

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
          // Set the 'next' image behind the current one
          setImages((prev) => ({ ...prev, next: nextUrl }));

          // 2. Trigger the fade transition
          setIsTransitioning(true);

          // 3. After CSS transition finishes (500ms), swap them permanently
          if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current);
          }

          transitionTimerRef.current = setTimeout(() => {
            setImages({ current: nextUrl, next: '' });
            setIsTransitioning(false);
          }, 600);
        };
      }
    } catch (error) {
      console.error('Error fetching puppy:', error);
    }
  }, []);

  // Image rotation logic
  useEffect(() => {
    getNewPuppy(); // Initial load
    const imageInterval = setInterval(getNewPuppy, 5000);
    return () => {
      clearInterval(imageInterval);
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, [getNewPuppy]);

  return (
    <main className={styles.container}>
      {/* BACKGROUND LAYER 1: The "Old" or Static Image */}
      <div
        className={`${styles.layer} ${styles.currentLayer}`}
        style={{
          backgroundImage: `url(${images.current})`,
        }}
      />

      {/* BACKGROUND LAYER 2: The "New" incoming Image */}
      <div
        className={`${styles.layer} ${styles.nextLayer} ${isTransitioning ? styles.active : ''}`}
        style={{
          backgroundImage: `url(${images.next})`,
        }}
      />

      {/* TIME OVERLAY */}
      <time dateTime={time.toISOString()} className={styles.clock}>
        {formatTime(time, '12h')}
      </time>
    </main>
  );
};

export default PuppyClockComponent;

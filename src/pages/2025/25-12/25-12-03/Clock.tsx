import dogFontUrl from '@/assets/fonts/25fonts/25-12-03-dog.ttf?url';
import type { FontConfig } from '@/types/clock';
import { formatTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Clock.module.css';

export const fontConfigs: FontConfig[] = [
  { fontFamily: 'CustomFont', fontUrl: dogFontUrl },
];

const PuppyClockComponent =  () => {
  const [images, setImages] = useState<{ current: string; next: string }>({
    current: '',
    next: '',
  });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const transitionTimerRef = useRef<number | null>(null);
  const time = useSecondClock();
  const lastFetchSecondRef = useRef<number | null>(null);

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

          transitionTimerRef.current = window.setTimeout(() => {
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
    const currentSecond = time.getSeconds();

    // Initial fetch on component mount
    if (lastFetchSecondRef.current === null) {
      getNewPuppy();
      lastFetchSecondRef.current = currentSecond;
      return;
    }

    // Fetch every 5 seconds, avoiding re-fetch in the same second
    if (currentSecond % 5 === 0 && lastFetchSecondRef.current !== currentSecond) {
      lastFetchSecondRef.current = currentSecond;
      getNewPuppy();
    }

    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, [time, getNewPuppy]);

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

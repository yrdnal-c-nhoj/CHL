import dogFontUrl from '@/assets/fonts/25fonts/25-12-03-dog.ttf?url';
import type { FontConfig } from '@/types/clock';
import { formatTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports
export const assets = [dogFontUrl];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'CustomFont', fontUrl: dogFontUrl },
];

const ClockComponent: React.FC = () => {
  const [images, setImages] = useState<{ current: string; next: string }>({
    current: '',
    next: '',
  });
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
 
          if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current);
          }
 
          // After the CSS transition finishes (600ms), swap them permanently
          transitionTimerRef.current = window.setTimeout(() => {
            setImages({ current: nextUrl, next: '' });
          }, 600);
        };
        img.onerror = () => {
          // If the image fails to load, clear the 'next' state to prevent a broken UI
          setImages((prev) => ({ ...prev, next: '' }));
        }
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
        className={`${styles.layer} ${styles.nextLayer} ${images.next ? styles.active : ''}`}
        style={{
          backgroundImage: `url(${images.next})`,
        }}
      />

      {/* TIME OVERLAY */}
      <time dateTime={time.toISOString()} className={styles.clock}>
        <span className={styles.srOnly}>{time.toLocaleTimeString()}</span>
        {formatTime(time, '12h')}
      </time>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_12_03';

export default MemoizedClock;

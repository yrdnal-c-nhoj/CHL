import dogFontUrl from '@/assets/fonts/25fonts/25-12-03-dog.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Clock.module.css';

export const assets = [dogFontUrl];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'CustomFont', fontUrl: dogFontUrl },
];

const ClockComponent: React.FC = () => {
  const [images, setImages] = useState<{ current: string; next: string }>({
    current: '',
    next: '',
  });
  const time = useSecondClock();
  const lastFetchSecondRef = useRef<number | null>(null);

  useSuspenseFontLoader(fontConfigs);

  const getNewPuppy = useCallback(async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();

      if (data.status === 'success') {
        const nextUrl = data.message;

        const img = new Image();
        img.src = nextUrl;
        img.onload = () => {
          setImages((prev) => ({ ...prev, next: nextUrl }));

          setTimeout(() => {
            setImages({ current: nextUrl, next: '' });
          }, 600);
        };
        img.onerror = () => {
          setImages((prev) => ({ ...prev, next: '' }));
        };
      }
    } catch (error) {
      console.error('Error fetching puppy:', error);
    }
  }, []);

  useEffect(() => {
    const currentSecond = time.getSeconds();

    if (lastFetchSecondRef.current === null) {
      getNewPuppy();
      lastFetchSecondRef.current = currentSecond;
      return;
    }

    if (currentSecond % 5 === 0 && lastFetchSecondRef.current !== currentSecond) {
      lastFetchSecondRef.current = currentSecond;
      getNewPuppy();
    }
  }, [time, getNewPuppy]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const layerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'opacity 0.6s ease-in-out',
  };

  const currentLayerStyle: React.CSSProperties = {
    ...layerStyle,
    backgroundImage: `url(${images.current})`,
    opacity: 1,
    zIndex: 1,
  };

  const nextLayerStyle: React.CSSProperties = {
    ...layerStyle,
    backgroundImage: `url(${images.next})`,
    opacity: images.next ? 1 : 0,
    zIndex: 2,
  };

  const clockStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 10,
    fontFamily: 'CustomFont, sans-serif',
    fontSize: '7vh',
    color: '#f9ebe5',
    textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    transform: 'translateY(12vh)',
    pointerEvents: 'none',
  };

  const srOnlyStyle: React.CSSProperties = {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: '1px',
    whiteSpace: 'nowrap',
    wordWrap: 'normal',
  };

  const hours24 = time.getHours();
  const minutes = time.getMinutes();
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const timeString = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div
        className={styles.layer}
        style={{ backgroundImage: `url(${images.current})` }}
      />
      <div
        className={styles.layer}
        style={{
          backgroundImage: `url(${images.next})`,
          opacity: images.next ? 1 : 0,
        }}
      />

      {/* TIME OVERLAY */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          fontFamily: 'CustomFont, sans-serif',
          fontSize: '7vh',
          color: '#f9ebe5',
          textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          transform: 'translateY(12vh)',
          pointerEvents: 'none',
        }}
      >
        {timeString}
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_12_03';

export default MemoizedClock;

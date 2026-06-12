import React, { useEffect, useMemo, useState } from 'react';

import type { FontConfig } from '@/types/clock';

import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';

import styles from './Clock.module.css';

import fontUrl from '@/assets/fonts/26fonts/26-06-09.otf?url';

// Load all images from the corresponding folder
const imageModules = import.meta.glob(
  '@/assets/images/26_images/26-06/26-06-09/*.{webp,png,jpg,jpeg,gif}',
  { eager: true, query: '?url', import: 'default' },
);
const imageUrls = Object.values(imageModules) as string[];


/**
 * TACTICAL STANDARD: Export assets for preloader synchronization
 */
export const assets = [fontUrl, ...imageUrls];

const NightSky: React.FC = () => {
  const currentTime = useClockTime();

  /*
   * FONT LOADING
   */

  const fontConfigs: FontConfig[] = useMemo(
    () => [
      {
        fontFamily: 'ClockFont',
        fontUrl,
      },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  /*
   * MOBILE DETECTION
   */

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    update();

    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, []);

  /*
   * FORMATTED TIME
   */

  const formattedTime = useMemo(() => {
    if (!currentTime) {
      return { hours: '00', minutes: '00', seconds: '00', meridian: 'AM' };
    }

    const hours24 = currentTime.getHours();
    const hours12 = hours24 % 12 || 12;
    const meridian = hours24 >= 12 ? 'PM' : 'AM';

    return {
      hours: hours12.toString().padStart(2, '0'),
      minutes: currentTime.getMinutes().toString().padStart(2, '0'),
      seconds: currentTime.getSeconds().toString().padStart(2, '0'),
      meridian,
    };
  }, [currentTime]);
  const clockCharacters = useMemo(() => {
    const { hours, minutes, seconds, meridian } = formattedTime;

    return [
      hours[0],
      hours[1],
      minutes[0],
      minutes[1],
      seconds[0],
      seconds[1],
      meridian[0],
      meridian[1],
    ].map((c) => c ?? '0');
  }, [formattedTime]);


  /*
   * OPTIMIZED GRID MAP CALCULATION
   * Memoized to prevent recalculations on every render
   */

  const gridMap = useMemo(() => {
    return isMobile
      ? [
          ['1', '1'],
          ['2', '1'],
          ['1', '2'],
          ['2', '2'],
          ['1', '3'],
          ['2', '3'],
          ['1', '4'],
          ['2', '4'],
        ]
      : [
          ['1', '1'],
          ['2', '1'],
          ['3', '1'],
          ['4', '1'],
          ['1', '2'],
          ['2', '2'],
          ['3', '2'],
          ['4', '2'],
        ];
  }, [isMobile]);

  /*
   * BACKGROUND GRID IMAGE STATE
   * Managed via state to allow for per-second individual cell updates.
   */
  const [gridImages, setGridImages] = useState<(string | null)[]>(() => {
    if (imageUrls.length === 0) return Array(15).fill(null);
    const shuffled = [...imageUrls].sort(() => Math.random() - 0.5);
    const result = shuffled.slice(0, 15);
    while (result.length < 15) result.push(null);
    return result;
  });

  /*
   * PER-SECOND INDIVIDUAL CELL REFRESH
   * Wait 1s after load, then swap one random cell's image every second.
   */
  useEffect(() => {
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setGridImages((prev) => {
          const next = [...prev];
          const randomIndex = Math.floor(Math.random() * 15);
          
          // Identify images currently NOT in the grid to ensure "not been used yet"
          const usedSet = new Set(prev);
          const available = imageUrls.filter((url) => !usedSet.has(url));
          
          if (available.length > 0) {
            const newImg = available[Math.floor(Math.random() * available.length)];
            next[randomIndex] = newImg;
          }
          
          return next;
        });
      }, 700);

      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(startDelay);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundGrid}>
        {gridImages.map((src, i) => (
          <div 
            key={i} 
            className={styles.gridCell} 
            style={src ? { backgroundImage: `url(${src})` } : {}}
          />
        ))}
      </div>
      <time dateTime={currentTime?.toISOString()} aria-live="polite">
        <div className={styles.timeGrid}>
          {clockCharacters.map((char, index) => (
            <div
              key={index}
              className={styles.charCell}
              style={{
                '--grid-col': gridMap[index]?.[0] || '1',
                '--grid-row': gridMap[index]?.[1] || '1',
              } as React.CSSProperties}
            >
              <div
                className={
                  `${styles.timeElement} ${
                    isMobile ? styles.timeElementMobile : styles.timeElementDesktop
                  }${index >= 6 ? ` ${styles.timeElementUppercase}` : ''}`
                }
                style={{
                  '--index': index,
                } as React.CSSProperties}
              >
                {char}
              </div>
            </div>
          ))}
        </div>
      </time>
    </div>
  );
};

export default NightSky;

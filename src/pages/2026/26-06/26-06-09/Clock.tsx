import React, { useEffect, useMemo, useState, memo } from 'react';

import type { FontConfig } from '@/types/clock';

import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';

import fontUrl from '@/assets/fonts/26fonts/26-06-09.otf?url';
import styles from './Clock.module.css';

const imageModules = import.meta.glob(
  '@/assets/images/26_images/26-06/26-06-09/*.{webp,png,jpg,jpeg,gif}',
  { eager: true, query: '?url', import: 'default' },
);
const imageUrls = Object.values(imageModules) as string[];

export const assets = [fontUrl, ...imageUrls];

const NightSky =  () => {
  const time = useSecondClock();

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

  const formattedTime = useMemo(() => {
    const hours24 = time.getHours();
    const hours12 = hours24 % 12 || 12;
    const meridian = hours24 >= 12 ? 'PM' : 'AM';

    return {
      hours: hours12.toString().padStart(2, '0'),
      minutes: time.getMinutes().toString().padStart(2, '0'),
      seconds: time.getSeconds().toString().padStart(2, '0'),
      meridian,
    };
  }, [time]);

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

  const [gridImages, setGridImages] = useState<(string | null)[]>(() => {
    if (imageUrls.length === 0) return Array(15).fill(null);
    const shuffled = [...imageUrls].sort(() => Math.random() - 0.5);
    const result = shuffled.slice(0, 15);
    while (result.length < 15) result.push(null);
    return result;
  });

  useEffect(() => {
    const timerRef = { current: null as ReturnType<typeof setTimeout> | null };
    
    const startDelay = setTimeout(() => {
      const cycle = () => {
        setGridImages((prev) => {
          const next = [...prev];
          const randomIndex = Math.floor(Math.random() * 15);
          const usedSet = new Set(prev);
          const available = imageUrls.filter((url) => !usedSet.has(url));
          if (available.length > 0) {
            const newImg = available[Math.floor(Math.random() * available.length)];
            next[randomIndex] = newImg;
          }
          return next;
        });
        timerRef.current = setTimeout(cycle, 700);
      };
      cycle();
    }, 1000);

    return () => {
      clearTimeout(startDelay);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div className={styles.backgroundGrid}>
        {gridImages.map((src, i) => (
          <div
            key={i}
            className={styles.gridCell}
            style={src ? { backgroundImage: `url(${src})` } : {}}
          />
        ))}
      </div>
      <time dateTime={time.toISOString()} aria-live="polite">
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
    </main>
  );
};

const MemoizedNightSky = memo(NightSky);
MemoizedNightSky.displayName = 'Clock_26_06_09';
export default MemoizedNightSky;

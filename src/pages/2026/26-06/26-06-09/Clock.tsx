import React, { useEffect, useMemo, useState } from 'react';

import type { FontConfig } from '@/types/clock';

import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';

import styles from './Clock.module.css';

import fontUrl from '@/assets/fonts/26fonts/26-06-09.ttf?url';

/**
 * TACTICAL STANDARD: Export assets for preloader synchronization
 */
export const assets = [fontUrl];

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

  return (
    <div className={styles.container}>
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

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useClockTime } from '@/utils/hooks';
import { formatTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import styles from './Clock.module.css';

import fontUrl from '@/assets/fonts/2026/26-05-10.ttf?url';
import backgroundImage from '@/assets/images/2026/26-05/26-05-10/23.gif';

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
    []
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
    const {
      hours = '00',
      minutes = '00',
      seconds = '00'
    } = formatTime(currentTime, '12h') || {};
    const meridian = currentTime.getHours() >= 12 ? 'PM' : 'AM';
    return { hours, minutes, seconds, meridian };
  }, [currentTime]);

  const clockCharacters = useMemo(() => {
    const { hours, minutes, seconds, meridian } = formattedTime;

    return [
      hours[0] || '0',
      hours[1] || '0',
      minutes[0] || '0',
      minutes[1] || '0',
      seconds[0] || '0',
      seconds[1] || '0',
      meridian[0] || 'A',
      meridian[1] || 'M'
    ];
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
    <div
      className={styles.container}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        height: '100dvh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'contrast(1.5) hue-rotate(80deg) saturate(0.2)',
      }}
    >
      <time dateTime={currentTime?.toISOString()} aria-live="polite">
        <div
        style={{
          position: 'absolute',
          inset: 0,

          width: '100%',
          height: '100%',

          display: 'grid',

          gridTemplateColumns: isMobile
            ? '1fr 1fr'
            : '1fr 1fr 1fr 1fr',

          gridTemplateRows: isMobile
            ? '1fr 1fr 1fr 1fr'
            : '1fr 1fr',

          zIndex: 20,
        }}
      >
        {clockCharacters.map((char, index) => (
          <div
            key={index}
            style={{
              gridColumn: gridMap[index]?.[0] || '1',
              gridRow: gridMap[index]?.[1] || '1',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
            }}
          >
            <div
              className={`
                ${styles.timeElement}
                ${
                  isMobile
                    ? styles.timeElementMobile
                    : styles.timeElementDesktop
                }
                ${
                  index >= 6
                    ? styles.timeElementUppercase
                    : ''
                }
              `}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `
                  translate(-50%, -50%)
                  translate(${index * -2}px, ${
                  index * 1.5
                }px)
                `,
                zIndex: index + 1,
                pointerEvents: 'none',
                userSelect: 'none',
                mixBlendMode: 'screen',
                fontFamily: 'ClockFont',
                fontSize: isMobile
                  ? '58vh'
                  : '58vw',
                lineHeight: 0.8,
                color: '#222222B6',
                opacity: 0.6,
                filter: `
                  drop-shadow(1px 1px 0px white)
                  drop-shadow(0 0 10px rgba(255,255,255,0.45))
                  drop-shadow(0 0 24px rgba(255,255,255,0.2))
                `,
              }}
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
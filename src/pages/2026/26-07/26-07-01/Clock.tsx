import React, { useEffect, useMemo, useState } from 'react';

import type { FontConfig } from '@/types/clock';
import { formatTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';

import fontUrl from '@/assets/fonts/26fonts/26-06-29.ttf?url';
import carVideo from '@/assets/images/26_images/26-06/26-06-29/manufacture.mp4';

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

    const formatted = formatTime(currentTime, '12h');
    const match = formatted.match(/^(\d{2}):(\d{2}):(\d{2})\s+(AM|PM)$/);
    
    if (!match) {
      const meridian = currentTime.getHours() >= 12 ? 'PM' : 'AM';
      const hours12 = currentTime.getHours() % 12 || 12;
      const hours = hours12.toString().padStart(2, '0');
      return {
        hours,
        minutes: currentTime.getMinutes().toString().padStart(2, '0'),
        seconds: currentTime.getSeconds().toString().padStart(2, '0'),
        meridian,
      };
    }

    const [, hours, minutes, seconds, meridian] = match;
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
      meridian[1] || 'M',
    ];
  }, [formattedTime]);

  /*
   * OPTIMIZED GRID MAP CALCULATION
   */
  const gridMap = useMemo(() => {
    return isMobile
      ? [
          ['1', '1'], ['2', '1'],
          ['1', '2'], ['2', '2'],
          ['1', '3'], ['2', '3'],
          ['1', '4'], ['2', '4'],
        ]
      : [
          ['1', '1'], ['2', '1'], ['3', '1'], ['4', '1'],
          ['1', '2'], ['2', '2'], ['3', '2'], ['4', '2'],
        ];
  }, [isMobile]);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100vh',
        background: '#000428',
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          zIndex: 1,
        }}
        src={carVideo}
      />
      <time dateTime={currentTime?.toISOString()} aria-live="polite">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
            gridTemplateRows: isMobile ? '1fr 1fr 1fr 1fr' : '1fr 1fr',
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
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `
                    translate(-50%, -50%)
                    translate(${index * -2}px, ${index * 1.5}px)
                  `,
                  zIndex: index + 1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  mixBlendMode: 'screen',
                  fontFamily: 'ClockFont',
                  fontSize: isMobile ? '58vh' : '58vw',
                  lineHeight: 0.8,
                  color: '#333333',
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
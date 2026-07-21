import fontUrl from '@/assets/fonts/26fonts/26-07-15.ttf?url';
import chandelierBg from '@/assets/images/26_images/26-07/26-07-15/root.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

export const assets = [chandelierBg, fontUrl];

const FONT_FAMILY = 'CustomFont260715';

const AnalogClock: React.FC = () => {
  const time = useSecondClock();

  // Load the custom font using the suspense-based loader
  const fontConfigs = useMemo(
    () => [
      {
        fontFamily: FONT_FAMILY,
        fontUrl,
        options: { weight: 'normal', style: 'normal' },
      },
    ],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  // Calculate rotation angles for the clock hands
  const { hourDegrees, minuteDegrees, secondDegrees } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    // Calculate smooth rotations for each hand
    const sec = (seconds + milliseconds / 1000) * 6;
    const min = (minutes + seconds / 60) * 6;
    const hr = (hours % 12) * 30 + minutes * 0.5;

    return { hourDegrees: hr, minuteDegrees: min, secondDegrees: sec };
  }, [time]);

  return (
    <main
      className={styles.container}
      style={{ '--font-family': FONT_FAMILY } as React.CSSProperties}
    >
      <div
        className={styles.background}
        style={{ '--bg-image': `url(${chandelierBg})` } as React.CSSProperties}
      />
      <svg
        viewBox="0 0 200 200"
        className={styles.clockSvg}
      >
        {/* Filter for text shadow */}
        <defs>
          <filter id="text-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1" dy="1" stdDeviation="0" floodColor="#000" floodOpacity="0.8" /></filter>
        </defs>

        {/* Clock Face */}
        <circle cx="100" cy="100" r="98" fill="rgba(0, 0, 0, 0)" />

        {/* Hour Markers and Numbers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const hour = i + 1;
          const angle = (hour * 30 - 90) * (Math.PI / 180);
          const radius = 84;
          const x = 100 + radius * Math.cos(angle);
          const y = 100 + radius * Math.sin(angle);
          return (
            <g key={hour}>
              <line
                x1="100"
                y1="8"
                x2="100"
                y2="15"
                transform={`rotate(${i * 30} 100 100)`}
              />
              <text
                x={x}
                y={y}
                dy="0.35em"
                className={styles.hourMarkerText}
              >
                {hour}
              </text>
            </g>
          );
        })}

        {/* Hour Hand */}
        <g transform={`rotate(${hourDegrees} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="60" className={styles.hourHand} />
        </g>

        {/* Minute Hand */}
        <g transform={`rotate(${minuteDegrees} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="40" className={styles.minuteHand} />
        </g>

        {/* Second Hand */}
        <g transform={`rotate(${secondDegrees} 100 100)`}>
          <line x1="100" y1="110" x2="100" y2="30" className={styles.secondHand} />
        </g>

        {/* Center Pin */}
        <circle cx="100" cy="100" r="4" className={styles.centerPin} />
      </svg>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

export default AnalogClock;
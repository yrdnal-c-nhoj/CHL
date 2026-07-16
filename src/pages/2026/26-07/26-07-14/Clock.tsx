import fontUrl from '@/assets/fonts/26fonts/26-07-14.ttf?url';
import chandelierBg from '@/assets/images/26_images/26-07/26-07-14/root.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import React, { useMemo } from 'react';

export const assets = [chandelierBg, fontUrl];

const FONT_FAMILY = 'CustomFont260714';

const AnalogClock: React.FC = () => {
  const time = useClockTime();

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

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100dvh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: '#000', // Fallback color
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${chandelierBg})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '100% 100%',
    filter: 'contrast(0.9) brightness(1.5)',
    zIndex: 0,
  };

  return (
    <main style={containerStyle}>
      <div style={backgroundStyle} />
      <svg
        viewBox="0 0 200 200"
        style={{
          width: 'min(80vw, 80vh)',
          height: 'min(80vw, 80vh)',
          position: 'relative', // Ensure SVG is in the same stacking context
          zIndex: 1,
       }}
      >
        {/* Filter for text shadow */}
        <defs>
          <filter id="text-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="1" stdDeviation="0" floodColor="#000" floodOpacity="0.8" />
          </filter>
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
                textAnchor="middle"
                style={{
                  fill: '#D7CCBF',
                  fontSize: '2vh',
                  fontWeight: 'normal',
                  fontFamily: FONT_FAMILY,
                  filter: 'url(#text-shadow)',
                }}
              >
                {hour}
              </text>
            </g>
          );
        })}

        {/* Hour Hand */}
        <g transform={`rotate(${hourDegrees} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="60" stroke="#F3E8DA" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Minute Hand */}
        <g transform={`rotate(${minuteDegrees} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="40" stroke="#F3E8DA" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Second Hand */}
        <g transform={`rotate(${secondDegrees} 100 100)`}>
          <line x1="100" y1="110" x2="100" y2="30" stroke="#BBC17E" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Center Pin */}
        <circle cx="100" cy="100" r="4" fill="#ABC17E"stroke="#F3E8DA" strokeWidth="1" />
      </svg>
    </main>
  );
};

export default AnalogClock;
import chandelierBg from '@/assets/images/26_images/26-06/26-06-27/clover.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import React, { useMemo } from 'react';

// Assuming the font file is named according to the date in the assets folder.
import fontUrl from '@/assets/fonts/26fonts/26-06-27.otf?url';

export const assets = [chandelierBg, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_27',
    fontUrl,
  },
];

const AnalogClock: React.FC = () => {
  const time = useClockTime();
  useSuspenseFontLoader(fontConfigs);
  
  const { hourDegrees, minuteDegrees, secondDegrees } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hr = (hours % 12) * 30 + minutes * 0.5;
    const min = minutes * 6;
    const sec = seconds * 6;

    return { hourDegrees: hr, minuteDegrees: min, secondDegrees: sec };
  }, [time]);

  return (
    <main className="clock-container">
      <style>
        {`
          .clock-container {
            position: relative; /* Establish positioning context for pseudo-element */
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100dvh;
            background-color: #000;
            margin: 0;
            padding: 0;
            overflow: hidden; /* Prevents edge spilling when background is rotated */
          }

          /* --- ONE CUTOFF PLACE: 768px --- */

          /* Phone / Portrait Mode (Below 768px) */
          @media (max-width: 768px) {
            .clock-container::before {
              content: '';
              position: absolute;
              /* Over-size the canvas to account for 90-degree corner clip gap */
              width: 100dvh; 
              height: 100vw;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(90deg);
              background-image: url(${chandelierBg});
              background-repeat: no-repeat;
              filter: saturate(200%) contrast(0.1.3) brightness(1.1);
              background-position: center center;
              background-size: cover;
              z-index: 1;
            }
          }

          /* Laptop / Landscape Mode (769px and above) */
          @media (min-width: 769px) {
            .clock-container {
              background-image: url(${chandelierBg});
              background-repeat: no-repeat;
              filter: saturate(400%) contrast(0.1.3) brightness(1.1);
              background-position: center center;
              background-size: cover
            }
          }
          
          /* Ensure the clock stays floating over the pseudo-element background on mobile */
          .clock-svg {
            position: relative;
            z-index: 2;
          }
        `}
      </style>

     {/* Analog Clock SVG */}
      <svg
        className="clock-svg"
        viewBox="0 0 200 200"
        style={{
          width: 'min(88vw, 88vh, 600px)',
          height: 'min(88vw, 88vh, 600px)',
          borderRadius: '50%',
          marginTop: '-1vh',
        }}
      >
        {/* Glow Filter Definition */}
        <defs>
          <filter id="glow-light" x="-90%" y="-90%" width="200%" height="200%">
            {/* Blurs the input to create the glow "blob" effect */}
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Clock Numbers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const hour = i + 1;
          const angle = (hour * 30 - 90) * (Math.PI / 180); // -90 to start from 12 o'clock
          const radius = 85;
          const x = 100 + radius * Math.cos(angle);
          const y = 100 + radius * Math.sin(angle);

          return (
            <text
              key={hour}
              x={x}
              y={y}
              dy="0.35em" // Vertically center
              textAnchor="middle"
              fontSize="6vh"
              fill="#7B9F54"
              style={{ userSelect: 'none', fontFamily: 'ClockFont_26_06_27' }}
            >
              {hour}
            </text>
          );
        })}

        {/* Hour Hand Group */}
        <g transform={`rotate(${hourDegrees} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="60"
            stroke="#F3E8DA"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow-light)"
          />
        </g>
        {/* Minute Hand Group */}
        <g transform={`rotate(${minuteDegrees} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="40"
            stroke="#F3E8DA"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-light)"
          />
        </g>

        {/* Second Hand Group */}
        <g transform={`rotate(${secondDegrees} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke="#F3E8DA"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow-light)"
          />
        </g>
      </svg>
    </main>
  );
};

export default AnalogClock;
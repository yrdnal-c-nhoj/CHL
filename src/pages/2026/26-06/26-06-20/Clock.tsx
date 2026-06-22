import chandelierBg from '@/assets/images/26_images/26-06/26-06-20/chandelier.webp';
import { useClockTime } from '@/utils/hooks';
import React, { useMemo } from 'react';

export const assets = [chandelierBg];

const AnalogClock: React.FC = () => {
  const time = useClockTime();

  // Calculate rotation angles for the clock hands
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
              background-position: center center;
              background-size: 100% 100%;
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
          width: 'min(60vw, 60vh, 400px)',
          height: 'min(60vw, 60vh, 400px)',
          borderRadius: '50%',
          marginTop: '-1vh',
        }}
      >
        {/* Glow Filter Definition */}
        <defs>
          <filter id="glow-light" x="-50%" y="-50%" width="200%" height="200%">
            {/* Blurs the input to create the glow "blob" effect */}
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Clock Face Markings */}
        <line x1="100" y1="10" x2="100" y2="20" stroke="#fff" strokeWidth="4" />
        <line x1="190" y1="100" x2="180" y2="100" stroke="#fff" strokeWidth="4" />
        <line x1="100" y1="190" x2="100" y2="180" stroke="#fff" strokeWidth="4" />
        <line x1="10" y1="100" x2="20" y2="100" stroke="#fff" strokeWidth="4" />

        {/* Hour Hand Group */}
        <g transform={`rotate(${hourDegrees} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="55"
            stroke="#fff"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Light blob at coordinate (100, 55) */}
          <circle cx="100" cy="55" r="7" fill="#fff" filter="url(#glow-light)" />
        </g>

        {/* Minute Hand Group */}
        <g transform={`rotate(${minuteDegrees} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Light blob at coordinate (100, 35) */}
          <circle cx="100" cy="35" r="5" fill="#fff" filter="url(#glow-light)" />
        </g>

        {/* Second Hand Group */}
        <g transform={`rotate(${secondDegrees} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="25"
            stroke="#ff4d4d"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Light blob at coordinate (100, 25) */}
          <circle cx="100" cy="25" r="4" fill="#fff" filter="url(#glow-light)" />
        </g>

      
      </svg>
    </main>
  );
};

export default AnalogClock;
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

        {/* Hour Hand Group */}
        <g transform={`rotate(${hourDegrees} 100 100)`}>
          <circle cx="100" cy="55" r="12" fill="#F3E8DA" filter="url(#glow-light)" />
        </g>
        {/* Minute Hand Group */}
        <g transform={`rotate(${minuteDegrees} 100 100)`}>
       <circle cx="100" cy="35" r="8" fill="#F3E8DA" filter="url(#glow-light)" />
        </g>

        {/* Second Hand Group */}
        <g transform={`rotate(${secondDegrees} 100 100)`}>
      
          {/* Light blob at coordinate (100, 25) */}
          <circle cx="100" cy="25" r="6" fill="#F3E8DA" filter="url(#glow-light)" />
        </g>

      
      </svg>
    </main>
  );
};

export default AnalogClock;
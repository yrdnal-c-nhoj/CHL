import chandelierBg from '@/assets/images/26_images/26-07/26-07-14/root.webp';
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
    backgroundColor: '#000',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    backgroundImage: `url(${chandelierBg})`,
    backgroundRepeat: 'no-repeat',
    filter: 'saturate(400%) contrast(1.3) brightness(1.1)',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  };

  const svgStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    width: 'min(88vw, 88vh, 600px)',
    height: 'min(88vw, 88vh, 600px)',
    borderRadius: '50%',
    marginTop: '-1vh',
  };

  return (
    <main style={containerStyle}>
     {/* Analog Clock SVG */}
      <svg
        viewBox="0 0 200 200"
        style={svgStyle}
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
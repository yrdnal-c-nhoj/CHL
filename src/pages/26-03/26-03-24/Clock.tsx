import React, { useMemo, useEffect } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { calculateAngles } from '../../../utils/clockUtils';
import bgImage from '../../../assets/images/26-03/26-03-24/blakstar.webp?url';
import exoFont from '../../../assets/fonts/26-03-24-exo.ttf?url';

// Internal coordinate system constants
const BASE_SIZE = 500;
const CENTER = BASE_SIZE / 2;
const RADIUS = 160;
const TEXT_RADIUS = 185; // Slightly increased to clear the ticks better

const hourNumbers = ["12", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];

const fontFaceExo = `
  @font-face {
    font-family: 'ExoClock';
    src: url(${exoFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const Clock: React.FC = () => {
  const time = useSecondClock();
  const angles = calculateAngles(time);

  useEffect(() => {
    if (!document.getElementById('exo-clock-font')) {
      const style = document.createElement('style');
      style.id = 'exo-clock-font';
      style.innerHTML = fontFaceExo;
      document.head.appendChild(style);
    }
  }, []);

  const staticElements = useMemo(() => (
    <>
      {/* Hour numbers with custom font */}
      {hourNumbers.map((num, i) => {
        const angle = ((i * 30) - 90) * (Math.PI / 180);
        const x = CENTER + Math.cos(angle) * TEXT_RADIUS;
        const y = CENTER + Math.sin(angle) * TEXT_RADIUS;
        const rotation = i * 30;

        return (
          <text
            key={`num-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black"
            fontSize="80"
            fontFamily="ExoClock, system-ui, sans-serif"
            fontWeight="normal"
            letterSpacing="2"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${x}px ${y}px`,
              filter: 'url(#digitShadow)',
            }}
          >
            {num}
          </text>
        );
      })}

    
    </>
  ), []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        overflow: 'hidden',
        backgroundColor: '#000', // Fallback color
        /* STRETCH & NUDGE LOGIC:
           - 110% 110% stretches the image beyond the viewport to ensure no gaps.
           - center 20% nudges the image "up" (aligning the top 20% of the image to the top 20% of the screen).
        */
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: 'bottom center',
        backgroundSize: '100% 107%', 
        backgroundRepeat: 'no-repeat',
      }}
    >
      <svg 
        style={{ 
          width: '85vmin', 
          height: '85vmin',
          display: 'block',
          filter: 'drop-shadow(0 0 2vmin rgb(251, 250, 250))' 
        }}
        viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}
      >
        <defs>
          <filter id="digitShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="-1" stdDeviation="0" floodColor="white" floodOpacity="1"/>
            <feDropShadow dx="0" dy="1" stdDeviation="0" floodColor="#FAE604" floodOpacity="1"/>
          </filter>
        </defs>
        {staticElements}

        {/* Hour hand - tapered */}
        {(() => {
          const angle = (angles.hour - 90) * Math.PI / 180;
          const x2 = CENTER + Math.cos(angle) * 85;
          const y2 = CENTER + Math.sin(angle) * 85;
          const perpAngle = angle + Math.PI / 2;
          const w = 8;
          const xOff = Math.cos(perpAngle) * w / 2;
          const yOff = Math.sin(perpAngle) * w / 2;
          return (
            <path
              d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
              fill="#FFFDFD"
            />
          );
        })()}

        {/* Minute hand - tapered */}
        {(() => {
          const angle = (angles.minute - 90) * Math.PI / 180;
          const x2 = CENTER + Math.cos(angle) * 125;
          const y2 = CENTER + Math.sin(angle) * 125;
          const perpAngle = angle + Math.PI / 2;
          const w = 5;
          const xOff = Math.cos(perpAngle) * w / 2;
          const yOff = Math.sin(perpAngle) * w / 2;
          return (
            <path
              d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
              fill="#FDFDFD"
            />
          );
        })()}

        {/* Second hand - tapered */}
        {(() => {
          const angle = (angles.second - 90) * Math.PI / 180;
          const x2 = CENTER + Math.cos(angle) * 145;
          const y2 = CENTER + Math.sin(angle) * 145;
          const perpAngle = angle + Math.PI / 2;
          const w = 2;
          const xOff = Math.cos(perpAngle) * w / 2;
          const yOff = Math.sin(perpAngle) * w / 2;
          return (
            <path
              d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
              fill="#FAF7F7"
            />
          );
        })()}
     </svg>
    </div>
  );
};

export default Clock;
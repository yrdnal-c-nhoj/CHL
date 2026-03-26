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
            fill="#FAE604"
            fontSize="80"
            fontFamily="ExoClock, system-ui, sans-serif"
            fontWeight="normal"
            letterSpacing="2"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${x}px ${y}px`,
            }}
          >
            {num}
          </text>
        );
      })}

      {/* Tick Marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const isHour = i % 5 === 0;
        const angle = ((i * 6) - 90) * (Math.PI / 180);
        const innerR = RADIUS - (isHour ? 15 : 5);
        const x1 = CENTER + Math.cos(angle) * innerR;
        const y1 = CENTER + Math.sin(angle) * innerR;
        const x2 = CENTER + Math.cos(angle) * RADIUS;
        const y2 = CENTER + Math.sin(angle) * RADIUS;

        return (
          <line
            key={`tick-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#f999ff"
            strokeWidth={isHour ? 6 : 2}
          />
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
        backgroundPosition: 'center 20%',
        backgroundSize: '115% 115%', 
        backgroundRepeat: 'no-repeat',
      }}
    >
      <svg 
        style={{ 
          width: '85vmin', 
          height: '85vmin',
          display: 'block',
          filter: 'drop-shadow(0 0 2vmin rgba(253, 4, 4, 0.8))' 
        }}
        viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}
      >
        {staticElements}

        {/* Hour hand */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER + Math.cos((angles.hour - 90) * Math.PI / 180) * 85}
          y2={CENTER + Math.sin((angles.hour - 90) * Math.PI / 180) * 85}
          stroke="#7D7D7D"
          strokeWidth={8}
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER + Math.cos((angles.minute - 90) * Math.PI / 180) * 125}
          y2={CENTER + Math.sin((angles.minute - 90) * Math.PI / 180) * 125}
          stroke="#7D7B7B"
          strokeWidth={5}
          strokeLinecap="round"
        />

        {/* Second hand */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER + Math.cos((angles.second - 90) * Math.PI / 180) * 145}
          y2={CENTER + Math.sin((angles.second - 90) * Math.PI / 180) * 145}
          stroke="#7B7979"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Center Cap */}
        <circle cx={CENTER} cy={CENTER} r={6} fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export default Clock;
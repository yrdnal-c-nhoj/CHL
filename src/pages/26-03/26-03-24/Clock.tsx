import React, { useMemo, useEffect } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { calculateAngles } from '../../../utils/clockUtils';
import bgImage from '../../../assets/images/26-03/26-03-24/blakstar.webp?url';
import exoFont from '../../../assets/fonts/26-03-24-exo.ttf?url';

// We keep these for the internal coordinate system math
const BASE_SIZE = 500;
const CENTER = BASE_SIZE / 2;
const RADIUS = 160;
const TEXT_RADIUS = 170;

const hourNumbers = ["12", "01","02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];

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
            fontSize="100"
            fontFamily="ExoClock, system-ui, sans-serif"
            fontWeight="normal"
            letterSpacing="2"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${x}px ${y}px`,
              textShadow: '15px 0px 0 #08F8F4, -15px -0px 0 #FF00CC',
            }}
          >
            {num}
          </text>
        );
      })}

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
        height: '100vh', // Changed from 100dvh for broader compatibility, or keep dvh if preferred
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `url(${bgImage}) center/cover no-repeat`,
        margin: 0,
        overflow: 'hidden',
      }}
    >
      <svg 
        // Using vmin ensures the clock stays circular and fits within 
        // the smallest dimension of the screen (width vs height)
        style={{ 
          width: '80vmin', 
          height: '80vmin',
          display: 'block',
          filter: 'drop-shadow(0 0 1vmin rgb(253, 4, 4))' 
        }}
        viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}
      >
        {staticElements}

        {/* Hour hand */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER + Math.cos((angles.hour - 90) * Math.PI / 180) * 80}
          y2={CENTER + Math.sin((angles.hour - 90) * Math.PI / 180) * 80}
          stroke="#7D7D7D"
          strokeWidth={6}
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER + Math.cos((angles.minute - 90) * Math.PI / 180) * 120}
          y2={CENTER + Math.sin((angles.minute - 90) * Math.PI / 180) * 120}
          stroke="#7D7B7B"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Second hand */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER + Math.cos((angles.second - 90) * Math.PI / 180) * 140}
          y2={CENTER + Math.sin((angles.second - 90) * Math.PI / 180) * 140}
          stroke="#7B7979"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Clock;
import React, { useMemo } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { calculateAngles } from '../../../utils/clockUtils';

// Internal coordinate system constants
const BASE_SIZE = 500;
const CENTER = BASE_SIZE / 2;
const RADIUS = 200;

const hourNumbers = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
const TEXT_RADIUS = 160;

// Styles
const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #1a0a2e 0%, #4a148c 50%, #1a0a2e 100%)',
  position: 'relative',
};

const bgGridStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: 'repeat(4, 1fr)',
  zIndex: 0,
};

// Image URL
const bgImageUrl = new URL('../../../assets/images/26-03/26-03-25/ride.webp', import.meta.url).href;

// Font URL
const fontUrl = new URL('../../../assets/fonts/26--03-25-ride.ttf', import.meta.url).href;

const bgCellStyle = (index: number): React.CSSProperties => ({
  backgroundImage: `url('${bgImageUrl}')`,
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  transform: index % 2 === 1 ? 'scaleX(-1)' : 'none',
});

const clockSvgStyle: React.CSSProperties = {
  width: '80vmin',
  height: '80vmin',
  display: 'block',
  overflow: 'visible',
  filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.6))',
  position: 'relative',
  zIndex: 1,
  animation: 'spin 60s linear infinite',
};

const clockRingStyle: React.CSSProperties = {
  fill: 'none',
  stroke: 'url(#goldGradient)',
  strokeWidth: 12,
  filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
};

const centerDotStyle: React.CSSProperties = {
  fill: '#ff1744',
  filter: 'drop-shadow(0 0 8px rgba(255, 23, 68, 0.9))',
};

const hourNumberStyle: React.CSSProperties = {
  fontFamily: "'RideFont', 'Georgia', serif",
  fontSize: 36,
  fontWeight: 700,
  fill: '#ffd700',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
};

const hourHandStyle: React.CSSProperties = {
  fill: '#ffd700',
  filter: 'drop-shadow(2px 2px 6px rgba(255, 215, 0, 0.6))',
};

const minuteHandStyle: React.CSSProperties = {
  fill: '#ff1744',
  filter: 'drop-shadow(2px 2px 6px rgba(255, 23, 68, 0.6))',
};

const secondHandStyle: React.CSSProperties = {
  fill: '#00e5ff',
  filter: 'drop-shadow(1px 1px 4px rgba(0, 229, 255, 0.8))',
};

const Clock: React.FC = () => {
  const time = useSecondClock();
  const angles = calculateAngles(time);

  const tickMarks = useMemo(() => {
    const ticks: React.ReactElement[] = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const isHour = i % 5 === 0;
      const innerRadius = isHour ? RADIUS - 15 : RADIUS - 8;
      const outerRadius = RADIUS;
      const x1 = CENTER + Math.cos(angle) * innerRadius;
      const y1 = CENTER + Math.sin(angle) * innerRadius;
      const x2 = CENTER + Math.cos(angle) * outerRadius;
      const y2 = CENTER + Math.sin(angle) * outerRadius;

      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isHour ? '#ff1744' : '#00e5ff'}
          strokeWidth={isHour ? 6 : 2}
          strokeLinecap="round"
          style={{
            filter: isHour
              ? 'drop-shadow(0 0 4px rgba(255, 23, 68, 0.8))'
              : 'drop-shadow(0 0 2px rgba(0, 229, 255, 0.6))',
          }}
        />
      );
    }
    return ticks;
  }, []);

  const hourNumbersElements = useMemo(() => {
    return hourNumbers.map((num, i) => {
      const angle = ((i * 30) - 90) * (Math.PI / 180);
      const x = CENTER + Math.cos(angle) * TEXT_RADIUS;
      const y = CENTER + Math.sin(angle) * TEXT_RADIUS;
      return (
        <text
          key={`num-${i}`}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          style={hourNumberStyle}
        >
          {num}
        </text>
      );
    });
  }, []);

  return (
    <div style={containerStyle}>
      <style>{`
        @font-face {
          font-family: 'RideFont';
          src: url('${fontUrl}') format('truetype');
          font-weight: 700;
          font-style: normal;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          .bgGridDesktop {
            grid-template-columns: 1fr 1fr 1fr !important;
            grid-template-rows: 1fr 1fr 1fr !important;
          }
        }
      `}</style>
      {/* Background image grid - 8 on phone, 9 on laptop */}
      <div style={bgGridStyle} className="bgGridDesktop">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={bgCellStyle(i)} />
        ))}
      </div>

      <svg style={clockSvgStyle} viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}>
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#ffec8b" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>
        </defs>
        {/* Clock face ring */}
        <circle cx={CENTER} cy={CENTER} r={RADIUS} style={clockRingStyle} />

        {/* Clock face ticks */}
        {tickMarks}

        {/* Hour numbers */}
        {hourNumbersElements}

        {/* Center dot */}
        <circle cx={CENTER} cy={CENTER} r={6} style={centerDotStyle} />

        {/* Hour hand */}
        {(() => {
          const angle = (angles.hour - 90) * Math.PI / 180;
          const x2 = CENTER + Math.cos(angle) * 120;
          const y2 = CENTER + Math.sin(angle) * 120;
          const perpAngle = angle + Math.PI / 2;
          const w = 10;
          const xOff = (Math.cos(perpAngle) * w) / 2;
          const yOff = (Math.sin(perpAngle) * w) / 2;
          return (
            <path
              d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
              style={hourHandStyle}
            />
          );
        })()}

        {/* Minute hand */}
        {(() => {
          const angle = (angles.minute - 90) * Math.PI / 180;
          const x2 = CENTER + Math.cos(angle) * 170;
          const y2 = CENTER + Math.sin(angle) * 170;
          const perpAngle = angle + Math.PI / 2;
          const w = 6;
          const xOff = (Math.cos(perpAngle) * w) / 2;
          const yOff = (Math.sin(perpAngle) * w) / 2;
          return (
            <path
              d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
              style={minuteHandStyle}
            />
          );
        })()}

        {/* Second hand */}
        {(() => {
          const angle = (angles.second - 90) * Math.PI / 180;
          const x2 = CENTER + Math.cos(angle) * 180;
          const y2 = CENTER + Math.sin(angle) * 180;
          const perpAngle = angle + Math.PI / 2;
          const w = 3;
          const xOff = (Math.cos(perpAngle) * w) / 2;
          const yOff = (Math.sin(perpAngle) * w) / 2;
          return (
            <path
              d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
              style={secondHandStyle}
            />
          );
        })()}
      </svg>
    </div>
  );
};

export default Clock;


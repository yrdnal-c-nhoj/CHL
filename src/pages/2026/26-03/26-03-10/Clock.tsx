import React, { useEffect } from 'react';
import { useSecondClock } from '../../../../utils/useSmoothClock';

const ProgressClock: React.FC = () => {
  const time = useSecondClock();

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Varela+Round&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();

  const strokeWidth = 36;
  const outerRadius = 135;
  const middleRadius = 105;
  const innerRadius = 75;

  const center = 155;

  const getRingData = (val, max, r) => {
    const circumference = 2 * Math.PI * r;
    const progress = val / max;
    const offset = circumference - progress * circumference;

    const angle = progress * 2 * Math.PI;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);

    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: isNaN(offset) ? circumference : offset,
      transition:
        val === 0 ? 'none' : 'stroke-dashoffset 0.5s ease, transform 0.5s ease',
      labelPos: { x, y },
    };
  };

  const sData = getRingData(s, 60, outerRadius);
  const mData = getRingData(m + s / 60, 60, middleRadius);
  const hData = getRingData((h % 12) + m / 60, 12, innerRadius);

  return (
    <div
      style={{
        width: '100%',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#dddfff',
        fontFamily: '"Varela Round", sans-serif',
      }}
    >
      <svg
        style={{
          transform: 'rotate(-90deg)',
          width: '90%',
          height: '90%',
          maxWidth: '650px',
        }}
        viewBox="0 0 310 310"
      >
        <defs>
          <linearGradient id="pc-purple" x1="1" y1="0.5" x2="0" y2="0.5">
            <stop offset="0%" stopColor="#FF0000" />
            <stop offset="100%" stopColor="#EE7C0A" />
          </linearGradient>
          <linearGradient id="pc-blue" x1="1" y1="0.5" x2="0" y2="0.5">
            <stop offset="0%" stopColor="#FFCA0B" />
            <stop offset="100%" stopColor="#9225EB" />
          </linearGradient>
          <linearGradient id="pc-yellow" x1="1" y1="0.5" x2="0" y2="0.5">
            <stop offset="0%" stopColor="#2550FF" />
            <stop offset="100%" stopColor="#06D988" />
          </linearGradient>
        </defs>

        <Ring
          radius={outerRadius}
          stroke="url(#pc-purple)"
          strokeWidth={strokeWidth}
          value={s}
          center={center}
          {...sData}
        />

        <Ring
          radius={middleRadius}
          stroke="url(#pc-blue)"
          strokeWidth={strokeWidth}
          value={m}
          center={center}
          {...mData}
        />

        <Ring
          radius={innerRadius}
          stroke="url(#pc-yellow)"
          strokeWidth={strokeWidth}
          value={h === 0 ? 12 : h > 12 ? h - 12 : h}
          center={center}
          {...hData}
        />
      </svg>
    </div>
  );
};

const Ring = ({
  radius,
  stroke,
  strokeWidth,
  strokeDasharray,
  strokeDashoffset,
  transition,
  labelPos,
  value,
  center,
}) => (
  <g>
    <circle
      cx={center}
      cy={center}
      r={radius}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity="0.1"
    />
    <circle
      cx={center}
      cy={center}
      r={radius}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={strokeDasharray}
      style={{ strokeDashoffset, transition }}
    />
    <g
      style={{ transition: 'transform 0.5s ease', mixBlendMode: 'difference' }}
      transform={`translate(${labelPos.x}, ${labelPos.y})`}
    >
      <text
        transform="rotate(90)"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fill: 'white',
          fontSize: '14px',
          fontFamily: '"Varela Round", sans-serif',
          pointerEvents: 'none',
        }}
      >
        {Math.floor(value)}
      </text>
    </g>
  </g>
);

export default ProgressClock;

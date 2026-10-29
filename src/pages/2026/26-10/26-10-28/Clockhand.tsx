import { useId } from 'react';
import type { CSSProperties } from 'react';

interface ClockHandProps {
  className: string;
  angle: number;
  variant?: 'hand' | 'finger';
}

const ClockHand = ({ className, angle, variant = 'hand' }: ClockHandProps) => {
  const id = useId().replace(/:/g, '');

  const style: CSSProperties = {
    transform: `rotate(${angle}deg)`,
    opacity: variant === 'finger' ? 0.85 : 1,
  };

  return (
    <svg
      className={className}
      viewBox="0 0 100 500"
      preserveAspectRatio="none"
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-skin`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a67d50" />
          <stop offset="35%" stopColor="#d4a373" />
          <stop offset="55%" stopColor="#f0c9a6" />
          <stop offset="100%" stopColor="#a67d50" />
        </linearGradient>

        <linearGradient id={`${id}-arm`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a67d50" />
          <stop offset="45%" stopColor="#f0c9a6" />
          <stop offset="100%" stopColor="#a67d50" />
        </linearGradient>
      </defs>

      {/* Long, narrow arm extending from the clock center */}
      <path
        d="
          M 43 500
          L 43 150
          Q 43 135 50 135
          Q 57 135 57 150
          L 57 500
          Z
        "
        fill={`url(#${id}-arm)`}
        stroke="#8c6235"
        strokeWidth="1.5"
      />

      {/* Small human hand at the end of the arm */}
      <g fill={`url(#${id}-skin)`} stroke="#8c6235" strokeWidth="1.5">
        {/* Palm and wrist */}
        <path
          d="
            M 43 170
            L 43 120
            Q 35 115 29 105
            L 16 80
            Q 12 72 18 68
            Q 24 64 29 73
            L 39 88

            L 34 40
            Q 33 29 40 28
            Q 47 27 48 40
            L 50 78

            L 52 20
            Q 52 9 59 9
            Q 66 9 66 20
            L 65 78

            L 69 35
            Q 70 24 77 26
            Q 84 28 82 39
            L 77 90

            L 85 60
            Q 88 50 94 54
            Q 100 58 97 69
            L 87 112

            Q 83 132 72 145
            L 72 170
            Z
          "
        />
      </g>

      {/* Knuckle definition */}
      <g
        fill="none"
        stroke="#8c6235"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      >
        <path d="M 36 48 Q 42 52 48 48" />
        <path d="M 53 30 Q 59 34 65 30" />
        <path d="M 70 43 Q 76 47 82 43" />
        <path d="M 88 65 Q 93 68 97 65" />
      </g>

      {/* Palm highlight */}
      <path
        d="M 48 110 L 48 155"
        fill="none"
        stroke="#f0c9a6"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
};

export default ClockHand;

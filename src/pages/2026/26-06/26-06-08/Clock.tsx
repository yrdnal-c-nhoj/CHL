import customFont from '@/assets/fonts/26fonts/26-06-08.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

const VIDEO_ID = 'FBYUkqutqzE';

const YOUTUBE_URL = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&rel=0&enablejsapi=1`;

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'JesoloFont',
    fontUrl: customFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

export const assets: string[] = [customFont];

const DIGITS = Array.from({ length: 12 }, (_, i) => i + 1);

const CENTER = { x: 200, y: 200 };
const DIGIT_RADIUS = 160;

const getDigitPositionAndRotation = (
  hour: number,
  radius: number,
  centerX: number,
  centerY: number,
) => {
  const angle = (hour - 3) * (Math.PI / 6);

  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  return {
    x,
    y,
    rotation: (hour - 3) * 30 + 90,
  };
};

const Clock: React.FC = () => {
  const time = useSmoothClock();

  useSuspenseFontLoader(FONT_CONFIGS);

  const { hourAngle, minuteAngle } = useMemo(() => {
    const timestamp =
      time.getTime() - time.getTimezoneOffset() * 60000;

    return {
      secondAngle: (timestamp / 1000) * 6,
      minuteAngle: (timestamp / 60000) * 6,
      hourAngle: (timestamp / 3600000) * 30,
    };
  }, [time]);

  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        backgroundColor: '#000',
      }}
    >
      {/* YouTube background anchored to the RIGHT.
          Excess width is cropped from the LEFT side only. */}
      <iframe
        src={YOUTUBE_URL}
        title="Background Stream"
        allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture"
        referrerPolicy="no-referrer-when-downgrade"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '177.77777778vh',
          height: '100vh',
          minWidth: '100vw',
          minHeight: '56.25vw',
          border: 'none',
          zIndex: 0,
          pointerEvents: 'none',
          display: 'block',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'transparent',
        }}
      />

      <svg
        viewBox="0 0 400 400"
        style={{
          position: 'absolute',
          zIndex: 2,
          width: 'min(90vmin, 400px)',
          height: 'min(90vmin, 400px)',
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <defs>
          <linearGradient
            id="bambooGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              style={{
                stopColor: '#99aa3d',
                stopOpacity: 1,
              }}
            />
            <stop
              offset="50%"
              style={{
                stopColor: '#c5e1a5',
                stopOpacity: 1,
              }}
            />
            <stop
              offset="100%"
              style={{
                stopColor: '#99aa3d',
                stopOpacity: 1,
              }}
            />
          </linearGradient>

          <filter
            id="tikiShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur
              in="SourceAlpha"
              stdDeviation="3"
            />
            <feOffset
              dx="3"
              dy="3"
              result="offsetblur"
            />
            <feComponentTransfer>
              <feFuncA
                type="linear"
                slope="0.6"
              />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {DIGITS.map((digit) => {
          const { x, y, rotation } =
            getDigitPositionAndRotation(
              digit,
              DIGIT_RADIUS,
              CENTER.x,
              CENTER.y,
            );

          return (
            <text
              key={digit}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ABC68C"
              fontSize="50"
              fontFamily="JesoloFont, sans-serif"
              transform={`rotate(${rotation} ${x} ${y})`}
              style={{
                filter: 'url(#tikiShadow)',
              }}
            >
              {digit}
            </text>
          );
        })}

        <g
          transform={`rotate(${hourAngle} 200 200)`}
          style={{
            filter: 'url(#tikiShadow)',
          }}
        >
          <rect
            x="197"
            y="135"
            width="6"
            height="80"
            rx="3"
            fill="url(#bambooGrad)"
          />

          <line
            x1="197"
            y1="155"
            x2="203"
            y2="155"
            stroke="#5d4037"
            strokeWidth="1.5"
          />
          <line
            x1="197"
            y1="180"
            x2="203"
            y2="180"
            stroke="#5d4037"
            strokeWidth="1.5"
          />
          <line
            x1="197"
            y1="205"
            x2="203"
            y2="205"
            stroke="#5d4037"
            strokeWidth="1.5"
          />
        </g>

        <g
          transform={`rotate(${minuteAngle} 200 200)`}
          style={{
            filter: 'url(#tikiShadow)',
          }}
        >
          <rect
            x="198"
            y="90"
            width="4"
            height="120"
            rx="2"
            fill="url(#bambooGrad)"
          />

          <line
            x1="198"
            y1="120"
            x2="202"
            y2="120"
            stroke="#5d4037"
            strokeWidth="1"
          />
          <line
            x1="198"
            y1="150"
            x2="202"
            y2="150"
            stroke="#5d4037"
            strokeWidth="1"
          />
          <line
            x1="198"
            y1="180"
            x2="202"
            y2="180"
            stroke="#5d4037"
            strokeWidth="1"
          />
        </g>

        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r="2"
          fill="#3e2723"
        />

        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r="1"
          fill="#DEB887"
        />
      </svg>
    </main>
  );
};

export default Clock;
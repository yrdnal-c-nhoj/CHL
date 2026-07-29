import cyanImage from '@/assets/images/26_images/26-07/26-07-27/cyan.webp';
import hourHandImage from '@/assets/images/26_images/26-07/26-07-27/hour.webp';
import minuteHandImage from '@/assets/images/26_images/26-07/26-07-27/minute.webp';
import secondHandImage from '@/assets/images/26_images/26-07/26-07-27/second.webp';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useMemo } from 'react';

export const assets = [cyanImage, hourHandImage, minuteHandImage, secondHandImage];

// --- Constants ---
const CANVAS = { width: 500, height: 620, cx: 250, cy: 310 } as const;

const PALETTE = {
  paperLight: '#254E7D91',
  paperMid: '#16365CB5',
  paperDeep: '#08162910',
  dropShadow: '#060503',
  washEnd: '#040b14',
  outerBorder: '#03080FA0',
} as const;

const DECKLE_PATH =
  'M 35,22 C 110,12 210,28 310,15 C 390,5 440,18 465,35 C 490,65 475,150 482,240 C 490,340 472,420 478,510 C 482,565 455,595 390,602 C 310,610 205,592 115,605 C 55,612 22,585 15,530 C 5,450 18,350 10,250 C 4,160 12,85 35,22 Z';

const HANDS = [
  {
    key: 'hour',
    image: hourHandImage,
    width: 60,
    height: 140,
    degrees: (h: number, m: number) => (h % 12) * 30 + m * 0.5,
  },
  {
    key: 'minute',
    image: minuteHandImage,
    width: 60,
    height: 200,
    degrees: (_: number, m: number, s: number) => m * 6 + s * 0.1,
  },
  {
    key: 'second',
    image: secondHandImage,
    width: 80,
    height: 280,
    degrees: (_: number, __: number, s: number) => s * 6,
  },
] as const;

// --- Static styles ---
const containerStyle: CSSProperties = {
  width: '100%',
  height: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(${cyanImage})`,
  backgroundPosition: 'center',
  overflow: 'hidden',
};

const svgStyle: CSSProperties = {
  maxHeight: '95dvh',
  maxWidth: '95vw',
  width: 'auto',
  height: 'auto',
};

// --- Component ---
const CyanotypeClock: React.FC = React.memo(() => {
  const now = useSecondClock();

  const { angles, formattedTime, isoTime } = useMemo(() => {
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    return {
      angles: HANDS.map((hand) => hand.degrees(h, m, s)),
      formattedTime: now.toLocaleTimeString(),
      isoTime: now.toISOString(),
    };
  }, [now]);

  return (
    <main style={containerStyle}>
      <svg
        viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
        style={svgStyle}
        role="img"
        aria-label="Cyanotype Clock"
      >
        <title>Cyanotype Clock - {formattedTime}</title>

        <defs>
          <clipPath id="deckleClip">
            <path d={DECKLE_PATH} />
          </clipPath>

          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves={4}
              seed={42}
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.04 0 0 0 0 0.12 0 0 0 0 0.24 0 0 0 0.45 0"
            />
          </filter>

          <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="5"
              dy="12"
              stdDeviation="10"
              floodColor={PALETTE.dropShadow}
              floodOpacity="0.75"
            />
          </filter>

          <radialGradient id="wash" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor={PALETTE.paperLight} />
            <stop offset="55%" stopColor={PALETTE.paperMid} />
            <stop offset="88%" stopColor={PALETTE.paperDeep} />
            <stop offset="100%" stopColor={PALETTE.washEnd} />
          </radialGradient>
        </defs>

        {/* Shadow backing */}
        <path d={DECKLE_PATH} fill="none" filter="url(#dropshadow)" />

        {/* Paper + hands */}
        <g clipPath="url(#deckleClip)">
          <rect width={CANVAS.width} height={CANVAS.height} fill="url(#wash)" />
          <rect
            width={CANVAS.width}
            height={CANVAS.height}
            filter="url(#grain)"
            opacity={0.6}
          />

          {/* Soft deckle edge */}
          <path
            d={DECKLE_PATH}
            fill="none"
            stroke={PALETTE.paperDeep}
            strokeWidth={40}
            opacity={0.85}
            filter="blur(6px)"
          />
          <path
            d={DECKLE_PATH}
            fill="none"
            stroke={PALETTE.outerBorder}
            strokeWidth={15}
            opacity={0.5}
            filter="blur(2px)"
          />

          {HANDS.map((hand, i) => (
            <image
              key={hand.key}
              href={hand.image}
              x={CANVAS.cx - hand.width / 2}
              y={CANVAS.cy - hand.height}
              width={hand.width}
              height={hand.height}
              style={{
                transform: `rotate(${angles[i]}deg)`,
                transformOrigin: `${CANVAS.cx}px ${CANVAS.cy}px`,
                transition: hand.key === 'second' ? 'none' : 'transform 0.2s ease-out',
              }}
            />
          ))}
        </g>
      </svg>

      <time dateTime={isoTime} className="sr-only" aria-hidden="true" />
    </main>
  );
});

CyanotypeClock.displayName = 'CyanotypeClock_26_07_27';
export default CyanotypeClock;
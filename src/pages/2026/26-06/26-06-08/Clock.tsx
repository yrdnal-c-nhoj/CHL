import customFont from '@/assets/fonts/26fonts/26-06-08.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

const VIDEO_ID = 'FBYUkqutqzE';
const YOUTUBE_URL = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&rel=0&enablejsapi=1`;

const FONT_CONFIGS: FontConfig[] = [
  { fontFamily: 'JesoloFont', fontUrl: customFont, options: { weight: 'normal', style: 'normal' } },
];

export const assets: string[] = [customFont];

const CENTER = 200;
const DIGIT_RADIUS = 160;
const DIGITS = Array.from({ length: 12 }, (_, i) => i + 1);

const getDigitTransform = (hour: number) => {
  const angle = (hour - 3) * (Math.PI / 6);
  const x = CENTER + DIGIT_RADIUS * Math.cos(angle);
  const y = CENTER + DIGIT_RADIUS * Math.sin(angle);
  const rotation = (hour - 3) * 30 + 90;
  return { x, y, rotation };
};

const Clock: React.FC = () => {
  useSuspenseFontLoader(FONT_CONFIGS);
  const time = useSmoothClock();

  const { hourAngle, minuteAngle } = useMemo(() => {
    const ms = time.getTime() - time.getTimezoneOffset() * 60000;
    return {
      hourAngle: (ms / 3600000) * 30,
      minuteAngle: (ms / 60000) * 6,
    };
  }, [time]);

  return (
    <main style={{ position: 'fixed', inset: 0, overflow: 'hidden', backgroundColor: '#000' }}>
      <iframe
        src={YOUTUBE_URL}
        title="Background Stream"
        allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture"
        referrerPolicy="no-referrer-when-downgrade"
        style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '177.77777778vh', height: '100vh',
          minWidth: '100vw', minHeight: '56.25vw',
          border: 'none', zIndex: 0, pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 400 400"
        style={{
          position: 'absolute', zIndex: 2,
          width: 'min(90vmin, 400px)', height: 'min(90vmin, 400px)',
          borderRadius: '50%',
          top: '50%', left: '50%',
          opacity: 0.7,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <defs>
          <linearGradient id="bambooGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#99aa3d" />
            <stop offset="50%"  stopColor="#c5e1a5" />
            <stop offset="100%" stopColor="#99aa3d" />
          </linearGradient>

          {/* Dual 1px text shadow: white bottom-left, black top-right */}
          <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="3" dy="-3" stdDeviation="0" floodColor="#F2F87A" floodOpacity="0.9" />
            <feDropShadow dx="3"  dy="3"  stdDeviation="0" floodColor="#000000" floodOpacity="0.9" />
          </filter>

          {/* Hand shadow */}
          <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Clock digits */}
        {DIGITS.map((digit) => {
          const { x, y, rotation } = getDigitTransform(digit);
          return (
            <text
              key={digit}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ABC68C"
              fontSize="70"
              fontFamily="JesoloFont, sans-serif"
              transform={`rotate(${rotation} ${x} ${y})`}
              style={{ filter: 'url(#textShadow)', letterSpacing: '-0.05em' }}
            >
              {digit}
            </text>
          );
        })}

        {/* Hour hand */}
        <g transform={`rotate(${hourAngle} ${CENTER} ${CENTER})`} style={{ filter: 'url(#handShadow)' }}>
          <rect x="197" y="135" width="6" height="80" rx="3" fill="url(#bambooGrad)" />
          <line x1="197" y1="155" x2="203" y2="155" stroke="#5d4037" strokeWidth="1.5" />
          <line x1="197" y1="180" x2="203" y2="180" stroke="#5d4037" strokeWidth="1.5" />
          <line x1="197" y1="205" x2="203" y2="205" stroke="#5d4037" strokeWidth="1.5" />
        </g>

        {/* Minute hand */}
        <g transform={`rotate(${minuteAngle} ${CENTER} ${CENTER})`} style={{ filter: 'url(#handShadow)' }}>
          <rect x="198" y="90" width="4" height="120" rx="2" fill="url(#bambooGrad)" />
          <line x1="198" y1="120" x2="202" y2="120" stroke="#5d4037" strokeWidth="1" />
          <line x1="198" y1="150" x2="202" y2="150" stroke="#5d4037" strokeWidth="1" />
          <line x1="198" y1="180" x2="202" y2="180" stroke="#5d4037" strokeWidth="1" />
        </g>

        {/* Center pin */}
        <circle cx={CENTER} cy={CENTER} r="2" fill="#3e2723" />
        <circle cx={CENTER} cy={CENTER} r="1" fill="#DEB887" />
      </svg>
    </main>
  );
};

export default Clock;

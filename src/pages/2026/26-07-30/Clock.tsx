import React, { memo } from 'react';

import shapesFont from '@/assets/fonts/26fonts/26-07-30.ttf?url';
import clockVideo from '@/assets/images/26_images/26-07/26-07-30/tree.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';

export const assets = [clockVideo, shapesFont];

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'ShapesFont',
    fontUrl: shapesFont,
    options: { weight: 'normal', style: 'normal' },
  },
];

// Structural viewport container styles
const FULL_SCREEN_STYLE: React.CSSProperties = {
  position: 'relative',
  width: '100vw',
  height: '100dvh',
  overflow: 'hidden',
  backgroundColor: '#000',
};

const VIDEO_CONTAINER_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
};

const VIDEO_ELEMENT_STYLE: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'brightness(0.7) contrast(1.1)',
};

// Clock display container with clamp-bounded typography
const CLOCK_TIME_STYLE: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  height: '100%',
  fontFamily: 'ShapesFont, sans-serif',
  // Scales fluidly with 24% of smaller viewport dimension, capped between 3rem (48px) and 14rem (224px)
  fontSize: 'clamp(3rem, 18vmin, 13rem)',
};

// Frozen individual digit layout positions using viewport units (vw/vh)
const DIGIT_STYLES: React.CSSProperties[] = [
  { transform: 'translate(-28vw, -36vh) rotate(-10deg)' }, // Hour 1
  { transform: 'translate(-13vw, -18vh) rotate(5deg)' },     // Hour 2
  { transform: 'translate(11vw, -15vh) rotate(10deg)' },    // Minute 1
  { transform: 'translate(29vw, -25vh) rotate(15deg)' },    // Minute 2
  { transform: 'translate(-5vw, 18vh) rotate(-5deg)' },     // Second 1
  { transform: 'translate(20vw, 25vh) rotate(-15deg)' },    // Second 2
].map((base) => ({
  ...base,
  gridArea: '1 / 1',
  willChange: 'transform',
  color: '#ffffff',
  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))',
}));

const ClockComponent: React.FC = () => {
  useSuspenseFontLoader(FONT_CONFIGS);
  const time = useSecondClock();

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();

  // Extract digits zero-allocation via floor division and modulo
  const d0 = Math.floor(h / 10);
  const d1 = h % 10;
  const d2 = Math.floor(m / 10);
  const d3 = m % 10;
  const d4 = Math.floor(s / 10);
  const d5 = s % 10;

  return (
    <div style={FULL_SCREEN_STYLE}>
      {/* Background Video Layer */}
      <div style={VIDEO_CONTAINER_STYLE}>
        <video
          src={clockVideo}
          style={VIDEO_ELEMENT_STYLE}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Positioned Digits Layer */}
      <time aria-label="Digital clock" style={CLOCK_TIME_STYLE}>
        <div style={DIGIT_STYLES[0]}>{d0}</div>
        <div style={DIGIT_STYLES[1]}>{d1}</div>
        <div style={DIGIT_STYLES[2]}>{d2}</div>
        <div style={DIGIT_STYLES[3]}>{d3}</div>
        <div style={DIGIT_STYLES[4]}>{d4}</div>
        <div style={DIGIT_STYLES[5]}>{d5}</div>
      </time>
    </div>
  );
};

const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_2026_07_30';

export default MemoizedClock;
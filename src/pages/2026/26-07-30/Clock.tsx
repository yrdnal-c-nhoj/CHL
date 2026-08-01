import React, { memo } from 'react';

import shapesFont from '@/assets/fonts/26fonts/26-07-30.ttf?url';
import camo0 from '@/assets/images/26_images/26-07/26-07-30/camo1.webp';
import camo9 from '@/assets/images/26_images/26-07/26-07-30/camo10.webp';
import camo1 from '@/assets/images/26_images/26-07/26-07-30/camo2.webp';
import camo2 from '@/assets/images/26_images/26-07/26-07-30/camo3.webp';
import camo3 from '@/assets/images/26_images/26-07/26-07-30/camo4.webp';
import camo4 from '@/assets/images/26_images/26-07/26-07-30/camo5.webp';
import camo5 from '@/assets/images/26_images/26-07/26-07-30/camo6.webp';
import camo6 from '@/assets/images/26_images/26-07/26-07-30/camo7.webp';
import camo7 from '@/assets/images/26_images/26-07/26-07-30/camo8.webp';
import camo8 from '@/assets/images/26_images/26-07/26-07-30/camo9.webp';
import clockVideo from '@/assets/images/26_images/26-07/26-07-30/tree.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';

export const assets = [
  clockVideo,
  shapesFont,
  camo0, camo1, camo2, camo3, camo4,
  camo5, camo6, camo7, camo8, camo9,
];

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'ShapesFont',
    fontUrl: shapesFont,
    options: { weight: 'normal', style: 'normal' },
  },
];

// Map each digit (0-9) to a specific camo texture.
const TEXTURE_MAP: readonly string[] = [
  camo0, // Digit 0
  camo1, // Digit 1
  camo2, // Digit 2
  camo3, // Digit 3
  camo4, // Digit 4
  camo5, // Digit 5
  camo6, // Digit 6
  camo7, // Digit 7
  camo8, // Digit 8
  camo9, // Digit 9
] as const;

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
  willChange: 'transform, background-image',
  // Clip the background to the text shape
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent', // Make text color transparent to show background
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

  // Create an array of digits for easier mapping in the JSX
  const digits = [d0, d1, d2, d3, d4, d5];

  // Create a style object for each digit with its unique texture
  const getDigitStyle = (digitIndex: number): React.CSSProperties => {
    const digitValue = digits[digitIndex] ?? 0;
    const textureUrl = TEXTURE_MAP[digitValue] ?? TEXTURE_MAP[0];
    return { ...DIGIT_STYLES[digitIndex], backgroundImage: `url(${textureUrl})` };
  };

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
        {digits.map((digit, index) => (
          <div key={index} style={getDigitStyle(index)}>{digit}</div>
        ))}
      </time>
    </div>
  );
};

const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_2026_07_30';

export default MemoizedClock;
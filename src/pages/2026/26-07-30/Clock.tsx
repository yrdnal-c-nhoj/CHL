import React, { memo, useMemo } from 'react';

import shapesFont from '@/assets/fonts/26fonts/26-07-30.ttf?url';
import camo1 from '@/assets/images/26_images/26-07/26-07-30/camo1.webp';
import camo10 from '@/assets/images/26_images/26-07/26-07-30/camo10.webp';
import camo11 from '@/assets/images/26_images/26-07/26-07-30/camo11.webp';
import camo12 from '@/assets/images/26_images/26-07/26-07-30/camo12.webp';
import camo2 from '@/assets/images/26_images/26-07/26-07-30/camo2.webp';
import camo3 from '@/assets/images/26_images/26-07/26-07-30/camo3.webp';
import camo4 from '@/assets/images/26_images/26-07/26-07-30/camo4.webp';
import camo5 from '@/assets/images/26_images/26-07/26-07-30/camo5.webp';
import camo6 from '@/assets/images/26_images/26-07/26-07-30/camo6.webp';
import camo7 from '@/assets/images/26_images/26-07/26-07-30/camo7.webp';
import camo8 from '@/assets/images/26_images/26-07/26-07-30/camo8.webp';
import camo9 from '@/assets/images/26_images/26-07/26-07-30/camo9.webp';
import clockVideo from '@/assets/images/26_images/26-07/26-07-30/tree.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';

export const assets = [
  clockVideo,
  shapesFont,
  camo1, camo2, camo3, camo4, camo5, camo6,
  camo7, camo8, camo9, camo10, camo11, camo12,
];

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'ShapesFont',
    fontUrl: shapesFont,
    options: { weight: 'normal', style: 'normal' },
  },
];

const CAMO_TEXTURES = [
  camo1, camo2, camo3, camo4, camo5, camo6,
  camo7, camo8, camo9, camo10, camo11, camo12,
] as const;

const DIGIT_POSITIONS = [
  { x: 12, y: 15, rotation: 0 },  // Hour 1
  { x: 25, y: 24, rotation: 0 },  // Hour 2
  { x: 45, y: 35, rotation: 0 },  // Minute 1
  { x: 60, y: 42, rotation: 0 },  // Minute 2
  { x: 32, y: 65, rotation: 0 },  // Second 1
  { x: 50, y: 72, rotation: 0 },  // Second 2
] as const;

const PAD2 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function getDeterministicTextureIndex(digitChar: string, positionIndex: number): number {
  const charCode = digitChar.charCodeAt(0) || 0;
  return (charCode * 7 + positionIndex * 13) % CAMO_TEXTURES.length;
}

const DigitItem = memo(({ char, index }: { char: string; index: number }) => {
  const pos = DIGIT_POSITIONS[index] ?? { x: 0, y: 0 };
  const textureIdx = getDeterministicTextureIndex(char, index);
  const camoTex = CAMO_TEXTURES[textureIdx] ?? CAMO_TEXTURES[0];
  const rotTransform = pos.rotation ? ` rotate(${pos.rotation}deg)` : '';

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'inline-block',
        width: '1em',
        textAlign: 'center',
        transform: `translate3d(${pos.x}vw, ${pos.y}vh, 0)${rotTransform}`,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        backgroundImage: `url(${camoTex})`,
      }}
    >
      {char}
    </div>
  );
});

DigitItem.displayName = 'DigitItem';

const ClockDisplay: React.FC = () => {
  const time = useSecondClock();

  const timeString = useMemo(() => {
    const h = PAD2[time.getHours()] ?? '00';
    const m = PAD2[time.getMinutes()] ?? '00';
    const s = PAD2[time.getSeconds()] ?? '00';
    return `${h}${m}${s}`;
  }, [time]);

  return (
    <time
      dateTime={time.toISOString()}
      aria-label="A digital clock displaying individually positioned digits."
      style={{
        display: 'block', // Ensures positioning context works properly for child divs
        position: 'relative',
        width: '100%',
        height: '100%',
        zIndex: 2,
        fontFamily: 'ShapesFont, sans-serif',
        fontSize: '20vmin',
        lineHeight: 1,
      }}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <DigitItem 
          key={index} 
          index={index} 
          char={timeString[index] ?? '0'} 
        />
      ))}
    </time>
  );
};

const ClockComponent: React.FC = () => {
  useSuspenseFontLoader(FONT_CONFIGS);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      >
        <video
          src={clockVideo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.7) contrast(1.1)',
          }}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <ClockDisplay />
    </div>
  );
};

const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_2026_07_30';

export default MemoizedClock;
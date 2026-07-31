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
  camo1,
  camo2,
  camo3,
  camo4,
  camo5,
  camo6,
  camo7,
  camo8,
  camo9,
  camo10,
  camo11,
  camo12,
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

const DIGIT_TO_SHAPE_MAP: Record<string, string> = {
  '0': 'A', '1': 'j', '2': 'v', '3': 'm', '4': '1',
  '5': 'p', '6': '8', '7': 't', '8': 'O', '9': 'k',
};

const DIGIT_POSITIONS: { x: number; y: number; rotation?: number }[] = [
  { x: 22, y: 25, rotation: 0 },  // Hour 1
  { x: 37, y: 34, rotation: 0 },  // Hour 2
  { x: 62, y: 40, rotation: 0 },  // Minute 1
  { x: 86, y: 32, rotation: 0 },  // Minute 2
  { x: 42, y: 67, rotation: 0 },  // Second 1
  { x: 66, y: 82, rotation: 0 },  // Second 2
] as const;

const PAD2 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

/**
 * Generates an array of unique texture indices (0 to CAMO_TEXTURES.length - 1)
 * shuffled deterministically based on the current timestamp in seconds.
 */
function getUniqueTextureIndicesForSecond(timestampMs: number): number[] {
  // Use Unix timestamp divided by 1000 to seed per-second state
  let seed = Math.floor(timestampMs / 1000);
  
  // Simple Pseudo-Random Number Generator (PRNG) to shuffle deterministically
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const indices = Array.from({ length: CAMO_TEXTURES.length }, (_, i) => i);
  
  // Fisher-Yates Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom() * (i + 1));
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }

  return indices;
}

const ClockComponent: React.FC = () => {
  useSuspenseFontLoader(FONT_CONFIGS);

  const time = useSecondClock();

  const timeString = useMemo(() => {
    const h = PAD2[time.getHours()] ?? '00';
    const m = PAD2[time.getMinutes()] ?? '00';
    const s = PAD2[time.getSeconds()] ?? '00';
    return `${h}${m}${s}`;
  }, [time]);

  // Compute 6 unique, randomly assigned camo textures every second
  const positionedDigits = useMemo(() => {
    const shuffledIndices = getUniqueTextureIndicesForSecond(time.getTime());

    return Array.from({ length: 6 }, (_, index) => {
      const digitChar = timeString[index] ?? '0';
      const pos = DIGIT_POSITIONS[index] ?? { x: 0, y: 0 };

      // Guaranteed unique texture selection for position 'index'
      const textureIdx = shuffledIndices[index] ?? 0;
      const camoTex = CAMO_TEXTURES[textureIdx] ?? CAMO_TEXTURES[0];

      const rotTransform = pos.rotation ? ` rotate(${pos.rotation}deg)` : '';

      return {
        key: index,
        char: DIGIT_TO_SHAPE_MAP[digitChar] ?? digitChar,
        style: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${pos.x}vw), calc(-50% + ${pos.y}vh))${rotTransform}`,
          willChange: 'transform',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          backgroundImage: `url(${camoTex})`,
          filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.8))',
        } as React.CSSProperties,
      };
    });
  }, [time, timeString]);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      backgroundColor: '#000',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
      }}>
        <video
          src={clockVideo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            filter: 'brightness(0.7) contrast(1.1)',
          }}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <time
        dateTime={time.toISOString()}
        aria-label="A digital clock displaying individually positioned digits."
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 2,
          fontFamily: 'ShapesFont, sans-serif',
          fontSize: '24vmin',
          lineHeight: 1,
        }}
      >
        {positionedDigits.map(({ key, char, style }) => (
          <div key={key} style={style}>
            {char}
          </div>
        ))}
      </time>
    </div>
  );
};

const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_2026_07_30';

export default MemoizedClock;
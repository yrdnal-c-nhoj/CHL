import React, { memo, useMemo } from 'react';

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

// Pre-compute static styles outside render to eliminate object creation on tick
const DIGIT_STYLES = [
  { x: -15, y: -15, rotation: -10 }, // Hour 1
  { x: 0, y: -18, rotation: 5 },     // Hour 2
  { x: 15, y: -15, rotation: 10 },    // Minute 1
  { x: -10, y: 15, rotation: 15 },    // Minute 2
  { x: 5, y: 18, rotation: -5 },     // Second 1
  { x: 20, y: 15, rotation: -15 },    // Second 2
].map((pos) => {
  const rotTransform = pos.rotation ? ` rotate(${pos.rotation}deg)` : '';
  return {
    gridArea: '1 / 1',
    willChange: 'transform',
    color: '#648355',
    filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.8))',
    transform: `translate(${pos.x}vw, ${pos.y}vh)${rotTransform}`,
  } as React.CSSProperties;
});

const PAD2 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const ClockComponent: React.FC = () => {
  useSuspenseFontLoader(FONT_CONFIGS);

  const time = useSecondClock();

  const timeString = useMemo(() => {
    const h = PAD2[time.getHours()] ?? '00';
    const m = PAD2[time.getMinutes()] ?? '00';
    const s = PAD2[time.getSeconds()] ?? '00';
    return `${h}${m}${s}`;
  }, [time]);

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
      {/* Background Video */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
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

      {/* Clock Display */}
      <time
        dateTime={time.toISOString()}
        aria-label="A digital clock displaying individually positioned digits."
        style={{
          position: 'relative', // Ensures zIndex takes effect over the background
          zIndex: 2,
          display: 'grid',
          placeItems: 'center',
          width: '100%',
          height: '100%',
          fontFamily: 'ShapesFont, sans-serif',
          fontSize: '24vmin',
          lineHeight: 1,
          fontWeight: 'bold',
        }}
      >
        {DIGIT_STYLES.map((style, index) => (
          <div key={index} style={style}>
            {timeString[index] ?? '0'}
          </div>
        ))}
      </time>
    </div>
  );
};

const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_2026_07_30';

export default MemoizedClock;
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
import styles from './Clock.module.css';

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

// Pre-formatted texture URLs array to prevent string concatenation during render
const TEXTURE_URLS: readonly string[] = [
  `url(${camo0})`,
  `url(${camo1})`,
  `url(${camo2})`,
  `url(${camo3})`,
  `url(${camo4})`,
  `url(${camo5})`,
  `url(${camo6})`,
  `url(${camo7})`,
  `url(${camo8})`,
  `url(${camo9})`,
] as const;

// Mapping digit (0-9) to font glyph character
const DIGIT_TO_LETTER_MAP: readonly string[] = [
  '1', 'J', 'v', 'M', '3', 'T', 'k', 'P', '7', 'L',
] as const;

// Static Styles
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

const CLOCK_TIME_STYLE: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  height: '100%',
  fontFamily: 'ShapesFont, sans-serif',
  fontSize: 'clamp(3rem, 18vmin, 13rem)',
};

// Positioning transforms live on a wrapper so the text element
// itself has no transform (avoids Firefox background-clip:text bug)
const BASE_DIGIT_WRAPPER_STYLES: React.CSSProperties[] = [
  { transform: 'translate(-28vw, -36vh) rotate(-10deg)' },
  { transform: 'translate(-13vw, -18vh) rotate(5deg)' },
  { transform: 'translate(11vw, -15vh) rotate(10deg)' },
  { transform: 'translate(29vw, -25vh) rotate(15deg)' },
  { transform: 'translate(-5vw, 18vh) rotate(-5deg)' },
  { transform: 'translate(20vw, 25vh) rotate(-15deg)' },
].map((base) => ({
  gridArea: '1 / 1',
  willChange: 'transform',
  ...base,
}));

// Styles that belong only on the text node (clip + texture)
const DIGIT_TEXT_STYLES: React.CSSProperties = {
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))',
};

const SLOT_KEYS = ['h1', 'h2', 'm1', 'm2', 's1', 's2'] as const;

const ClockComponent: React.FC = () => {
  useSuspenseFontLoader(FONT_CONFIGS);
  const time = useSecondClock();

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();

  const digits = [
    Math.floor(h / 10),
    h % 10,
    Math.floor(m / 10),
    m % 10,
    Math.floor(s / 10),
    s % 10,
  ];

  // Accessible standard ISO/time display for assistive tech
  const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div style={FULL_SCREEN_STYLE}>
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

      <div className={styles.timeContainer}>
        {/* Accessible time for screen readers, using srOnly class */}
        <time dateTime={time.toISOString()} className={styles.srOnly}>
          {timeString}
        </time>

        {digits.map((digit, index) => {
          const bgUrl = TEXTURE_URLS[digit] ?? TEXTURE_URLS[0];
          const glyph = DIGIT_TO_LETTER_MAP[digit] ?? 'A';

          return (
            <div key={SLOT_KEYS[index]} className={`${styles.digitWrapper} ${styles[`pos${index}`]}`}>
              <div
                className={styles.digit}
                style={{
                  backgroundImage: bgUrl,
                }}
                aria-hidden="true"
              >
                {glyph}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_2026_07_30';

export default MemoizedClock;
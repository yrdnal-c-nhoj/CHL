import { useMillisecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports
import digit1 from '@/assets/images/26_images/26-07/26-07-28/1.webp';
import digit10 from '@/assets/images/26_images/26-07/26-07-28/10.webp';
import digit11 from '@/assets/images/26_images/26-07/26-07-28/11.webp';
import digit12 from '@/assets/images/26_images/26-07/26-07-28/12.webp';
import digit2 from '@/assets/images/26_images/26-07/26-07-28/2.webp';
import digit3 from '@/assets/images/26_images/26-07/26-07-28/3.webp';
import digit4 from '@/assets/images/26_images/26-07/26-07-28/4.webp';
import digit5 from '@/assets/images/26_images/26-07/26-07-28/5.webp';
import digit6 from '@/assets/images/26_images/26-07/26-07-28/6.webp';
import digit7 from '@/assets/images/26_images/26-07/26-07-28/7.webp';
import digit8 from '@/assets/images/26_images/26-07/26-07-28/8.webp';
import digit9 from '@/assets/images/26_images/26-07/26-07-28/9.webp';
import backgroundImage from '@/assets/images/26_images/26-07/26-07-28/background.webp';
import hourHandImage from '@/assets/images/26_images/26-07/26-07-28/hour.webp';
import minuteHandImage from '@/assets/images/26_images/26-07/26-07-28/minute.webp';
import secondHandImage from '@/assets/images/26_images/26-07/26-07-28/second.webp';

const DIGIT_IMAGES = [
  digit1,
  digit2,
  digit3,
  digit4,
  digit5,
  digit6,
  digit7,
  digit8,
  digit9,
  digit10,
  digit11,
  digit12,
];

export const assets = [
  backgroundImage,
  ...DIGIT_IMAGES,
  hourHandImage,
  minuteHandImage,
  secondHandImage,
];

// --- Configuration Constants ---

// Background Image Filter Settings (Adjust values as needed)
const BACKGROUND_SETTINGS = {
  contrast: '120%', // Example: Slightly higher contrast for the background
  brightness: '80%', // Example: Slightly darker background
};

// Base Digit Size (in vmin)
const BASE_DIGIT_SIZE_VMIN = 16;

interface DigitCustomization {
  imgSrc: string;
  rotationDeg: number;
  sizeVmin?: number;     // Override base size individually
  brightness?: string;  // e.g., '120%'
  contrast?: string;    // e.g., '150%'
}

// Per-digit customization array
// Tweak individual brightness & contrast values per index as needed
const DIGIT_CONFIGS: DigitCustomization[] = [
  // You can manually set the brightness and contrast for each digit here.
  // The index corresponds to the digit (0 = 1, 1 = 2, etc.)
  { imgSrc: DIGIT_IMAGES[0], rotationDeg: 30, brightness: '90%', contrast: '120%' }, // 1
  { imgSrc: DIGIT_IMAGES[1], rotationDeg: 60, brightness: '90%', contrast: '130%' }, // 2
  { imgSrc: DIGIT_IMAGES[2], rotationDeg: 90, brightness: '90%', contrast: '170%' }, // 3
  { imgSrc: DIGIT_IMAGES[3], rotationDeg: 120, brightness: '90%', contrast: '130%' }, // 4
  { imgSrc: DIGIT_IMAGES[4], rotationDeg: 150, brightness: '100%', contrast: '120%' }, // 5
  { imgSrc: DIGIT_IMAGES[5], rotationDeg: 180, brightness: '100%', contrast: '100%' }, // 6
  { imgSrc: DIGIT_IMAGES[6], rotationDeg: 210, brightness: '110%', contrast: '120%' }, // 7
  { imgSrc: DIGIT_IMAGES[7], rotationDeg: 240, brightness: '90%', contrast: '120%' }, // 8
  { imgSrc: DIGIT_IMAGES[8], rotationDeg: 270, brightness: '110%', contrast: '100%' }, // 9
  { imgSrc: DIGIT_IMAGES[9], rotationDeg: 300, brightness: '80%', contrast: '140%' }, // 10
  { imgSrc: DIGIT_IMAGES[10], rotationDeg: 330, brightness: '80%', contrast: '120%' }, // 11
  { imgSrc: DIGIT_IMAGES[11], rotationDeg: 360, brightness: '110%', contrast: '100%' }, // 12
].map((config) => ({
  ...config,
  sizeVmin: BASE_DIGIT_SIZE_VMIN, // Ensure base size is applied to all
}));

// 2. Main Component
const ClockComponent: React.FC = () => {
  const time = useMillisecondClock();

  // Calculate clock hand degrees efficiently
  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    const ms = time.getMilliseconds();
    const seconds = time.getSeconds() + ms / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    return {
      secondDeg: seconds * 6,
      minuteDeg: minutes * 6,
      hourDeg: hours * 30,
    };
  }, [time]);

  // Initial random hue tint
  const randomStartHue = useMemo(() => Math.floor(Math.random() * 360), []);

  return (
    <main className={styles.container} aria-label="Analog Clock">
      {/* Background Layer with custom contrast and brightness filters */}
      <div
        className={styles.backgroundLayer}
        style={
          {
            '--bg-image': `url(${backgroundImage})`,
            '--bg-brightness': BACKGROUND_SETTINGS.brightness,
            '--bg-contrast': BACKGROUND_SETTINGS.contrast,
          } as CSSProperties
        }
        aria-hidden="true"
      />

      {/* Accessible time representation */}
      <time dateTime={time.toISOString()} aria-label={time.toLocaleTimeString()}>
        <span className={styles.semanticTime}>{time.toLocaleTimeString()}</span>
      </time>

      {/* Color overlay */}
      <div
        aria-hidden="true"
        className={styles.colorOverlay}
        style={{ backgroundColor: `hsl(${randomStartHue}, 70%, 50%)` }}
      />

      {/* Clock Face */}
      <div className={styles.clockFace} aria-hidden="true">
        {/* Digits with individual filter and size controls */}
        {DIGIT_CONFIGS.map(
          (
            {
              imgSrc,
              rotationDeg,
              sizeVmin = BASE_DIGIT_SIZE_VMIN,
              brightness = '100%',
              contrast = '100%',
            },
            i
          ) => {
            const halfDigitVmin = sizeVmin / 2;

            return (
              <div
                key={i}
                className={styles.digit}
                style={
                  {
                    '--bg-image': `url(${imgSrc})`,
                    '--size': `${sizeVmin}vmin`,
                    '--rotation': `${rotationDeg}deg`,
                    '--brightness': brightness,
                    '--contrast': contrast,
                    '--translate-y': `calc(-42.5vmin + ${halfDigitVmin}vmin)`,
                  } as CSSProperties
                }
              />
            );
          }
        )}

        {/* Clock Hands */}
        <div
          className={styles.hourHand}
          style={{
            '--bg-image': `url(${hourHandImage})`,
            transform: `translateX(-50%) rotate(${hourDeg}deg)`,
          } as CSSProperties}
        />
        <div
          className={styles.minuteHand}
          style={{
            '--bg-image': `url(${minuteHandImage})`,
            transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
          } as CSSProperties}
        />
        <div
          className={styles.secondHand}
          style={{
            '--bg-image': `url(${secondHandImage})`,
            transform: `translateX(-50%) rotate(${secondDeg}deg)`,
          } as CSSProperties}
        />

  
      </div>
    </main>
  );
};

// 3. Memoized Component Export
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_07_28';

export default MemoizedClock;
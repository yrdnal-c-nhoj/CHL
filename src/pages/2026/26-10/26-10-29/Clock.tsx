import SRTime from '@/components/SRTime';
import type { CSSProperties } from 'react';
import { useState } from 'react';

import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-29/rave.mp4';
import font from '@/assets/fonts/26fonts/26-10-29.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_29',
  fontUrl: font,
};

interface DigitState {
  hue: number;
  saturation: number;
  lightness: number;
  size: number;

  x: number;
  y: number;
  z: number;

  rx: number;
  ry: number;
  rz: number;
}

type DigitStyle = CSSProperties & {
  '--digit-color': string;
  '--inverse-color': string;
  '--digit-size': string;

  '--x': string;
  '--y': string;
  '--z': string;

  '--rx': string;
  '--ry': string;
  '--rz': string;
};

const random = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

const getInverseColor = (
  hue: number,
  saturation: number,
  lightness: number,
): string => `hsl(${(hue + 180) % 360} ${saturation}% ${100 - lightness}%)`;

const createDigit = (): DigitState => ({
  hue: random(0, 360),
  saturation: random(80, 100),
  lightness: random(45, 75),

  size: random(1.1, 2.8),

  x: random(2, 12),
  y: random(2, 12),
  z: random(20, 100),

  rx: random(20, 100),
  ry: random(20, 100),
  rz: random(15, 70),
});

const createDigits = (): DigitState[] => Array.from({ length: 6 }, createDigit);

const Clock_26_10_29 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const [digitStates] = useState<DigitState[]>(createDigits);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const digits = [...hours, ...minutes, ...seconds];

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.digitalClock} aria-hidden="true">
        {digitStates.map((state, i) => {
          const digit = digits[i];

          if (digit === undefined) {
            return null;
          }

          const digitStyle: DigitStyle = {
            '--digit-color': `hsl(${state.hue} ${state.saturation}% ${state.lightness}%)`,

            '--inverse-color': getInverseColor(
              state.hue,
              state.saturation,
              state.lightness,
            ),

            '--digit-size': `${state.size}`,

            '--x': `${state.x}vmin`,
            '--y': `${state.y}vmin`,
            '--z': `${state.z}px`,

            '--rx': `${state.rx}deg`,
            '--ry': `${state.ry}deg`,
            '--rz': `${state.rz}deg`,
          };

          return (
            <span
              key={i}
              className={`${styles.digitBox} ${styles[`position${i + 1}`]}`}
            >
              <span className={styles.digit} style={digitStyle}>
                {digit}
              </span>
            </span>
          );
        })}
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_29.displayName = 'Clock_26_10_29';

export default Clock_26_10_29;

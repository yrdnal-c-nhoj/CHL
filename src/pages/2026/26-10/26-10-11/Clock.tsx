import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import type { CSSProperties } from 'react';

import font from '@/assets/fonts/26fonts/26-10-11.ttf?url';
import panelsImage from '@/assets/images/26_images/26-10/26-10-11/panels.webp';

import styles from './Clock.module.css';

export const assets = [font, panelsImage];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_11',
  fontUrl: font,
};

const pad = (value: number): string => value.toString().padStart(2, '0');

/** Generate a completely bright random hex color. */
const randomBrightHex = (): string => {
  const min = 80; // ensure every channel is bright
  const r = Math.floor(Math.random() * (256 - min)) + min;
  const g = Math.floor(Math.random() * (256 - min)) + min;
  const b = Math.floor(Math.random() * (256 - min)) + min;
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
};

/** Map each digit to its substituted letter.
 *  Edit this table to remap letters to digits. */
const DIGIT_LETTER_MAP: Record<string, string> = {
  '0': 'A',
  '1': 'Q',
  '2': 'Z',
  '3': 'X',
  '4': '3',
  '5': 'B',
  '6': 'E',
  '7': '7',
  '8': 'V',
  '9': 'R',
};

/** Substitute a letter for a digit character using DIGIT_LETTER_MAP. */
const digitToLetter = (digit: string): string =>
  DIGIT_LETTER_MAP[digit] ?? digit;

interface DigitConfig {
  color: string;
  shadow1: string; // left-side shadow color
  shadow2: string; // right-side shadow color
}

const Clock_26_10_11 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();

  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  // Flat array of individual digit characters: [h,h,m,m,s,s]
  const digits: string[] = [...hours, ...minutes, ...seconds];

  // Every second: pick a bright random color for each digit plus two bright
  // random shadow colors (one for each side). This component only re-renders
  // on each second tick, so colors regenerate once per second.
  const digitConfigs: DigitConfig[] = Array.from({ length: 6 }, () => ({
    color: randomBrightHex(),
    shadow1: randomBrightHex(),
    shadow2: randomBrightHex(),
  }));

  return (
    <main
      className={styles.container}
      style={{ '--background-image': `url(${panelsImage})` } as CSSProperties}
    >
      <div className={styles.digitalGrid} aria-hidden="true">
        {digits.map((digit, i) => {
          const cfg = digitConfigs[i];
          if (!cfg) return null;

          return (
            <span
              key={i}
              className={styles.digitBox}
              style={
                {
                  '--digit-color': cfg.color,
                  '--digit-shadow-1': cfg.shadow1,
                  '--digit-shadow-2': cfg.shadow2,
                } as CSSProperties
              }
            >
              {digitToLetter(digit)}
            </span>
          );
        })}
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_11.displayName = 'Clock_26_10_11';

export default Clock_26_10_11;

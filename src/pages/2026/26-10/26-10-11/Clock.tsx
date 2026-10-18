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

/** Convert HSL to RGB tuple (each 0-255). */
const hslToRgb = (
  h: number,
  s: number,
  l: number,
): [number, number, number] => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
};

/** Generate a very bright, vivid random hex color using HSL. */
const randomBrightHex = (): string => {
  const h = Math.floor(Math.random() * 360); // full hue range
  const s = 90 + Math.random() * 10; // 90–100% saturation (vivid)
  const l = 55 + Math.random() * 10; // 55–65% lightness (bright)
  const [r, g, b] = hslToRgb(h, s, l);
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

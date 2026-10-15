import { useMemo } from 'react';
import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import type { CSSProperties } from 'react';

import font from '@/assets/fonts/26fonts/26-10-11.ttf?url';

import styles from './Clock.module.css';

export const assets = [font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_11',
  fontUrl: font,
};

const pad = (value: number): string => value.toString().padStart(2, '0');

/** Generate a random hex color string. */
const randomHex = (): string =>
  `#${Math.floor(Math.random() * 0x1000000)
    .toString(16)
    .padStart(6, '0')}`;

/** Map each digit to its substituted letter.
 *  Edit this table to remap letters to digits. */
const DIGIT_LETTER_MAP: Record<string, string> = {
  '0': 'A',
  '1': 'B',
  '2': 'C',
  '3': 'D',
  '4': 'E',
  '5': 'F',
  '6': 'G',
  '7': 'H',
  '8': 'I',
  '9': 'J',
};

/** Substitute a letter for a digit character using DIGIT_LETTER_MAP. */
const digitToLetter = (digit: string): string =>
  DIGIT_LETTER_MAP[digit] ?? digit;

interface DigitColors {
  color: string;
  shadow1: string;
  shadow2: string;
}

const Clock_26_10_11 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();

  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  // Flat array of individual digit characters: [h,h,m,m,s,s]
  const digits: string[] = [...hours, ...minutes, ...seconds];

  // One random color + two random shadow colors per digit, stable across re-renders.
  const digitColors = useMemo<DigitColors[]>(() => {
    return digits.map(() => ({
      color: randomHex(),
      shadow1: randomHex(),
      shadow2: randomHex(),
    }));
    // Colors are generated once and never change; they don't depend on `digits` values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.digitalGrid} aria-hidden="true">
        {digits.map((digit, i) => {
          const cfg = digitColors[i];
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

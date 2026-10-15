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

const Clock_26_10_11 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();

  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  // Flat array of individual digit characters: [h,h,m,m,s,s]
  const digits: string[] = [...hours, ...minutes, ...seconds];

  // New random digit color every second (all digits change color simultaneously).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const digitColors = useMemo(
    () => Array.from({ length: 6 }, () => randomHex()),
    [time],
  );

  // Stable shadow-color pair per digit; these alternate each second.
  const shadowPairs = useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        shadowA: randomHex(),
        shadowB: randomHex(),
      })),
    [],
  );

  // Even seconds: shadow1=A, shadow2=B.  Odd seconds: swap them so the
  // shadows alternate every second.
  const isEvenSecond = time.getSeconds() % 2 === 0;

  return (
    <main className={styles.container}>
      <div className={styles.digitalGrid} aria-hidden="true">
        {digits.map((digit, i) => {
          const color = digitColors[i];
          const pair = shadowPairs[i];
          if (!color || !pair) return null;

          return (
            <span
              key={i}
              className={styles.digitBox}
              style={
                {
                  '--digit-color': color,
                  '--digit-shadow-1': isEvenSecond
                    ? pair.shadowA
                    : pair.shadowB,
                  '--digit-shadow-2': isEvenSecond
                    ? pair.shadowB
                    : pair.shadowA,
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

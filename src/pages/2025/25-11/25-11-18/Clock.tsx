import font_2025_11_21 from '@/assets/fonts/25fonts/25-11-18-cat.ttf?url';
import bgImg from '@/assets/images/25_images/25-11/25-11-18/eyes.webp';
import { useEffect, useMemo, useState } from 'react';

import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [bgImg];

export default function RotatedClockGrid() {
  // Using the standardized BTS hook
  const time = useMillisecondClock();
  const timeStr = time.toLocaleTimeString('en-GB', { hour12: false });
  
  // Ensure each part is a two-digit string, even if split returns fewer parts
  const [h = '00', m = '00', s = '00'] = timeStr.split(':');
  const hours = h.padStart(2, '0');
  const minutes = m.padStart(2, '0');
  const seconds = s.padStart(2, '0');

  const slots = [
    hours[0], // Guaranteed to exist now
    hours[1],
    minutes[0],
    minutes[1],
    seconds[0],
    seconds[1],
  ];

  const digitSize = 8; // in vh
  const gap = 1; // in vh
  // Extra buffer: how many clock-columns to add to the left, and how many rows above
  const extraLeft = 6; // increase to show more clocks off the left edge
  const extraTop = 5; // increase to show more clocks above the top edge
  const FONT_FAMILY = 'ClockFont_2025_11_18_cat';

  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: FONT_FAMILY, fontUrl: font_2025_11_21 }],
    [],
  );

  // Suspends component rendering until the font is loaded.
  useSuspenseFontLoader(fontConfigs);

  // 20-color palette provided by user
  const COLORS = [
    '#8B4513',
    '#A0522D',
    '#D2691E',
    '#CD853F',
    '#DEB887',
    '#945F1AFF',
    '#DAA520',
    '#A39F5DFF',
    '#808000',
    '#556B2F',
    '#584703FF',
    '#3CB371',
    '#8FBC8F',
    '#708090',
    '#4682B4',
    '#6495ED',
    '#1E90FF',
    '#00BFFF',
    '#5C82F4FF',
    '#765205FF',
  ];

  // colors for each digit cell; will be regenerated every second
  const totalCells =
    (Math.ceil(100 / (digitSize + gap)) + 4 + extraTop) *
    (Math.ceil(100 / ((digitSize + gap) * 3)) + 4 + extraLeft) *
    6;
  const randIndex = () => Math.floor(Math.random() * COLORS.length);
  const [digitColors, setDigitColors] = useState(() =>
    Array.from({ length: totalCells }, () => randIndex()),
  );

  // Regenerate colors when the seconds value changes.
  // We use useEffect for side effects like updating state based on props/time.
  useEffect(() => {
    setDigitColors(Array.from({ length: totalCells }, () => randIndex()));
  }, [seconds, totalCells]);

  const rowsNeeded = Math.ceil(100 / (digitSize + gap)) + 4 + extraTop;
  const clocksPerRow = Math.ceil(100 / ((digitSize + gap) * 3)) + 4 + extraLeft;

  return (
    <main className={styles.container}>
      {/* Background image with filter applied only to this layer */}
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${bgImg})` }}
      />

      {/* Main grid of digits, no filter applied */}
      <time
        dateTime={`${hours}:${minutes}:${seconds}`}
        className={styles.grid}
        aria-label={time.toLocaleTimeString()}
        style={{
          transform: `rotate(-10deg) translate(-${(digitSize + gap) * extraLeft}dvh, -${(digitSize + gap) * extraTop}dvh)`,
          gridTemplateColumns: `repeat(auto-fill, ${digitSize}dvh)`,
          gridAutoRows: `${digitSize}dvh`,
          gap: `${gap}dvh`,
        }}
      >
        <span className={styles.srOnly}>{time.toLocaleTimeString()}</span>
        {Array.from({ length: rowsNeeded }).map((_, rowIndex) => {
          const startOffset = (rowIndex * 3) % 6;
          return Array.from({ length: clocksPerRow }).map((_, clockIndex) =>
            slots.map((ch, digitIndex) => {
              const columnPosition = clockIndex * 6 + digitIndex + startOffset;
              const globalIndex =
                rowIndex * clocksPerRow * 6 + clockIndex * 6 + digitIndex;
              const color =
                COLORS[digitColors[globalIndex % digitColors.length]];

              return (
                <div
                  key={`${rowIndex}-${clockIndex}-${digitIndex}`}
                  className={styles.digit}
                  style={{
                    gridRow: rowIndex + 1,
                    gridColumn: columnPosition + 1,
                    height: `${digitSize}dvh`,
                    width: `${digitSize}dvh`,
                    fontFamily: FONT_FAMILY + ', monospace',
                    color,
                  }}
                >
                  {ch}
                </div>
              );
            }),
          );
        })}
      </time>
    </main>
  );
}

import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import font from '@/assets/fonts/26fonts/26-11-01.ttf?url';

import styles from './Clock.module.css';

export const assets = [font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_02',
  fontUrl: font,
};

type Direction = 'top' | 'right' | 'bottom' | 'left';

const ORANGE_SHADES = [
  '#fff3e0',
  '#ffe0b2',
  '#ffcc80',
  '#ffb74d',
  '#ffa726',
  '#ff9800',
  '#fb8c00',
  '#f57c00',
  '#ef6c00',
  '#e65100',
  '#ff7043',
  '#ff5722',
  '#f4511e',
  '#e64a19',
  '#d84315',
  '#bf360c',
  '#ff6d00',
  '#dd2c00',
] as const;

interface DigitState {
  char: string;
  oldChar: string;
  id: number;
  startX: string;
  startY: string;
  duration: number;
  delay: number;
  exitDelay: number;
  color: string;
}

type DigitCSSProperties = CSSProperties & {
  '--start-x': string;
  '--start-y': string;
  '--duration': string;
  '--delay': string;
  '--exit-delay': string;
  '--digit-color': string;
};

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const randomDirection = (): Direction => {
  const directions: Direction[] = ['top', 'right', 'bottom', 'left'];

  return directions[Math.floor(Math.random() * directions.length)] as Direction;
};

const createDigit = (char: string, id: number, oldChar = ''): DigitState => {
  const direction = randomDirection();

  let startX = '0vw';
  let startY = '0vh';

  switch (direction) {
    case 'top':
      startX = `${random(-50, 50)}vw`;
      startY = '-120vh';
      break;

    case 'right':
      startX = '120vw';
      startY = `${random(-50, 50)}vh`;
      break;

    case 'bottom':
      startX = `${random(-50, 50)}vw`;
      startY = '120vh';
      break;

    case 'left':
      startX = '-120vw';
      startY = `${random(-50, 50)}vh`;
      break;
  }

  const duration = random(0.6, 1.2);
  const delay = random(0, 0.2);

  // Fade the old digit immediately when new digit starts.
  const exitDelay = delay;

  // Pick random orange shade
  const color = ORANGE_SHADES[
    Math.floor(Math.random() * ORANGE_SHADES.length)
  ] as string;

  return {
    char,
    oldChar,
    id,
    startX,
    startY,
    duration,
    delay,
    exitDelay,
    color,
  };
};

const Clock = () => {
  const time = useClock();

  useSuspenseFontLoader([fontConfig]);

  const timeString = [
    time.getHours().toString().padStart(2, '0'),
    time.getMinutes().toString().padStart(2, '0'),
    time.getSeconds().toString().padStart(2, '0'),
  ].join('');

  const chars = timeString.split('');

  const nextId = useRef(0);
  const previousTime = useRef(timeString);

  const [digits, setDigits] = useState<DigitState[]>(() => {
    let id = 0;
    return chars.map((char) => createDigit(char, id++));
  });

  const containerRef = useRef<HTMLElement>(null);

  // Keep the font size responsive to the actual clock container.
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();

      const fontSize = Math.min(rect.width / 4, rect.height * 1.5);

      container.style.setProperty('--font-size', `${fontSize}px`);
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Animate all six digits whenever the displayed time changes.
  useEffect(() => {
    if (previousTime.current === timeString) return;

    previousTime.current = timeString;

    setDigits((previousDigits) =>
      chars.map((char, index) =>
        createDigit(char, nextId.current++, previousDigits[index]?.char ?? ''),
      ),
    );
  }, [timeString, chars]);

  return (
    <main ref={containerRef} className={styles.container}>
      <SRTime time={time} />

      <div className={styles.grid} aria-hidden="true">
        {digits.map((digit) => {
          const digitStyle: DigitCSSProperties = {
            '--start-x': digit.startX,
            '--start-y': digit.startY,
            '--duration': `${digit.duration}s`,
            '--delay': `${digit.delay}s`,
            '--exit-delay': `${digit.exitDelay}s`,
            '--digit-color': digit.color,
          };

          return (
            <div key={digit.id} className={styles.cell}>
              {digit.oldChar && (
                <span
                  className={`${styles.char} ${styles.oldChar}`}
                  style={digitStyle}
                >
                  {digit.oldChar}
                </span>
              )}

              <span
                className={`${styles.char} ${styles.newChar}`}
                style={digitStyle}
              >
                {digit.char}
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Clock;

Clock.displayName = 'Clock_26_11_02';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, AnimationEvent } from 'react';

import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import clockFont from '@/assets/fonts/26fonts/26-11-24.ttf?url';

import styles from './Clock.module.css';

export const assets = [clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_24',
  fontUrl: clockFont,
};

interface FallStyle extends CSSProperties {
  '--rotate-x': string;
  '--rotate-y': string;
  '--rotate-z': string;
  '--fall-duration': string;
  '--fall-distance': string;
  '--animation-delay'?: string;
}

interface FallingDigitData {
  value: string;
  id: number;
  style: FallStyle;
}

interface FallingDigitProps {
  value: string;
  columnIndex: number;
  totalColumns: number;
  initialDigits: FallingDigitData[];
}

const randomRotation = () => {
  const direction = Math.random() > 0.5 ? 1 : -1;
  return direction * (360 + Math.random() * 1080);
};

const getColumnInterval = (columnIndex: number): number => {
  switch (columnIndex) {
    case 5:
      return 1;
    case 4:
      return 10;
    case 3:
      return 60;
    case 2:
      return 600;
    case 1:
      return 3600;
    case 0:
      return 36000;
    default:
      return 1;
  }
};

const FallingDigit = ({
  value,
  columnIndex,
  totalColumns,
  initialDigits,
}: FallingDigitProps) => {
  const previous = useRef(value);
  const nextId = useRef(0);

  const [exiting, setExiting] = useState<FallingDigitData[]>(
    () => initialDigits,
  );

  useEffect(() => {
    if (previous.current === value) return;

    const oldValue = previous.current;
    previous.current = value;

    // Rightmost column falls fastest.
    const baseDuration = (10000 + Math.random() * 5000) * 2.25;
    const columnsFromRight = totalColumns - 1 - columnIndex;

    const duration = baseDuration * Math.pow(2, columnsFromRight);

    const digit: FallingDigitData = {
      value: oldValue,
      id: ++nextId.current,
      style: {
        '--rotate-x': `${randomRotation()}deg`,
        '--rotate-y': `${randomRotation()}deg`,
        '--rotate-z': `${randomRotation()}deg`,
        '--fall-duration': `${duration}ms`,
        '--fall-distance': '150vh',
      },
    };

    setExiting((current) => [...current, digit]);
  }, [value, columnIndex, totalColumns]);

  // Remove each digit when its CSS animation finishes.
  const handleAnimationEnd = (
    event: AnimationEvent<HTMLSpanElement>,
    digitId: number,
  ) => {
    if (event.target !== event.currentTarget) return;

    setExiting((current) => current.filter((digit) => digit.id !== digitId));
  };

  return (
    <span className={styles.digit}>
      <span className={styles.current}>{value}</span>

      {exiting.map((digit) => (
        <span
          key={digit.id}
          className={styles.falling}
          style={digit.style}
          onAnimationEnd={(event) => handleAnimationEnd(event, digit.id)}
          aria-hidden="true"
        >
          {digit.value}
        </span>
      ))}
    </span>
  );
};

const Clock_26_11_24 = () => {
  const time = useSmoothClock(16);

  useSuspenseFontLoader([fontConfig]);

  // Capture the starting time once.
  const [historyTime] = useState(() => time);

  const displayTime = time
    .toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/:/g, '');

  const digitColumns = displayTime.length;

  // Generate historical digits only once, not on every clock render.
  const generateInitialDigits = (
    columnIndex: number,
    totalColumns: number,
  ): FallingDigitData[] => {
    const seed =
      columnIndex * 1000 +
      historyTime.getHours() * 100 +
      historyTime.getMinutes() * 10 +
      historyTime.getSeconds();

    let randomState = seed;

    const nextRandom = () => {
      randomState = (randomState * 1664525 + 1013904223) % 4294967296;

      return randomState / 4294967296;
    };

    const baseDuration = (10000 + nextRandom() * 5000) * 2.25;

    const columnsFromRight = totalColumns - 1 - columnIndex;

    const duration = baseDuration * Math.pow(2, columnsFromRight);

    const intervalMs = getColumnInterval(columnIndex) * 1000;

    // Limit initial elements to reduce mobile rendering overhead.
    const historyCount = 20;

    const hours = historyTime.getHours();
    const minutes = historyTime.getMinutes();
    const seconds = historyTime.getSeconds();

    const historicalDigits: number[] = [];

    let h = hours;
    let m = minutes;
    let s = seconds;

    for (let step = 0; step < historyCount; step++) {
      let digit = 0;

      switch (columnIndex) {
        case 0:
          digit = Math.floor(h / 10);
          break;
        case 1:
          digit = h % 10;
          break;
        case 2:
          digit = Math.floor(m / 10);
          break;
        case 3:
          digit = m % 10;
          break;
        case 4:
          digit = Math.floor(s / 10);
          break;
        case 5:
          digit = s % 10;
          break;
      }

      historicalDigits.push(digit);

      s--;

      if (s < 0) {
        s = 59;
        m--;

        if (m < 0) {
          m = 59;
          h--;

          if (h < 0) {
            h = 23;
          }
        }
      }
    }

    const maxHistorySteps = Math.min(
      historyCount,
      Math.ceil(duration / intervalMs) + 5,
    );

    const digits: FallingDigitData[] = [];

    for (let step = 0; step < maxHistorySteps; step++) {
      const digitIndex = Math.min(step, historicalDigits.length - 1);

      const elapsedMs = step * intervalMs;

      // Do not render digits that have nearly completed their fall.
      if (elapsedMs >= duration * 0.95) continue;

      digits.push({
        value: String(historicalDigits[digitIndex]),
        id: -(step + 1),
        style: {
          '--rotate-x': `${(nextRandom() > 0.5 ? 1 : -1) * (360 + nextRandom() * 1080)}deg`,
          '--rotate-y': `${(nextRandom() > 0.5 ? 1 : -1) * (360 + nextRandom() * 1080)}deg`,
          '--rotate-z': `${(nextRandom() > 0.5 ? 1 : -1) * (360 + nextRandom() * 1080)}deg`,
          '--fall-duration': `${duration}ms`,
          '--fall-distance': '150vh',
          '--animation-delay': `-${elapsedMs}ms`,
        },
      });
    }

    return digits;
  };

  const [initialDigitsByColumn] = useState(() =>
    Array.from({ length: digitColumns }, (_, index) =>
      generateInitialDigits(index, digitColumns),
    ),
  );

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.content} aria-hidden="true">
        {displayTime.split('').map((char, index) => (
          <FallingDigit
            key={index}
            value={char}
            columnIndex={index}
            totalColumns={digitColumns}
            initialDigits={initialDigitsByColumn[index] ?? []}
          />
        ))}
      </div>
    </main>
  );
};

Clock_26_11_24.displayName = 'Clock_26_11_24';

export default Clock_26_11_24;

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

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
  initialDigits?: FallingDigitData[];
}

const FallingDigit = ({
  value,
  columnIndex,
  totalColumns,
  initialDigits = [],
}: FallingDigitProps) => {
  const previous = useRef(value);
  const id = useRef(0);

  const [exiting, setExiting] = useState<FallingDigitData[]>(initialDigits);

  // Track active digits with frame counts for rAF-based cleanup
  const digitsRef = useRef<
    Map<number, { framesElapsed: number; maxFrames: number }>
  >(new Map());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const digitsMap = digitsRef.current;
    const raf = rafRef;

    if (previous.current === value) return;

    const oldValue = previous.current;
    previous.current = value;

    const randomRotation = () => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      return direction * (360 + Math.random() * 1080);
    };

    // Rightmost column (totalColumns - 1) = base speed
    // Each column to the left: half speed (2x duration) = exponential
    // Slow all by 1/3 twice (multiply duration by 1.5 * 1.5 = 2.25)
    const baseDuration = (10000 + Math.random() * 5000) * 2.25;
    const columnsFromRight = totalColumns - 1 - columnIndex;
    const duration = baseDuration * Math.pow(2, columnsFromRight);
    // At 60fps, each frame ~16.67ms. Add 6 frames buffer (~100ms).
    const maxFrames = Math.ceil(duration / 16.67) + 6;

    const digit: FallingDigitData = {
      value: oldValue,
      id: ++id.current,
      style: {
        '--rotate-x': `${randomRotation()}deg`,
        '--rotate-y': `${randomRotation()}deg`,
        '--rotate-z': `${randomRotation()}deg`,
        '--fall-duration': `${duration}ms`,
        '--fall-distance': '150vh',
      },
    };

    setExiting((current) => [...current, digit]);
    digitsMap.set(digit.id, { framesElapsed: 0, maxFrames });

    // Start rAF cleanup loop if not already running
    if (!raf.current) {
      const cleanup = () => {
        let hasActive = false;
        digitsMap.forEach((meta, digitId) => {
          meta.framesElapsed += 1;
          if (meta.framesElapsed >= meta.maxFrames) {
            digitsMap.delete(digitId);
            setExiting((current) =>
              current.filter((item) => item.id !== digitId),
            );
          } else {
            hasActive = true;
          }
        });
        if (hasActive) {
          raf.current = requestAnimationFrame(cleanup);
        } else {
          raf.current = 0;
        }
      };
      raf.current = requestAnimationFrame(cleanup);
    }

    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = 0;
      }
      digitsMap.clear();
    };
  }, [value, columnIndex, totalColumns]);

  return (
    <span className={styles.digit}>
      <span className={styles.current}>{value}</span>

      {exiting.map((digit) => (
        <span
          key={digit.id}
          className={styles.falling}
          style={digit.style}
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

  const displayTime = time
    .toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/:/g, '');

  // Count digit columns (no colons)
  const digitColumns = displayTime.length;

  // Generate initial "historical" digits for each column to simulate hours of runtime
  // Generates a realistic backwards sequence from current time
  const generateInitialDigits = (
    columnIndex: number,
    totalColumns: number,
  ): FallingDigitData[] => {
    // Deterministic pseudo-random based on columnIndex and current time (stable per render)
    const seed = columnIndex * 1000 + time.getHours() * 100 + time.getMinutes();
    let randomState = seed;
    const nextRandom = () => {
      randomState = (randomState * 1664525 + 1013904223) % 4294967296;
      return randomState / 4294967296;
    };

    const randomRotation = () => {
      const direction = nextRandom() > 0.5 ? 1 : -1;
      return direction * (360 + nextRandom() * 1080);
    };

    const baseDuration = (10000 + nextRandom() * 5000) * 2.25;
    const columnsFromRight = totalColumns - 1 - columnIndex;
    const duration = baseDuration * Math.pow(2, columnsFromRight);

    // Number of historical digits per column - ensure all columns show history
    // Since slower columns' digits persist longer, give them fewer history items
    const baseHistoryCount = 12;
    const historyCount =
      baseHistoryCount + Math.floor(4 / Math.pow(2, columnsFromRight));

    // Get current time components
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Generate historically accurate sequence for each column (going backwards in time)
    const getHistoricalSequence = (col: number): number[] => {
      const sequence: number[] = [];
      let h = hours;
      let m = minutes;
      let s = seconds;

      // Generate enough history by stepping backwards
      const stepsNeeded = historyCount * 2; // Generate extra, we'll slice
      for (let step = 0; step < stepsNeeded; step++) {
        let digit = 0;
        switch (col) {
          case 0: // Hours tens (0, 1, 2 for 24-hour)
            digit = Math.floor(h / 10);
            break;
          case 1: // Hours ones (0-9)
            digit = h % 10;
            break;
          case 2: // Minutes tens (0-5)
            digit = Math.floor(m / 10);
            break;
          case 3: // Minutes ones (0-9)
            digit = m % 10;
            break;
          case 4: // Seconds tens (0-5)
            digit = Math.floor(s / 10);
            break;
          case 5: // Seconds ones (0-9)
            digit = s % 10;
            break;
        }
        sequence.push(digit);

        // Step back one second
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

      // Return only what we need (most recent first, which will be at the bottom visually)
      return sequence.slice(0, historyCount);
    };

    const historicalDigits = getHistoricalSequence(columnIndex);

    // Calculate exact positions if clock has been running for hours.
    // Each column changes at its own interval. For each historical digit,
    // compute how long ago it was the current value, then its position
    // in the fall = (elapsedTime / fallDuration) * 100%.

    const getIntervalForColumn = (col: number): number => {
      switch (col) {
        case 5:
          return 1; // Seconds ones: changes every 1 second
        case 4:
          return 10; // Seconds tens: changes every 10 seconds
        case 3:
          return 60; // Minutes ones: changes every 60 seconds
        case 2:
          return 600; // Minutes tens: changes every 10 minutes (600s)
        case 1:
          return 3600; // Hours ones: changes every hour (3600s)
        case 0:
          return 36000; // Hours tens: changes every 10 hours (36000s)
        default:
          return 1;
      }
    };

    const interval = getIntervalForColumn(columnIndex); // seconds
    const intervalMs = interval * 1000;

    const digits: FallingDigitData[] = [];
    // Generate enough history to fill the fall (simulate hours of runtime)
    // For slow columns, we need more steps back in time to get digits in the fall
    const maxHistorySteps = Math.max(
      historicalDigits.length,
      Math.ceil(duration / intervalMs) + 5,
    );

    for (let step = 0; step < maxHistorySteps; step++) {
      // Get the digit value for this step back in time
      const digitIndex = Math.min(step, historicalDigits.length - 1);
      const value = String(historicalDigits[digitIndex]);

      // This digit was current `step * interval` seconds ago
      const elapsedMs = step * intervalMs;
      // Negative delay = started falling in the past
      const delay = -elapsedMs;

      // Only include digits that are still in the fall (not yet faded out)
      // Cap at 95% through fall so they don't disappear immediately
      if (delay > -duration * 0.95) {
        digits.push({
          value,
          id: -(step + 1),
          style: {
            '--rotate-x': `${randomRotation()}deg`,
            '--rotate-y': `${randomRotation()}deg`,
            '--rotate-z': `${randomRotation()}deg`,
            '--fall-duration': `${duration}ms`,
            '--fall-distance': '150vh',
            '--animation-delay': `${delay}ms`,
          } as FallStyle,
        });
      }
    }
    return digits;
  };

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.content} aria-hidden="true">
        {displayTime.split('').map((char, index) => {
          // Calculate column index among digits only (0 = leftmost, digitColumns-1 = rightmost)
          const columnIndex = index;
          const initialDigits = generateInitialDigits(
            columnIndex,
            digitColumns,
          );
          return (
            <FallingDigit
              key={index}
              value={char}
              columnIndex={columnIndex}
              totalColumns={digitColumns}
              initialDigits={initialDigits}
            />
          );
        })}
      </div>
    </main>
  );
};

Clock_26_11_24.displayName = 'Clock_26_11_24';

export default Clock_26_11_24;

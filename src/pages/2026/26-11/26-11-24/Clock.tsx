import { useEffect, useMemo, useRef, useState } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import type { CSSProperties } from 'react';

import clockFont from '@/assets/fonts/26fonts/26-11-24.ttf?url';

import styles from './Clock.module.css';

export const assets = [clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_24',
  fontUrl: clockFont,
};

// Constants
const COLUMNS = 6;
const BASE_DURATION_MULTIPLIER = 2.25;
const MIN_DURATION = 10_000;
const DURATION_RANGE = 5_000;
const FALL_DISTANCE = '150vh';
const MAX_FALL_RATIO = 0.95;
const HISTORY_COUNT = 20;
const MAX_HISTORY_BUFFER = 5;

const COLUMN_INTERVALS_MS: readonly [
  number,
  number,
  number,
  number,
  number,
  number,
] = [36_000_000, 3_600_000, 600_000, 60_000, 10_000, 1_000] as const;

// Seeded pseudo-random generator (LCG)
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function randomRotation(random: () => number): number {
  const dir = random() > 0.5 ? 1 : -1;
  return dir * (360 + random() * 1080);
}

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
  initialDigits: FallingDigitData[];
  duration: number;
}

const makeFallStyle = (
  duration: number,
  delay = 0,
  seed: number,
): FallStyle => {
  const random = createRandom(seed);
  return {
    '--rotate-x': `${randomRotation(random)}deg`,
    '--rotate-y': `${randomRotation(random)}deg`,
    '--rotate-z': `${randomRotation(random)}deg`,
    '--fall-duration': `${duration}ms`,
    '--fall-distance': FALL_DISTANCE,
    '--animation-delay': `-${delay}ms`,
  };
};

const FallingDigit = ({
  value,
  initialDigits,
  duration,
}: FallingDigitProps) => {
  const previous = useRef(value);
  const nextId = useRef(0);
  const [exiting, setExiting] = useState<FallingDigitData[]>(initialDigits);

  useEffect(() => {
    previous.current = value;
  }, [value]);

  const handleAnimationEnd = (
    event: React.AnimationEvent<HTMLSpanElement>,
    digitId: number,
  ) => {
    if (event.target === event.currentTarget) {
      setExiting((current) => current.filter((d) => d.id !== digitId));
    }
  };

  useEffect(() => {
    if (previous.current === value) return;

    const oldValue = previous.current;
    previous.current = value;
    const nextIdValue = ++nextId.current;
    const digit: FallingDigitData = {
      value: oldValue,
      id: nextIdValue,
      style: makeFallStyle(duration, 0, nextIdValue),
    };
    setExiting((current) => [...current, digit]);
  }, [value, duration]);

  return (
    <span className={styles.digit}>
      <span className={styles.current}>{value}</span>
      {exiting.map((digit) => (
        <span
          key={digit.id}
          className={styles.falling}
          style={digit.style}
          onAnimationEnd={(e) => handleAnimationEnd(e, digit.id)}
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

  // Pre-compute durations once using stable random seeds
  const columnDurations = useMemo(() => {
    const getColumnDuration = (columnIndex: number) => {
      const random = createRandom(columnIndex + 1);
      const baseDuration =
        (MIN_DURATION + random() * DURATION_RANGE) * BASE_DURATION_MULTIPLIER;
      const columnsFromRight = COLUMNS - 1 - columnIndex;
      return baseDuration * 2 ** columnsFromRight;
    };

    return [
      getColumnDuration(0),
      getColumnDuration(1),
      getColumnDuration(2),
      getColumnDuration(3),
      getColumnDuration(4),
      getColumnDuration(5),
    ] as const;
  }, []);

  // Extract time values for useMemo dependencies
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Memoize initial digits - only runs once
  const initialDigitsByColumn = useMemo(() => {
    const h = hours;
    const m = minutes;
    const s = seconds;

    return Array.from({ length: COLUMNS }, (_, columnIndex) => {
      const intervalMs = COLUMN_INTERVALS_MS[columnIndex] as number;
      const duration = columnDurations[columnIndex] as number;

      // Generate historical digits by stepping back in time
      let hh = h;
      let mm = m;
      let ss = s;

      const historicalDigits: number[] = [];
      for (let step = 0; step < HISTORY_COUNT; step++) {
        let digit = 0;
        switch (columnIndex) {
          case 0:
            digit = Math.floor(hh / 10);
            break;
          case 1:
            digit = hh % 10;
            break;
          case 2:
            digit = Math.floor(mm / 10);
            break;
          case 3:
            digit = mm % 10;
            break;
          case 4:
            digit = Math.floor(ss / 10);
            break;
          case 5:
            digit = ss % 10;
            break;
        }
        historicalDigits.push(digit);

        // Step back one second
        ss--;
        if (ss < 0) {
          ss = 59;
          mm--;
        }
        if (mm < 0) {
          mm = 59;
          hh--;
        }
        if (hh < 0) {
          hh = 23;
        }
      }

      const maxSteps = Math.min(
        HISTORY_COUNT,
        Math.ceil(duration / intervalMs) + MAX_HISTORY_BUFFER,
      );
      const digits: FallingDigitData[] = [];

      for (let step = 0; step < maxSteps; step++) {
        const elapsedMs = step * intervalMs;
        if (elapsedMs >= duration * MAX_FALL_RATIO) continue;

        digits.push({
          value: String(
            historicalDigits[Math.min(step, historicalDigits.length - 1)],
          ),
          id: -(step + 1),
          style: makeFallStyle(duration, elapsedMs, step),
        });
      }
      return digits;
    });
  }, [hours, minutes, seconds, columnDurations]);

  const displayTime = time
    .toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/:/g, '');

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.content} aria-hidden="true">
        {displayTime.split('').map((char, index) => {
          const duration = columnDurations[index] as number;
          return (
            <FallingDigit
              key={index}
              value={char}
              initialDigits={initialDigitsByColumn[index] ?? []}
              duration={duration}
            />
          );
        })}
      </div>
    </main>
  );
};

Clock_26_11_24.displayName = 'Clock_26_11_24';

export default Clock_26_11_24;

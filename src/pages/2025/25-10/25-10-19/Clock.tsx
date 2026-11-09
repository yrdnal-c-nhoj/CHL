import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useEffect, useState } from 'react';

import blackImg from '@/assets/images/25_images/25-10/25-10-19/tile1.jpg';
import pinkImg from '@/assets/images/25_images/25-10/25-10-19/tile2.jpg';

import styles from './Clock.module.css';

export const assets = [blackImg, pinkImg];

const GRID_SIZE = 5;
const DIGIT_GAP = 3;
const CELL_GAP = 1;

const DIGITS = {
  0: Array(GRID_SIZE)
    .fill(0)
    .map((_, r) =>
      Array(GRID_SIZE)
        .fill(0)
        .map((_, c) =>
          r === 0 || r === GRID_SIZE - 1 || c === 0 || c === GRID_SIZE - 1
            ? 1
            : 0,
        ),
    ),
  1: Array(GRID_SIZE)
    .fill(0)
    .map((_, r) =>
      Array(GRID_SIZE)
        .fill(0)
        .map((_, c) => (c === Math.floor(GRID_SIZE / 2) ? 1 : 0)),
    ),
  2: Array(GRID_SIZE)
    .fill(0)
    .map((_, r) =>
      Array(GRID_SIZE)
        .fill(0)
        .map((_, c) =>
          r === 0 ||
          r === Math.floor(GRID_SIZE / 2) ||
          r === GRID_SIZE - 1 ||
          (r < Math.floor(GRID_SIZE / 2) && c === GRID_SIZE - 1) ||
          (r > Math.floor(GRID_SIZE / 2) && c === 0)
            ? 1
            : 0,
        ),
    ),
  3: Array(GRID_SIZE)
    .fill(0)
    .map((_, r) =>
      Array(GRID_SIZE)
        .fill(0)
        .map((_, c) =>
          r === 0 ||
          r === Math.floor(GRID_SIZE / 2) ||
          r === GRID_SIZE - 1 ||
          c === GRID_SIZE - 1
            ? 1
            : 0,
        ),
    ),
  4: Array(GRID_SIZE)
    .fill(0)
    .map((_, r) =>
      Array(GRID_SIZE)
        .fill(0)
        .map((_, c) =>
          c === GRID_SIZE - 1 ||
          r === Math.floor(GRID_SIZE / 2) ||
          (c === 0 && r < Math.floor(GRID_SIZE / 2))
            ? 1
            : 0,
        ),
    ),
  5: Array(GRID_SIZE)
    .fill(0)
    .map((_, r) =>
      Array(GRID_SIZE)
        .fill(0)
        .map((_, c) =>
          r === 0 ||
          r === Math.floor(GRID_SIZE / 2) ||
          r === GRID_SIZE - 1 ||
          (r < Math.floor(GRID_SIZE / 2) && c === 0) ||
          (r > Math.floor(GRID_SIZE / 2) && c === GRID_SIZE - 1)
            ? 1
            : 0,
        ),
    ),
  6: Array(GRID_SIZE)
    .fill(0)
    .map((_, r) =>
      Array(GRID_SIZE)
        .fill(0)
        .map((_, c) =>
          r === 0 ||
          r === Math.floor(GRID_SIZE / 2) ||
          r === GRID_SIZE - 1 ||
          c === 0 ||
          (r > Math.floor(GRID_SIZE / 2) && c === GRID_SIZE - 1)
            ? 1
            : 0,
        ),
    ),
  7: Array(GRID_SIZE)
    .fill(0)
    .map((_, r) =>
      Array(GRID_SIZE)
        .fill(0)
        .map((_, c) => (r === 0 || c === GRID_SIZE - 1 - r ? 1 : 0)),
    ),
  8: Array(GRID_SIZE)
    .fill(0)
    .map((_, r) =>
      Array(GRID_SIZE)
        .fill(0)
        .map((_, c) =>
          r === 0 ||
          r === GRID_SIZE - 1 ||
          r === Math.floor(GRID_SIZE / 2) ||
          c === 0 ||
          c === GRID_SIZE - 1
            ? 1
            : 0,
        ),
    ),
  9: Array(GRID_SIZE)
    .fill(0)
    .map((_, r) =>
      Array(GRID_SIZE)
        .fill(0)
        .map((_, c) =>
          r === 0 ||
          r === GRID_SIZE - 1 ||
          r === Math.floor(GRID_SIZE / 2) ||
          c === GRID_SIZE - 1 ||
          (c === 0 && r < Math.floor(GRID_SIZE / 2))
            ? 1
            : 0,
        ),
    ),
} as const;

const Clock_25_10_19 = () => {
  const time = useClock();

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const digits = [...hours, ...minutes, ...seconds];
  const isMobile = windowSize.width <= 768;

  const digitSize = (() => {
    if (isMobile) {
      const pairCount = 3;
      const totalGap = DIGIT_GAP * (pairCount - 1);
      const maxHeightPerPair = (windowSize.height - totalGap) / pairCount;
      const maxWidthPerDigit = (windowSize.width - DIGIT_GAP) / 2;
      return Math.floor(Math.min(maxHeightPerPair, maxWidthPerDigit));
    }
    const totalGap = DIGIT_GAP * (digits.length - 1);
    return Math.floor((windowSize.width - totalGap) / digits.length);
  })();

  const renderDigit = (digit: string) => {
    const grid = DIGITS[digit as keyof typeof DIGITS] || DIGITS['0'];
    const totalCellGap = CELL_GAP * (GRID_SIZE - 1);
    const cellSize = (digitSize - totalCellGap) / GRID_SIZE;

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`,
          gap: `${CELL_GAP}px`,
          width: '100%',
          height: '100%',
        }}
      >
        <SRTime time={time} />
        {grid.flat().map((val, idx) => (
          <img
            key={idx}
            src={val ? blackImg : pinkImg}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        ))}
      </div>
    );
  };

  const renderPair = (pairDigits: string[], offset: number) => (
    <div style={{ display: 'flex', gap: `${DIGIT_GAP}px` }}>
      {pairDigits.map((d, i) => (
        <div key={i + offset} style={{ width: digitSize, height: digitSize }}>
          {renderDigit(d)}
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100dvh',
        gap: `${DIGIT_GAP}px`,
        backgroundColor: '#1F4E79',
        overflow: 'hidden',
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      {isMobile ? (
        <>
          {renderPair(digits.slice(0, 2), 0)}
          {renderPair(digits.slice(2, 4), 2)}
          {renderPair(digits.slice(4, 6), 4)}
        </>
      ) : (
        digits.map((d, i) => (
          <div key={i} style={{ width: digitSize, height: digitSize }}>
            {renderDigit(d)}
          </div>
        ))
      )}
    </div>
  );
};

Clock_25_10_19.displayName = 'Clock_25_10_19';
export default Clock_25_10_19;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useSecondClock } from '../../../utils/useSmoothClock';
import styles from './Clock.module.css';

const WordClock: React.FC = () => {
  // Temporarily disable font loader to fix hook error
  // const fontConfigs = useMemo(() => [{
  //   fontFamily: 'Cinzel Decorative',
  //   fontUrl: 'https://fonts.gstatic.com/s/cinzeldecorative/v16/daaCSScvJGqLYhL8tTN8svvPq2_2p.woff2',
  //   options: { weight: '700', style: 'normal' }
  // }], []);

  // useSuspenseFontLoader(fontConfigs);

  const now = useSecondClock();

  const grid = [
    ['I', 'T', 'L', 'I', 'S', 'A', 'S', 'T', 'A', 'M', 'P'],
    ['A', 'C', 'Q', 'U', 'A', 'R', 'T', 'E', 'R', 'D', 'C'],
    ['T', 'W', 'E', 'N', 'T', 'Y', 'F', 'I', 'V', 'E', 'X'],
    ['H', 'A', 'L', 'F', 'S', 'T', 'E', 'N', 'F', 'T', 'O'],
    ['P', 'A', 'S', 'T', 'E', 'R', 'U', 'S', 'E', 'V', 'E', 'N'],
    ['O', 'N', 'E', 'T', 'W', 'O', 'T', 'H', 'R', 'E', 'E'],
    ['F', 'O', 'U', 'R', 'F', 'I', 'V', 'E', 'S', 'I', 'X'],
    ['N', 'I', 'N', 'E', 'K', 'T', 'W', 'E', 'L', 'V', 'E'],
    ['E', 'I', 'G', 'H', 'T', 'E', 'L', 'E', 'V', 'E', 'N'],
    ['T', 'E', 'N', 'O', 'C', 'L', 'O', 'C', 'K', 'S', 'X'],
  ];

  const mapping = {
    it: [
      [0, 0],
      [0, 1],
    ],
    is: [
      [0, 3],
      [0, 4],
    ],
    quarter: [
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
      [1, 7],
      [1, 8],
    ],
    twenty: [
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [2, 5],
      [2, 6],
      [2, 7],
    ],
    five: [
      [2, 8],
      [2, 9],
    ],
    half: [
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
    ],
    ten: [
      [3, 6],
      [3, 7],
      [3, 8],
    ],
    past: [
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    to: [
      [4, 6],
      [4, 7],
    ],
    one: [
      [5, 0],
      [5, 1],
      [5, 2],
    ],
    two: [
      [5, 3],
      [5, 4],
      [5, 5],
    ],
    three: [
      [5, 6],
      [5, 7],
      [5, 8],
      [5, 9],
      [5, 10],
    ],
    four: [
      [6, 0],
      [6, 1],
      [6, 2],
      [6, 3],
    ],
    six: [
      [6, 5],
      [6, 6],
      [6, 7],
    ],
    seven: [
      [4, 8],
      [4, 9],
      [4, 10],
    ],
    eight: [
      [8, 1],
      [8, 2],
      [8, 3],
      [8, 4],
      [8, 5],
    ],
    nine: [
      [7, 0],
      [7, 1],
      [7, 2],
      [7, 3],
      [7, 4],
    ],
    eleven: [
      [8, 6],
      [8, 7],
      [8, 8],
      [8, 9],
      [8, 10],
    ],
    twelve: [
      [7, 5],
      [7, 6],
      [7, 7],
      [7, 8],
      [7, 9],
      [7, 10],
    ],
    oclock: [
      [9, 3],
      [9, 4],
      [9, 5],
      [9, 6],
      [9, 7],
      [9, 8],
    ],
  };

  const activeIndices = useMemo(() => {
    const h = now.getHours();
    const m = now.getMinutes();
    const active = new Set();

    const lightUp = (key) => {
      mapping[key]?.forEach(([r, c]) => active.add(`${r}-${c}`));
    };

    lightUp('it');
    lightUp('is');

    let displayHour = h % 12 || 12;
    if (m >= 35) displayHour = (h + 1) % 12 || 12;

    // Minute logic
    if (m >= 5 && m < 10) {
      lightUp('five');
      lightUp('past');
    } else if (m >= 10 && m < 15) {
      lightUp('ten');
      lightUp('past');
    } else if (m >= 15 && m < 20) {
      lightUp('quarter');
      lightUp('past');
    } else if (m >= 20 && m < 25) {
      lightUp('twenty');
      lightUp('past');
    } else if (m >= 25 && m < 30) {
      lightUp('twenty');
      lightUp('five');
      lightUp('past');
    } else if (m >= 30 && m < 35) {
      lightUp('half');
      lightUp('past');
    } else if (m >= 35 && m < 40) {
      lightUp('twenty');
      lightUp('five');
      lightUp('to');
    } else if (m >= 40 && m < 45) {
      lightUp('twenty');
      lightUp('to');
    } else if (m >= 45 && m < 50) {
      lightUp('quarter');
      lightUp('to');
    } else if (m >= 50 && m < 55) {
      lightUp('ten');
      lightUp('to');
    } else if (m >= 55) {
      lightUp('five');
      lightUp('to');
    } else {
      lightUp('oclock');
    }

    lightUp(displayHour.toString());

    return active;
  }, [now]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {grid.map((row, rIdx) => (
          <div key={rIdx} className={styles.row}>
            {row.map((char, cIdx) => (
              <span
                key={`${rIdx}-${cIdx}`}
                className={`${styles.char} ${activeIndices.has(`${rIdx}-${cIdx}`) ? styles.active : ''}`}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordClock;

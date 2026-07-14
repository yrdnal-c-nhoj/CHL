import { useClockTime } from '@/utils/clockUtils';
import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    fontFamily: '"Share Tech Mono", monospace',
    padding: '2vmin',
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(11, 1fr)',
    gap: '0.5vmin',
    width: '95vmin',
    maxWidth: '800px',
  },
  letter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '5.5vmin',
    color: '#444',
    transition: 'color 0.5s ease, text-shadow 0.5s ease',
    textTransform: 'uppercase',
  },
};

const WORD_GRID = [
  'ITLISASTIME',
  'ACQUARTERDC',
  'TWENTYFIVEX',
  'HALFBTENSTO',
  'PASTERUNINE',
  'ONESIXTHREE',
  'FOURFIVETWO',
  'EIGHTELEVEN',
  'SEVENTWELVE',
  'TENSEOCLOCK',
];

const getActiveIndices = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const active = new Set<string>();

  // "IT IS"
  [0, 1, 3, 4].forEach((i) => active.add(`0-${i}`));

  const displayHour = hours % 12;
  let hourWord = displayHour;
  if (minutes > 34) {
    hourWord = (displayHour + 1) % 12;
  }
  hourWord = hourWord === 0 ? 12 : hourWord;

  const ranges: { [key: string]: [number, number, number] } = {
    1: [5, 0, 2], 2: [6, 8, 10], 3: [5, 7, 11], 4: [6, 0, 3],
    5: [6, 4, 7], 6: [5, 3, 5], 7: [8, 0, 4], 8: [7, 0, 4],
    9: [4, 7, 10], 10: [9, 0, 2], 11: [7, 5, 10], 12: [8, 5, 10],
  };

  const range = ranges[hourWord];
  if (!range) return active;
  const [row, start, end] = range;

  for (let i = start; i <= end; i++) active.add(`${row}-${i}`);

  if (minutes >= 5 && minutes <= 9) [3, 7, 10].forEach(i => active.add(`2-${i}`)); // FIVE
  if (minutes >= 10 && minutes <= 14) [3, 5, 7].forEach(i => active.add(`3-${i}`)); // TEN
  if (minutes >= 15 && minutes <= 19) [1, 2, 8].forEach(i => active.add(`1-${i}`)); // A QUARTER
  if (minutes >= 20 && minutes <= 24) [2, 0, 5].forEach(i => active.add(`2-${i}`)); // TWENTY
  if (minutes >= 25 && minutes <= 29) { [2, 0, 5].forEach(i => active.add(`2-${i}`)); [2, 7, 10].forEach(i => active.add(`2-${i}`)); } // TWENTY FIVE
  if (minutes >= 30 && minutes <= 34) [3, 0, 3].forEach(i => active.add(`3-${i}`)); // HALF

  if (minutes >= 5 && minutes <= 34) [4, 0, 3].forEach(i => active.add(`4-${i}`)); // PAST
  if (minutes >= 35 && minutes <= 59) [3, 8, 9].forEach(i => active.add(`3-${i}`)); // TO

  if (minutes < 5 || minutes > 59) {
    [9, 5, 10].forEach((i) => active.add(`9-${i}`)); // O'CLOCK
  }

  return active;
};

const Letter: React.FC<{ char: string; active: boolean }> = React.memo(
  ({ char, active }) => {
    const letterStyle: React.CSSProperties = {
      ...styles.letter,
      color: active ? '#fff' : '#444',
      textShadow: active ? '0 0 10px #fff, 0 0 20px #2d7dd2' : 'none',
    };
    return <div style={letterStyle}>{char}</div>;
  }
);

export default function WordClock() {
  const time = useClockTime();
  const activeIndices = getActiveIndices(time);

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {WORD_GRID.flatMap((row, rIndex) =>
          row.split('').map((char, cIndex) => (
            <Letter
              key={`${rIndex}-${cIndex}`}
              char={char}
              active={activeIndices.has(`${rIndex}-${cIndex}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}


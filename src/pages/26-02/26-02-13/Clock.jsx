import React, { useEffect, useState, useMemo } from 'react';

const WordClock = () => {
  const [now, setNow] = useState(new Date());
  const [isInitialized, setIsInitialized] = useState(false);

  // 11×11 grid
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
    it: [[0, 0], [0, 1]],
    is: [[0, 3], [0, 4]],
    quarter: [[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8]],
    twenty: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5]],
    five_m: [[2, 6], [2, 7], [2, 8], [2, 9]],
    half: [[3, 0], [3, 1], [3, 2], [3, 3]],
    ten_m: [[3, 5], [3, 6], [3, 7]],
    to: [[3, 9], [3, 10]],
    past: [[4, 0], [4, 1], [4, 2], [4, 3]],
    7: [[4, 7], [4, 8], [4, 9], [4, 10], [4, 11]],
    1: [[5, 0], [5, 1], [5, 2]],
    2: [[5, 3], [5, 4], [5, 5]],
    3: [[5, 6], [5, 7], [5, 8], [5, 9], [5, 10]],
    4: [[6, 0], [6, 1], [6, 2], [6, 3]],
    5: [[6, 4], [6, 5], [6, 6], [6, 7]],
    6: [[6, 8], [6, 9], [6, 10]],
    9: [[7, 0], [7, 1], [7, 2], [7, 3]],
    12: [[7, 5], [7, 6], [7, 7], [7, 8], [7, 9], [7, 10]],
    8: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4]],
    11: [[8, 5], [8, 6], [8, 7], [8, 8], [8, 9], [8, 10]],
    10: [[9, 0], [9, 1], [9, 2]],
    oclock: [[9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8]],
  };

  useEffect(() => {
    setIsInitialized(true);
    const ticker = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(ticker);
  }, []);

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
    if (m >= 5 && m < 10)    { lightUp('five_m'); lightUp('past'); }
    else if (m >= 10 && m < 15) { lightUp('ten_m'); lightUp('past'); }
    else if (m >= 15 && m < 20) { lightUp('quarter'); lightUp('past'); }
    else if (m >= 20 && m < 25) { lightUp('twenty'); lightUp('past'); }
    else if (m >= 25 && m < 30) { lightUp('twenty'); lightUp('five_m'); lightUp('past'); }
    else if (m >= 30 && m < 35) { lightUp('half'); lightUp('past'); }
    else if (m >= 35 && m < 40) { lightUp('twenty'); lightUp('five_m'); lightUp('to'); }
    else if (m >= 40 && m < 45) { lightUp('twenty'); lightUp('to'); }
    else if (m >= 45 && m < 50) { lightUp('quarter'); lightUp('to'); }
    else if (m >= 50 && m < 55) { lightUp('ten_m'); lightUp('to'); }
    else if (m >= 55)           { lightUp('five_m'); lightUp('to'); }
    else                        { lightUp('oclock'); }

    lightUp(displayHour.toString());

    return active;
  }, [now]);

  if (!isInitialized) return null;

  return (
    <div className="clock-wrapper">
      <style>{`
        :root {
          --bg: #E89077;
          --inactive: rgba(255, 255, 255, 0.18);
          --active: #FFFFFF;
        }

        .clock-wrapper {
          background: var(--bg);
          height: 100dvh;
          width: 100dvw;
          margin: 0;
          padding: 12px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .clock-container {
          display: flex;
          flex-direction: column;
          gap: clamp(3px, 1.1vmin, 10px);
          width: 100%;
          max-width: min(92vw, 540px);
          aspect-ratio: 11 / 10;
        }

        .clock-row {
          display: flex;
          width: 100%;
          gap: clamp(2px, 0.8vmin, 6px);
        }

        .clock-char {
          font-family: 'Cinzel Decorative', cursive;
          font-weight: 700;
          color: var(--inactive);
          font-size: clamp(14px, 5.8vmin, 36px);
          letter-spacing: 0.02em;
          line-height: 1.05;
          text-align: center;
          flex: 1;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        .active-char {
          color: var(--active);
          font-weight: 900;
          text-shadow: 
            0 0 10px rgba(255,255,255,0.7),
            0 0 18px rgba(255,255,255,0.4);
          transform: scale(1.12);
        }

        @media (orientation: landscape) and (max-height: 500px) {
          .clock-container {
            max-width: 420px;
            gap: 4px;
          }
          .clock-char {
            font-size: clamp(12px, 7vmin, 24px);
          }
        }

        @media (max-width: 400px) {
          .clock-wrapper { padding: 8px; }
          .clock-container { gap: clamp(2px, 0.9vmin, 7px); }
        }
      `}</style>

      <div className="clock-container">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="clock-row">
            {row.map((char, cIdx) => (
              <span
                key={`${rIdx}-${cIdx}`}
                className={`clock-char ${activeIndices.has(`${rIdx}-${cIdx}`) ? 'active-char' : ''}`}
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
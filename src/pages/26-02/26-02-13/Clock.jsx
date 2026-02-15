import React, { useEffect, useState, useMemo } from 'react';

const WordClock = () => {
  const [now, setNow] = useState(new Date());
  const [isInitialized, setIsInitialized] = useState(false);

  // Define the grid and the associated logic classes
  const grid = [
    ['I', 'T', 'L', 'I', 'S', 'A', 'S', 'T', 'A', 'M', 'P'], // row 0
    ['A', 'C', 'Q', 'U', 'A', 'R', 'T', 'E', 'R', 'D', 'C'], // row 1
    ['T', 'W', 'E', 'N', 'T', 'Y', 'F', 'I', 'V', 'E', 'X'], // row 2
    ['H', 'A', 'L', 'F', 'S', 'T', 'E', 'N', 'F', 'T', 'O'], // row 3
    ['P', 'A', 'S', 'T', 'E', 'R', 'U', 'S', 'E', 'V', 'E', 'N'], // row 4 (Past / 7)
    ['O', 'N', 'E', 'T', 'W', 'O', 'T', 'H', 'R', 'E', 'E'], // row 5
    ['F', 'O', 'U', 'R', 'F', 'I', 'V', 'E', 'S', 'I', 'X'], // row 6
    ['N', 'I', 'N', 'E', 'K', 'T', 'W', 'E', 'L', 'V', 'E'], // row 7
    ['E', 'I', 'G', 'H', 'T', 'E', 'L', 'E', 'V', 'E', 'N'], // row 8
    ['T', 'E', 'N', 'O', 'C', 'L', 'O', 'C', 'K', 'S', 'X']  // row 9
  ];

  // Map coordinates to specific logical words
  const mapping = {
    it: [[0, 0], [0, 1]],
    is: [[0, 3], [0, 4]],
    quarter: [[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8]],
    twenty: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5]],
    five_m: [[2, 6], [2, 7], [2, 8], [2, 9]], // minutes five
    half: [[3, 0], [3, 1], [3, 2], [3, 3]],
    ten_m: [[3, 5], [3, 6], [3, 7]], // minutes ten
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
    oclock: [[9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8]]
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

    // Helper to add coords to set
    const lightUp = (key) => mapping[key]?.forEach(coord => active.add(`${coord[0]}-${coord[1]}`));

    lightUp('it');
    lightUp('is');

    let displayHour = h % 12 || 12;
    if (m >= 35) displayHour = (h + 1) % 12 || 12;

    // Minute Logic
    if (m >= 5 && m < 10) { lightUp('five_m'); lightUp('past'); }
    else if (m >= 10 && m < 15) { lightUp('ten_m'); lightUp('past'); }
    else if (m >= 15 && m < 20) { lightUp('quarter'); lightUp('past'); }
    else if (m >= 20 && m < 25) { lightUp('twenty'); lightUp('past'); }
    else if (m >= 25 && m < 30) { lightUp('twenty'); lightUp('five_m'); lightUp('past'); }
    else if (m >= 30 && m < 35) { lightUp('half'); lightUp('past'); }
    else if (m >= 35 && m < 40) { lightUp('twenty'); lightUp('five_m'); lightUp('to'); }
    else if (m >= 40 && m < 45) { lightUp('twenty'); lightUp('to'); }
    else if (m >= 45 && m < 50) { lightUp('quarter'); lightUp('to'); }
    else if (m >= 50 && m < 55) { lightUp('ten_m'); lightUp('to'); }
    else if (m >= 55) { lightUp('five_m'); lightUp('to'); }
    else { lightUp('oclock'); }

    lightUp(displayHour.toString());
    return active;
  }, [now]);

  if (!isInitialized) return null;

  return (
    <div className="clock-wrapper">
      <style>{`
        .clock-wrapper {
          background-color: #E89077;
          min-height: 100dvh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .clock-container {
          display: flex;
          flex-direction: column;
          gap: clamp(4px, 1vh, 10px);
          width: 100%;
          max-width: 500px;
        }

        .clock-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .clock-char {
          font-family: 'Cinzel Decorative', cursive;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.15);
          font-size: clamp(12px, 4.5vw, 28px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
          text-align: center;
          user-select: none;
        }

        .active-char {
          color: #FFFFFF;
          font-weight: 900;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.6), 
                       0 0 20px rgba(255, 255, 255, 0.3);
          transform: scale(1.15);
        }

        @media (orientation: landscape) and (max-height: 500px) {
          .clock-container { max-width: 400px; gap: 2px; }
          .clock-char { font-size: clamp(10px, 6vh, 20px); }
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
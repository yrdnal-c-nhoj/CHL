import React, { useEffect, useState } from "react";
import blackImg from "./tile1.jpg"; // "1" squares
import pinkImg from "./tile2.jpg";  // "0" squares

const GRID_SIZE = 5;
const DIGIT_GAP = 3; // px between digits
const CELL_GAP = 1;  // px between grid cells

// Digit patterns
const DIGITS = {
  "0": Array(GRID_SIZE).fill(0).map((_, r) => Array(GRID_SIZE).fill(0).map((_, c) => r === 0 || r === GRID_SIZE-1 || c === 0 || c === GRID_SIZE-1 ? 1 : 0)),
  "1": Array(GRID_SIZE).fill(0).map((_, r) => Array(GRID_SIZE).fill(0).map((_, c) => c === Math.floor(GRID_SIZE/2) ? 1 : 0)),
  "2": Array(GRID_SIZE).fill(0).map((_, r) => Array(GRID_SIZE).fill(0).map((_, c) => r === 0 || r === Math.floor(GRID_SIZE/2) || r === GRID_SIZE-1 || (r<Math.floor(GRID_SIZE/2)&&c===GRID_SIZE-1) || (r>Math.floor(GRID_SIZE/2)&&c===0) ? 1 : 0)),
  "3": Array(GRID_SIZE).fill(0).map((_, r) => Array(GRID_SIZE).fill(0).map((_, c) => r===0 || r===Math.floor(GRID_SIZE/2) || r===GRID_SIZE-1 || c===GRID_SIZE-1 ? 1 : 0)),
  "4": Array(GRID_SIZE).fill(0).map((_, r) => Array(GRID_SIZE).fill(0).map((_, c) => c===GRID_SIZE-1 || r===Math.floor(GRID_SIZE/2) || (c===0&&r<Math.floor(GRID_SIZE/2)) ? 1 : 0)),
  "5": Array(GRID_SIZE).fill(0).map((_, r) => Array(GRID_SIZE).fill(0).map((_, c) => r===0 || r===Math.floor(GRID_SIZE/2) || r===GRID_SIZE-1 || (r<Math.floor(GRID_SIZE/2)&&c===0) || (r>Math.floor(GRID_SIZE/2)&&c===GRID_SIZE-1) ? 1 : 0)),
  "6": Array(GRID_SIZE).fill(0).map((_, r) => Array(GRID_SIZE).fill(0).map((_, c) => r===0 || r===Math.floor(GRID_SIZE/2) || r===GRID_SIZE-1 || c===0 || (r>Math.floor(GRID_SIZE/2)&&c===GRID_SIZE-1) ? 1 : 0)),
  "7": Array(GRID_SIZE).fill(0).map((_, r) => Array(GRID_SIZE).fill(0).map((_, c) => r === 0 || c === GRID_SIZE - 1 - r ? 1 : 0)),
  "8": Array(GRID_SIZE).fill(0).map((_, r) => Array(GRID_SIZE).fill(0).map((_, c) => r===0 || r===GRID_SIZE-1 || r===Math.floor(GRID_SIZE/2) || c===0 || c===GRID_SIZE-1 ? 1 : 0)),
  "9": Array(GRID_SIZE).fill(0).map((_, r) => Array(GRID_SIZE).fill(0).map((_, c) => r===0 || r===GRID_SIZE-1 || r===Math.floor(GRID_SIZE/2) || c===GRID_SIZE-1 || (c===0&&r<Math.floor(GRID_SIZE/2)) ? 1 : 0)),
};

export default function QuadrantClock() {
  const [time, setTime] = useState(getCurrentTime());
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const interval = setInterval(() => setTime(getCurrentTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function getCurrentTime() {
    const now = new Date();
    return {
      hours: now.getHours().toString().padStart(2, "0"),
      minutes: now.getMinutes().toString().padStart(2, "0"),
      seconds: now.getSeconds().toString().padStart(2, "0"),
    };
  }

  const digits = [...time.hours, ...time.minutes, ...time.seconds];
  const isMobile = windowSize.width <= 768;

  // Calculate digit size dynamically
  const digitSize = (() => {
    if (isMobile) {
      const pairCount = 3; // hours, minutes, seconds
      const totalGap = DIGIT_GAP * (pairCount - 1);
      const maxHeightPerPair = (windowSize.height - totalGap) / pairCount;
      const maxWidthPerDigit = (windowSize.width - DIGIT_GAP) / 2;
      return Math.floor(Math.min(maxHeightPerPair, maxWidthPerDigit));
    } else {
      const totalGap = DIGIT_GAP * (digits.length - 1);
      return Math.floor((windowSize.width - totalGap) / digits.length);
    }
  })();

  const renderDigit = (digit) => {
    const grid = DIGITS[digit] || DIGITS["0"];
    const totalCellGap = CELL_GAP * (GRID_SIZE - 1);
    const cellSize = (digitSize - totalCellGap) / GRID_SIZE;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`,
          gap: `${CELL_GAP}px`,
          width: "100%",
          height: "100%",
        }}
      >
        {grid.flat().map((val, idx) => (
          <img
            key={idx}
            src={val ? blackImg : pinkImg}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        ))}
      </div>
    );
  };

  // Helper for mobile pairs
  const renderPair = (pairDigits, offset) => (
    <div style={{ display: "flex", gap: `${DIGIT_GAP}px` }}>
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100dvh",
        gap: `${DIGIT_GAP}px`,
        backgroundColor: "#1F4E79",
        overflow: "hidden",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {isMobile
        ? <>
            {renderPair(digits.slice(0, 2), 0)}
            {renderPair(digits.slice(2, 4), 2)}
            {renderPair(digits.slice(4, 6), 4)}
          </>
        : digits.map((d, i) => (
            <div key={i} style={{ width: digitSize, height: digitSize }}>
              {renderDigit(d)}
            </div>
          ))
      }
    </div>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import blackImg from "./tile1.jpg"; // "1" squares
import pinkImg from "./tile2.jpg";  // "0" squares

const GRID_SIZE = 5;
const DIGIT_GAP = 0.5; // vh between digits
const CELL_GAP = 0.1;  // vh between grid cells
const MIN_DIGIT_SIZE = 5; // vh

// Digit patterns
const DIGITS = {
  "0": Array(GRID_SIZE).fill(0).map((_, r) => 
    Array(GRID_SIZE).fill(0).map((_, c) => 
      r === 0 || r === GRID_SIZE-1 || c === 0 || c === GRID_SIZE-1 ? 1 : 0)),
  "1": Array(GRID_SIZE).fill(0).map((_, r) => 
    Array(GRID_SIZE).fill(0).map((_, c) => 
      c === Math.floor(GRID_SIZE/2) ? 1 : 0)),
  "2": Array(GRID_SIZE).fill(0).map((_, r) => 
    Array(GRID_SIZE).fill(0).map((_, c) => 
      r === 0 || r === Math.floor(GRID_SIZE/2) || r === GRID_SIZE-1 || 
      (r < Math.floor(GRID_SIZE/2) && c === GRID_SIZE-1) || 
      (r > Math.floor(GRID_SIZE/2) && c === 0) ? 1 : 0)),
  "3": Array(GRID_SIZE).fill(0).map((_, r) => 
    Array(GRID_SIZE).fill(0).map((_, c) => 
      r === 0 || r === Math.floor(GRID_SIZE/2) || r === GRID_SIZE-1 || c === GRID_SIZE-1 ? 1 : 0)),
  "4": Array(GRID_SIZE).fill(0).map((_, r) => 
    Array(GRID_SIZE).fill(0).map((_, c) => 
      c === GRID_SIZE-1 || r === Math.floor(GRID_SIZE/2) || 
      (c === 0 && r < Math.floor(GRID_SIZE/2)) ? 1 : 0)),
  "5": Array(GRID_SIZE).fill(0).map((_, r) => 
    Array(GRID_SIZE).fill(0).map((_, c) => 
      r === 0 || r === Math.floor(GRID_SIZE/2) || r === GRID_SIZE-1 || 
      (r < Math.floor(GRID_SIZE/2) && c === 0) || 
      (r > Math.floor(GRID_SIZE/2) && c === GRID_SIZE-1) ? 1 : 0)),
  "6": Array(GRID_SIZE).fill(0).map((_, r) => 
    Array(GRID_SIZE).fill(0).map((_, c) => 
      r === 0 || r === Math.floor(GRID_SIZE/2) || r === GRID_SIZE-1 || 
      c === 0 || (r > Math.floor(GRID_SIZE/2) && c === GRID_SIZE-1) ? 1 : 0)),
  "7": Array(GRID_SIZE).fill(0).map((_, r) => 
    Array(GRID_SIZE).fill(0).map((_, c) => 
      r === 0 || c === GRID_SIZE - 1 - r ? 1 : 0)),
  "8": Array(GRID_SIZE).fill(0).map((_, r) => 
    Array(GRID_SIZE).fill(0).map((_, c) => 
      r === 0 || r === GRID_SIZE-1 || r === Math.floor(GRID_SIZE/2) || 
      c === 0 || c === GRID_SIZE-1 ? 1 : 0)),
  "9": Array(GRID_SIZE).fill(0).map((_, r) => 
    Array(GRID_SIZE).fill(0).map((_, c) => 
      r === 0 || r === GRID_SIZE-1 || r === Math.floor(GRID_SIZE/2) || 
      c === GRID_SIZE-1 || (c === 0 && r < Math.floor(GRID_SIZE/2)) ? 1 : 0)),
};

export default function QuadrantClock() {
  const [time, setTime] = useState(getCurrentTime());
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isReady, setIsReady] = useState(false);

  // Preload images
  useEffect(() => {
    let loadedAssets = 0;
    const totalAssets = 2;
    const preloadImages = [blackImg, pinkImg];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedAssets++;
        if (loadedAssets === totalAssets) setIsReady(true);
      };
    });
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(getCurrentTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle window resize
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

  // Calculate digit size
  let digitSize;
  if (isMobile) {
    const rows = 3;
    const digitsPerRow = 2;
    const totalGapHeight = DIGIT_GAP * (rows - 1);
    const maxWidth = (windowSize.width / window.innerHeight * 100) / (digitsPerRow + 0.2);
    const maxHeight = (100 - totalGapHeight) / rows;
    digitSize = Math.max(MIN_DIGIT_SIZE, Math.min(maxWidth, maxHeight));
  } else {
    const totalGapWidth = DIGIT_GAP * (digits.length - 1);
    const maxWidth = (windowSize.width / window.innerHeight * 100 - totalGapWidth) / digits.length;
    const maxHeight = 100;
    digitSize = Math.max(MIN_DIGIT_SIZE, Math.min(maxWidth, maxHeight));
  }

  const renderDigit = useCallback((digit) => {
    const grid = DIGITS[digit] || DIGITS["0"];
    const totalCellGap = CELL_GAP * (GRID_SIZE - 1);
    const cellSize = (digitSize - totalCellGap) / GRID_SIZE;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}vh)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}vh)`,
          gap: `${CELL_GAP}vh`,
          width: "100%",
          height: "100%",
        }}
      >
        {grid.flat().map((val, idx) => (
          <img
            key={idx}
            src={val ? blackImg : pinkImg}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
            onError={(e) => {
              e.target.style.backgroundColor = val ? "black" : "#FF69B4";
            }}
          />
        ))}
      </div>
    );
  }, [digitSize]);

  const renderRow = (digitSlice, offset) => (
    <div
      style={{
        display: "flex",
        gap: `${DIGIT_GAP}vh`,
        alignItems: "center",
      }}
    >
      {digitSlice.map((d, i) => (
        <div
          key={i + offset}
          style={{
            width: `${digitSize}vh`,
            height: `${digitSize}vh`,
          }}
        >
          {renderDigit(d)}
        </div>
      ))}
    </div>
  );

  if (!isReady) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100dvh",
        gap: `${DIGIT_GAP}vh`,
        backgroundColor: "#1F4E79",
        overflow: "hidden",
        flexDirection: isMobile ? "column" : "row",
        flexWrap: isMobile ? "wrap" : "nowrap",
        padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
      }}
      aria-label={`Current time: ${time.hours}${time.minutes}${time.seconds}`}
    >
      {isMobile ? (
        <>
          {renderRow(digits.slice(0, 2), 0)}
          {renderRow(digits.slice(2, 4), 2)}
          {renderRow(digits.slice(4, 6), 4)}
        </>
      ) : (
        <>
          {digits.map((d, i) => (
            <div
              key={i}
              style={{
                width: `${digitSize}vh`,
                height: `${digitSize}vh`,
              }}
            >
              {renderDigit(d)}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

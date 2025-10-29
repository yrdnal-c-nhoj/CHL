import React, { useEffect, useState, useMemo } from "react";

// Load all digit images from folders 0–9
const digitImagesFolders = {
  0: Object.values(import.meta.glob("./digits/0/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  1: Object.values(import.meta.glob("./digits/1/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  2: Object.values(import.meta.glob("./digits/2/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  3: Object.values(import.meta.glob("./digits/3/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  4: Object.values(import.meta.glob("./digits/4/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  5: Object.values(import.meta.glob("./digits/5/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  6: Object.values(import.meta.glob("./digits/6/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  7: Object.values(import.meta.glob("./digits/7/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  8: Object.values(import.meta.glob("./digits/8/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  9: Object.values(import.meta.glob("./digits/9/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
};

export default function DigitClock() {
  const [timeDigits, setTimeDigits] = useState([]);
  const [digitIndices, setDigitIndices] = useState([0, 0, 0, 0, 0, 0]);

  // Shuffle each folder once to ensure random order
  const shuffledImages = useMemo(() => {
    const result = {};
    for (let digit = 0; digit <= 9; digit++) {
      const imgs = digitImagesFolders[digit] || [];
      const shuffled = [...imgs].sort(() => Math.random() - 0.5);
      result[digit] = shuffled.map(img => img.default || img);
    }
    return result;
  }, []);

  const getTimeDigits = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    hours = hours % 12 || 12; // Convert 0 → 12
    const hDigits = [...String(hours)].map(Number);
    const mDigits = [...String(minutes).padStart(2, "0")].map(Number);
    const sDigits = [...String(seconds).padStart(2, "0")].map(Number);
    return [...hDigits, ...mDigits, ...sDigits];
  };

  useEffect(() => {
    const tick = () => {
      const newDigits = getTimeDigits();
      setTimeDigits(newDigits);

      // increment all indices every second
      setDigitIndices(prev => prev.map((idx, i) => (idx + 1) % 10));
    };

    tick(); // initial render
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const getImageForPosition = (digit, positionIndex) => {
    const folder = shuffledImages[digit];
    if (!folder || folder.length === 0) return "";
    const imageIndex = digitIndices[positionIndex] % folder.length;
    return folder[imageIndex];
  };

  // Split digits into hours, minutes, seconds
  const hoursDigits = timeDigits.slice(0, timeDigits.length - 4);
  const minutesDigits = timeDigits.slice(timeDigits.length - 4, timeDigits.length - 2);
  const secondsDigits = timeDigits.slice(timeDigits.length - 2);

  // --- Styles ---
  const container = {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#767A76FF",
    color: "#fff",
    fontFamily: "sans-serif",
    padding: "1rem",
    position: "relative",
    top: "-3vh",
  };

  const clockStyle = {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    justifyContent: "center",
  };

  const timeSection = {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    justifyContent: "center",
  };

  const imgStyle = {
    width: "20vh",
    height: "20vh",
    objectFit: "cover",
    boxShadow: "0 0 1.5vh rgba(0,0,0,0.6)",
    transition: "transform 0.5s ease-out",
  };

  return (
    <div style={container}>
      <style>{`
        @media (max-width: 768px) {
          .clock-container {
            flex-direction: column !important;
          }
        }
      `}</style>
      <div className="clock-container" style={clockStyle}>
        <div style={timeSection}>
          {hoursDigits.map((digit, idx) => (
            <img
              key={idx}
              src={getImageForPosition(digit, idx)}
              alt={`Digit ${digit}`}
              style={imgStyle}
            />
          ))}
        </div>
        <div style={timeSection}>
          {minutesDigits.map((digit, idx) => (
            <img
              key={idx + hoursDigits.length}
              src={getImageForPosition(digit, idx + hoursDigits.length)}
              alt={`Digit ${digit}`}
              style={imgStyle}
            />
          ))}
        </div>
        <div style={timeSection}>
          {secondsDigits.map((digit, idx) => (
            <img
              key={idx + hoursDigits.length + minutesDigits.length}
              src={getImageForPosition(digit, idx + hoursDigits.length + minutesDigits.length)}
              alt={`Digit ${digit}`}
              style={imgStyle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

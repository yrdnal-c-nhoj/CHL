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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [digitIndices, setDigitIndices] = useState([0, 0, 0, 0, 0, 0]); // 6 positions

  // Shuffle images once per digit
  const shuffledImages = useMemo(() => {
    const result: { [key: number]: string[] } = {};
    for (let digit = 0; digit <= 9; digit++) {
      const imgs = (digitImagesFolders[digit] || []).map((mod: any) => mod.default || mod);
      const shuffled = [...imgs].sort(() => Math.random() - 0.5);
      result[digit] = shuffled.length > 0 ? shuffled : [""];
    }
    return result;
  }, []);

  // Format time into 6 digits: [H1?, H2, M1, M2, S1, S2]
  const getTimeDigits = () => {
    const now = currentTime;
    let hours = now.getHours();
    hours = hours % 12 || 12; // 12-hour format, 0 → 12

    const hStr = String(hours).padStart(2, "0"); // Always 2 digits
    const mStr = String(now.getMinutes()).padStart(2, "0");
    const sStr = String(now.getSeconds()).padStart(2, "0");

    return [...hStr, ...mStr, ...sStr].map(Number); // [d0, d1, d2, d3, d4, d5]
  };

  const timeDigits = getTimeDigits();

  useEffect(() => {
    const tick = () => {
      setCurrentTime(new Date());

      // Cycle image index for each position based on its folder length
      setDigitIndices(prev =>
        prev.map((idx, pos) => {
          const digit = timeDigits[pos];
          const folder = shuffledImages[digit];
          return folder.length > 0 ? (idx + 1) % folder.length : 0;
        })
      );
    };

    tick(); // Immediate first render
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [shuffledImages, timeDigits]); // Re-run if timeDigits change structure (rare)

  const getImageForPosition = (digit: number, positionIndex: number) => {
    const folder = shuffledImages[digit];
    const imageIndex = digitIndices[positionIndex] % folder.length;
    return folder[imageIndex] || "";
  };

  // --- Styles ---
  const container: React.CSSProperties = {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#767A76FF",
    color: "#fff",
    fontFamily: "sans-serif",
    padding: "1rem",
  };

  const clockStyle: React.CSSProperties = {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const timeSection: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  };

  const imgStyle: React.CSSProperties = {
    width: "18vh",
    height: "18vh",
    objectFit: "cover",
    boxShadow: "0 0 1.5vh rgba(0,0,0,0.6)",
    transition: "transform 0.5s ease-out",
    borderRadius: "8px",
  };

  return (
    <div style={container}>
      <style jsx>{`
        @media (max-width: 768px) {
          .clock-container {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          img {
            width: 14vh !important;
            height: 14vh !important;
          }
        }
      `}</style>

      <div className="clock-container" style={clockStyle}>
        {/* Hours */}
        <div style={timeSection}>
          {timeDigits.slice(0, 2).map((digit, idx) => (
            <img
              key={`h${idx}`}
              src={getImageForPosition(digit, idx)}
              alt={`Hour digit ${digit}`}
              style={imgStyle}
            />
          ))}
        </div>

        <span style={{ fontSize: "6vh", fontWeight: "bold" }}>:</span>

        {/* Minutes */}
        <div style={timeSection}>
          {timeDigits.slice(2, 4).map((digit, idx) => (
            <img
              key={`m${idx}`}
              src={getImageForPosition(digit, idx + 2)}
              alt={`Minute digit ${digit}`}
              style={imgStyle}
            />
          ))}
        </div>

        <span style={{ fontSize: "6vh", fontWeight: "bold" }}>:</span>

        {/* Seconds */}
        <div style={timeSection}>
          {timeDigits.slice(4, 6).map((digit, idx) => (
            <img
              key={`s${idx}`}
              src={getImageForPosition(digit, idx + 4)}
              alt={`Second digit ${digit}`}
              style={imgStyle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
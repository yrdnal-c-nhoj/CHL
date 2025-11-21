import React, { useEffect, useState } from "react";
import font_2025_11_21 from "./cat.ttf";
import bgImg from "./eyes.webp";

export default function RotatedClockGrid() {
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 200);
    return () => clearInterval(t);
  }, []);

  const hours24 = now.getHours();
  const hoursStr = String(hours24).padStart(2, "0");
  const minsStr = String(now.getMinutes()).padStart(2, "0");
  const secsStr = String(now.getSeconds()).padStart(2, "0");
  
  const slots = [
    hoursStr[0],
    hoursStr[1],
    minsStr[0],
    minsStr[1],
    secsStr[0],
    secsStr[1],
  ];

  const digitSize = 8; // in vh
  const gap = 1; // in vh - gap between all digits
  const FONT_FAMILY = "ClockFont_2025_11_21";
  
  const fontFaceCSS = `@font-face{font-family: '${FONT_FAMILY}'; src: url('${font_2025_11_21}'); font-weight:400; font-style:normal; font-display:swap;}`;

  // Create enough rows to fill viewport vertically and extend beyond
  const rowsNeeded = Math.ceil(100 / (digitSize + gap)) + 4;
  
  // For horizontal, we need enough clocks to fill the width
  // Each clock is 6 digits wide, offset by 3 digits
  const clocksPerRow = Math.ceil(100 / ((digitSize + gap) * 3)) + 4;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: fontFaceCSS }} />
      
      {/* Main grid container */}
      <div
        style={{
          transform: "rotate(17deg)",
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, ${digitSize}vh)`,
          gridAutoRows: `${digitSize}vh`,
          gap: `${gap}vh`,
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {/* Generate rows */}
        {Array.from({ length: rowsNeeded }).map((_, rowIndex) => {
          // Each row starts offset by 3 digits (half a clock) from the previous
          const startOffset = (rowIndex * 3) % 6;
          
          return Array.from({ length: clocksPerRow }).map((_, clockIndex) => {
            // Generate digits for this row
            return slots.map((ch, digitIndex) => {
              const globalIndex = rowIndex * clocksPerRow * 6 + clockIndex * 6 + digitIndex;
              const columnPosition = clockIndex * 6 + digitIndex + startOffset;
              
              return (
                <div
                  key={`${rowIndex}-${clockIndex}-${digitIndex}`}
                  style={{
                    gridRow: rowIndex + 1,
                    gridColumn: columnPosition + 1,
                    height: `${digitSize}vh`,
                    width: `${digitSize}vh`,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "0.35vh solid rgba(255,255,255,0.06)",
                    borderRadius: "0.8vh",
                    fontFamily: FONT_FAMILY + ", monospace",
                    fontSize: `12vh`,
                    lineHeight: 1,
                    letterSpacing: "0.2vh",
                    color: "#0B22F2FF",
                    textAlign: "center",
                    userSelect: "none",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                  }}
                >
                  {ch}
                </div>
              );
            });
          });
        })}
      </div>
    </div>
  );
}
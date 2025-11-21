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
  const secs = now.getSeconds();
  
  const slots = [
    hoursStr[0],
    hoursStr[1],
    minsStr[0],
    minsStr[1],
    secsStr[0],
    secsStr[1],
  ];

  const digitSize = 8; // in vh
  const gap = 1; // in vh
  // Extra buffer: how many clock-columns to add to the left, and how many rows above
  const extraLeft = 6; // increase to show more clocks off the left edge
  const extraTop = 5; // increase to show more clocks above the top edge
  const FONT_FAMILY = "ClockFont_2025_11_21";

  // 20-color palette provided by user
  const COLORS = [
    "#8B4513",
    "#A0522D",
    "#D2691E",
    "#CD853F",
    "#DEB887",
    "#945F1AFF",
    "#DAA520",
    "#A39F5DFF",
    "#808000",
    "#556B2F",
    "#584703FF",
    "#3CB371",
    "#8FBC8F",
    "#708090",
    "#4682B4",
    "#6495ED",
    "#1E90FF",
    "#00BFFF",
    "#5C82F4FF",
    "#765205FF",
  ];

  // colors for each digit cell; will be regenerated every second
  const totalCells = (Math.ceil(100 / (digitSize + gap)) + 4 + extraTop) * (Math.ceil(100 / ((digitSize + gap) * 3)) + 4 + extraLeft) * 6;
  const randIndex = () => Math.floor(Math.random() * COLORS.length);
  const [digitColors, setDigitColors] = useState(() =>
    Array.from({ length: totalCells }, () => randIndex())
  );

  // Regenerate colors when the second changes so colors update in sync with the clock
  useEffect(() => {
    setDigitColors(Array.from({ length: totalCells }, () => randIndex()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secs]);
  
  const fontFaceCSS = `@font-face{font-family: '${FONT_FAMILY}'; src: url('${font_2025_11_21}'); font-weight:400; font-style:normal; font-display:swap;}`;

  const rowsNeeded = Math.ceil(100 / (digitSize + gap)) + 4 + extraTop;
  const clocksPerRow = Math.ceil(100 / ((digitSize + gap) * 3)) + 4 + extraLeft;

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Background image with filter applied only to this layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "right",
          /* Apply only saturation to the background so the clock stays unaffected */
          filter: "saturate(2)",
          zIndex: 0,
        }}
      />

      {/* Load the font */}
      <style dangerouslySetInnerHTML={{ __html: fontFaceCSS }} />
      
      {/* Main grid of digits, no filter applied */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          transform: `rotate(-10deg) translate(-${(digitSize + gap) * extraLeft}vh, -${(digitSize + gap) * extraTop}vh)`,
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, ${digitSize}vh)`,
          gridAutoRows: `${digitSize}vh`,
          gap: `${gap}vh`,
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {Array.from({ length: rowsNeeded }).map((_, rowIndex) => {
          const startOffset = (rowIndex * 3) % 6;
          return Array.from({ length: clocksPerRow }).map((_, clockIndex) =>
            slots.map((ch, digitIndex) => {
              const columnPosition = clockIndex * 6 + digitIndex + startOffset;
              const globalIndex = rowIndex * clocksPerRow * 6 + clockIndex * 6 + digitIndex;
              const color = COLORS[digitColors[globalIndex % digitColors.length]];

              return (
                <div
                  key={`${rowIndex}-${clockIndex}-${digitIndex}`}
                  style={{
                    gridRow: rowIndex + 1,
                    gridColumn: columnPosition + 1,
                    height: `${digitSize}vh`,
                    width: `${digitSize}vh`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.8vh",
                    fontFamily: FONT_FAMILY + ", monospace",
                    fontSize: `12vh`,
                    lineHeight: 1,
                    letterSpacing: "0.2vh",
                    color,
                    opacity: 0.9,
                    textAlign: "center",
                    userSelect: "none",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                  }}
                >
                  {ch}
                </div>
              );
            })
          );
        })}
      </div>
    </div>
  );
}

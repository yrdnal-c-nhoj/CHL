// pages/25-09-09/clock.jsx
import React, { useEffect, useRef, useState } from "react";
import font250909 from "./van.ttf";
import bgImage from "./skull.jpg"; // 👈 background image in the same folder

const CONFIG = {
  font: `f${font250909}`,
  fontUrl: font250909,
  fontSize: "0.8rem",
  digitWidth: "0.3rem",
  digitHeight: "0.2rem",
  digitGap: "0.3rem",
  clockPadding: "0.1rem 0.1rem",
  symbolWidth: "0.1rem",
  viewportBackground: "rgba(0, 0, 0, 0.05)",
  gridGap: "1rem",
};

export default function ClockWall() {
  const [, setTick] = useState(0);
  const rafRef = useRef(null);
  const [grid, setGrid] = useState({ rows: 1, cols: 1 });

  useEffect(() => {
    const tick = () => {
      setTick((t) => t + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const calcGrid = () => {
      const clockCharCount = "00:00:00.00".length;
      const clockWidth =
        parseFloat(CONFIG.digitWidth) * clockCharCount +
        parseFloat(CONFIG.digitGap) * (clockCharCount - 1) +
        40;

      const clockHeight = parseFloat(CONFIG.digitHeight) + 40;

      const cols = Math.ceil(window.innerWidth / clockWidth) + 2;
      const rows = Math.ceil(window.innerHeight / clockHeight) + 2;

      setGrid({ rows, cols });
    };

    calcGrid();
    window.addEventListener("resize", calcGrid);
    return () => window.removeEventListener("resize", calcGrid);
  }, []);

  const now = new Date();
  const pad = (num, length = 2) => String(num).padStart(length, "0");
  const hours = pad(now.getHours(), 2);
  const minutes = pad(now.getMinutes(), 2);
  const seconds = pad(now.getSeconds(), 2);
  const ms = pad(Math.floor(now.getMilliseconds() / 10), 2);
  const timeStr = `${hours}:${minutes}:${seconds}.${ms}`;

  const digitBoxStyle = {
    fontFamily: `"${CONFIG.font}"`,
    fontSize: CONFIG.fontSize,
    width: CONFIG.digitWidth,
    height: CONFIG.digitHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: CONFIG.digitBackground,
    borderRadius: "0.2rem",
    userSelect: "none",
  };

  const symbolBoxStyle = {
    ...digitBoxStyle,
    width: CONFIG.symbolWidth,
    background: "transparent",
  };

  const renderClock = (key) => (
    <div
      key={key}
      style={{
        display: "flex",
        gap: CONFIG.digitGap,
        background: CONFIG.clockBackground,
        borderRadius: "0.5rem",
        padding: CONFIG.clockPadding,
      }}
    >
      {timeStr.split("").map((char, i) => (
        <div
          key={i}
          style={char === ":" || char === "." ? symbolBoxStyle : digitBoxStyle}
        >
          {char}
        </div>
      ))}
    </div>
  );

  const clocks = [];
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      clocks.push(renderClock(`${r}-${c}`));
    }
  }

  const containerStyle = {
    position: "relative",
    height: "100dvh",
    width: "100vw",
    overflow: "hidden",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const gridStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    display: "grid",
    gridTemplateColumns: `repeat(${grid.cols}, auto)`,
    gridTemplateRows: `repeat(${grid.rows}, auto)`,
    gap: CONFIG.gridGap,
    transform: "translate(-50%, -50%)",
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @font-face {
          font-family: "${CONFIG.font}";
          src: url(${CONFIG.fontUrl}) format("truetype");
        }
      `}</style>
      <div style={gridStyle}>{clocks}</div>
    </div>
  );
}

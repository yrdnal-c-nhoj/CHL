import React, { useEffect, useRef, useState } from "react";
import font250909 from "./van.ttf";
import bgImage2 from "./skull.jpg"; // bottom layer
import bgImage from "./va.webp"; // top layer
import bgImage3 from "./cand.webp"; // new bottom-fixed layer

const CONFIG = {
  font: `f${font250909}`,
  fontUrl: font250909,
  fontSize: "1.4rem",
  digitWidth: "0.1rem",
  digitHeight: "1.2rem",
  digitGap: "0.3rem",
  clockPadding: "0.1rem 0.1rem",
  symbolWidth: "0.1rem",
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
    borderRadius: "0.2rem",
    userSelect: "none",
    opacity: "0.8",
    color: "#558A59FF",
    textShadow: "0 0 1px red",
  };

  const symbolBoxStyle = {
    ...digitBoxStyle,
    width: CONFIG.symbolWidth,
    background: "transparent",
    color: "#817F7FFF",
  };

  const renderClock = (key) => (
    <div
      key={key}
      style={{
        display: "flex",
        gap: CONFIG.digitGap,
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
    filter: "brightness(1.8) contrast(1.8)", // adjust main background
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${bgImage2})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    opacity: 0.65,
    pointerEvents: "none",
    filter: "brightness(0.9) contrast(1.9)", // adjust overlay
  };

  const bottomImageStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${bgImage3})`,
    backgroundSize: "cover",
    backgroundPosition: "center bottom",
    backgroundRepeat: "no-repeat",
    opacity: 0.4,
    pointerEvents: "none",
    filter: "brightness(1.7) contrast(0.4)", // adjust bottom layer
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
      <div style={overlayStyle}></div>
      <div style={bottomImageStyle}></div>
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

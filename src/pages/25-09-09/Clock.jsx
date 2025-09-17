import React, { useEffect, useState, memo } from "react";
import font250909 from "./van.ttf";
import bgImage2 from "./skull.jpg"; 
import bgImage from "./va.webp"; 
import bgImage3 from "./cand.webp"; 

const CONFIG = {
  font: "VanFont",
  fontUrl: font250909,
  fontSize: "1.4rem",
  digitWidth: "1.2rem",
  digitHeight: "1.4rem",
  digitGap: "0.3rem",
  clockPadding: "0.1rem 0.1rem",
  symbolWidth: "0.6rem",
  gridGap: "1rem",
};

const Digit = memo(({ char }) => {
  const style = {
    fontFamily: CONFIG.font,
    fontSize: CONFIG.fontSize,
    width: char === ":" || char === "." ? CONFIG.symbolWidth : CONFIG.digitWidth,
    height: CONFIG.digitHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.2rem",
    userSelect: "none",
    opacity: 0.8,
    color: char === ":" || char === "." ? "#817F7FFF" : "#558A59FF",
    textShadow: char === ":" || char === "." ? "none" : "0 0 1px red",
    background: "transparent",
  };
  return <div style={style}>{char}</div>;
});

const Clock = memo(({ timeStr }) => (
  <div
    style={{
      display: "flex",
      gap: CONFIG.digitGap,
      borderRadius: "0.5rem",
      padding: CONFIG.clockPadding,
    }}
  >
    {timeStr.split("").map((char, i) => (
      <Digit key={i} char={char} />
    ))}
  </div>
));

export default function ClockWall() {
  const [timeStr, setTimeStr] = useState("00:00:00.00");
  const [grid, setGrid] = useState({ rows: 1, cols: 1 });
  const [ready, setReady] = useState(false); // ✅ only show page when true

  // Load font
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(CONFIG.font, `url(${CONFIG.fontUrl})`);
      await font.load();
      document.fonts.add(font);
    };

    // Preload images
    const loadImage = (src) =>
      new Promise((res) => {
        const img = new Image();
        img.src = src;
        img.onload = res;
      });

    const preloadAll = async () => {
      await loadFont();
      await Promise.all([loadImage(bgImage), loadImage(bgImage2), loadImage(bgImage3)]);
      setReady(true); // ✅ everything loaded
    };

    preloadAll();
  }, []);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const pad = (num, length = 2) => String(num).padStart(length, "0");
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      const ms = pad(Math.floor(now.getMilliseconds() / 10));
      setTimeStr(`${hours}:${minutes}:${seconds}.${ms}`);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Calculate grid
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

  if (!ready) return null; // ✅ nothing shows until font + images loaded

  // Render grid
  const clocks = [];
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      clocks.push(<Clock key={`${r}-${c}`} timeStr={timeStr} />);
    }
  }

  const containerStyle = {
    position: "relative",
    height: "100dvh",
    width: "100vw",
    overflow: "hidden",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "140% auto",
    backgroundPosition: "20% center",
    backgroundRepeat: "no-repeat",
    filter: "brightness(1.8) contrast(1.8)",
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
    filter: "brightness(0.9) contrast(1.9)",
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
    filter: "brightness(1.7) contrast(0.4)",
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
      <div style={gridStyle}>{clocks}</div>
    </div>
  );
}

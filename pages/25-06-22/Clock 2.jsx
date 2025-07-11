import { useEffect, useState } from "react";

const widthVW = 1;      // abstract width unit for SVG
const heightVH = 6;     // abstract height unit for SVG
const lineLenVW = 5;    // length of each horizontal bar in SVG units
const lineThickVH = 0.5; // thickness of each horizontal bar
const gapYVH = 0.5;     // vertical gap between bars

const xVW = (widthVW - lineLenVW) / 2;

function DigitSVG({ digit }) {
  const fillColor = "#7f0626"; // visible light color

  if (digit === 0) {
    return (
      <svg
        viewBox={`0 0 ${widthVW} ${heightVH}`}
        style={{ width: "100%", height: "100%" }}
        aria-label="digit zero"
        role="img"
      >
        <circle cx={widthVW / 2} cy={heightVH / 2} r={0.3} fill={fillColor} />
      </svg>
    );
  }

  const totalHeight = digit * lineThickVH + (digit - 1) * gapYVH;
  const startY = (heightVH - totalHeight) / 2;

  return (
    <svg
      viewBox={`0 0 ${widthVW} ${heightVH}`}
      style={{ width: "100%", height: "100%" }}
      aria-label={`digit ${digit}`}
      role="img"
    >
      {[...Array(digit)].map((_, i) => {
        const y = startY + i * (lineThickVH + gapYVH);
        return (
          <rect
            key={i}
            x={xVW}
            y={y}
            width={lineLenVW}
            height={lineThickVH}
            rx={0.1}
            ry={0.1}
            fill={fillColor}
          />
        );
      })}
    </svg>
  );
}

export default function ParallelLineClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  let h = time.getHours() % 12 || 12;
  const m = time.getMinutes().toString().padStart(2, "0");
  const s = time.getSeconds().toString().padStart(2, "0");

  const hStr = h.toString();

  // Body styling
  const bodyStyle = {
    margin: 0,
    backgroundColor: "#7f0626",
    backgroundImage:
      "repeating-linear-gradient(to right, #FAF7E9, #FAF7E9 0.5rem, transparent 0.5rem, transparent)",
    backgroundSize: "1rem 2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
      width: "100vw",
  };

  // Use positive gap here to space digits properly
  const clockStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    zIndex: 1,
  };

  const digitStyle = {
    width: "4rem",
    height: "36rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={bodyStyle}>
      <div style={clockStyle} aria-label="Parallel Line Clock" role="timer">
        <div style={digitStyle} aria-label="hour digit 1">
          <DigitSVG digit={parseInt(hStr[0], 10)} />
        </div>
        {hStr.length === 2 && (
          <div style={digitStyle} aria-label="hour digit 2">
            <DigitSVG digit={parseInt(hStr[1], 10)} />
          </div>
        )}
        <div style={digitStyle} aria-label="minute digit 1">
          <DigitSVG digit={parseInt(m[0], 10)} />
        </div>
        <div style={digitStyle} aria-label="minute digit 2">
          <DigitSVG digit={parseInt(m[1], 10)} />
        </div>
        <div style={digitStyle} aria-label="second digit 1">
          <DigitSVG digit={parseInt(s[0], 10)} />
        </div>
        <div style={digitStyle} aria-label="second digit 2">
          <DigitSVG digit={parseInt(s[1], 10)} />
        </div>
      </div>
    </div>
  );
}

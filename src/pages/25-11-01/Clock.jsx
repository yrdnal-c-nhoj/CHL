/** @jsxImportSource react */
import { useState, useEffect } from "react";
import customFont2025_11_02 from "./vp.ttf"; // 🟩 Local font in same folder

const clockSize = 50; // Diameter (used for hour hand, not viewport hands)

// --- Time Rotation Logic ---
const getHandRotation = () => {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;

  const secondsDeg = seconds * 6;
  const minutesDeg = minutes * 6 + seconds * 0.1;
  const hoursDeg = hours * 30 + minutes * 0.5;

  return { secondsDeg, minutesDeg, hoursDeg };
};

// --- Positioning Logic for OUTER Viewport Numbers ---
const getOuterNumberPosition = (hour) => {
  const adjustedHour = hour % 12;
  const degrees = adjustedHour * 30;
  const angleInRadians = degrees * (Math.PI / 180) - Math.PI / 2;

  const dirX = Math.cos(angleInRadians);
  const dirY = Math.sin(angleInRadians);

  let finalX, finalY;
  const scaleFactor = 0.8;

  if (dirX !== 0) {
    const tHorizontal = dirX > 0 ? 50 / dirX : -50 / dirX;
    const yAtHorizontal = dirY * tHorizontal;
    if (Math.abs(yAtHorizontal) <= 50) {
      finalX = dirX > 0 ? 100 : 0;
      finalY = 50 + yAtHorizontal;
      finalX = 50 + (finalX - 50) * scaleFactor;
      finalY = 50 + (finalY - 50) * scaleFactor;
    }
  }

  if (finalX === undefined && dirY !== 0) {
    const tVertical = dirY > 0 ? 50 / dirY : -50 / dirY;
    const xAtVertical = dirX * tVertical;
    if (Math.abs(xAtVertical) <= 50) {
      finalX = 50 + xAtVertical;
      finalY = dirY > 0 ? 100 : 0;
      finalX = 50 + (finalX - 50) * scaleFactor;
      finalY = 50 + (finalY - 50) * scaleFactor;
    }
  }

  if (finalX === undefined) {
    finalX = 50 + dirX * 50 * scaleFactor;
    finalY = 50 + dirY * 50 * scaleFactor;
  }

  return {
    top: `${finalY}vh`,
    left: `${finalX}vw`,
    transform: "translate(-50%, -50%)",
  };
};

// --- React Component ---
export default function AnalogClock() {
  const [rotation, setRotation] = useState(getHandRotation);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(getHandRotation());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track viewport for hand length
  useEffect(() => {
    const update = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { secondsDeg, minutesDeg, hoursDeg } = rotation;
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  // Compute hand lengths dynamically:
  // Distance from center to edge minus 5px
  const maxRadiusPx = Math.min(viewport.width, viewport.height) / 2 - 5;
  const maxRadiusVh = (maxRadiusPx / viewport.height) * 100;

  // --- Styles ---
  const containerStyle = {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100dvh",
    width: "100vw",
    backgroundColor: "#1C3405FF",
    overflow: "hidden",
    fontFamily: "'CustomFont2025_11_02', sans-serif",
  };

  const clockStyle = {
    position: "relative",
    width: `${clockSize}vh`,
    height: `${clockSize}vh`,
    borderRadius: "50%",
    zIndex: 10,
  };

  const handBaseStyle = {
    position: "absolute",
    left: "50%",
    bottom: "50%",
    transformOrigin: "bottom center",
    transform: "translateX(-50%) rotate(0deg)",
    zIndex: 10,
    borderRadius: "0.15vh",
  };

  const hourHandStyle = {
    ...handBaseStyle,
    height: `${clockSize * 0.7}vh`,
    width: `${clockSize * 0.012}vh`,
     backgroundColor: "#DBBEDDFF",
    transform: `translateX(-50%) rotate(${hoursDeg}deg)`,
    zIndex: 30,
  };

  // 🟦 Minute hand: dynamic to viewport edge (minus 5px)
  const minuteHandStyle = {
    ...handBaseStyle,
    height: `${maxRadiusVh}vh`,
    width: `${clockSize * 0.008}vh`,
    backgroundColor: "#DBBEDDFF",
    transform: `translateX(-50%) rotate(${minutesDeg}deg)`,
    zIndex: 20,
  };

  // 🟥 Second hand: dynamic to viewport edge (minus 5px)
  const secondHandStyle = {
    ...handBaseStyle,
    height: `${maxRadiusVh}vh`,
    width: `${clockSize * 0.005}vh`,
    backgroundColor: "#E58A8AFF",
    transform: `translateX(-50%) rotate(${secondsDeg}deg)`,
    zIndex: 40,
  };

  const centerDotStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: `${clockSize * 0.03}vh`,
    height: `${clockSize * 0.03}vh`,
    borderRadius: "50%",
    backgroundColor: "#333",
    transform: "translate(-50%, -50%)",
    zIndex: 50,
  };

  const outerNumberStyle = {
    position: "absolute",
    fontSize: "10vh",
    color: "#EFD3F1FF",
    zIndex: 1,
  };

  // --- Render ---
  return (
    <div style={containerStyle}>
      <style>
        {`
        @font-face {
          font-family: 'CustomFont2025_11_02';
          src: url(${customFont2025_11_02}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `}
      </style>

      {/* Viewport-edge numbers */}
      {hours.map((hour) => (
        <div
          key={`outer-${hour}`}
          style={{
            ...outerNumberStyle,
            ...getOuterNumberPosition(hour),
          }}
        >
          {hour}
        </div>
      ))}

      {/* Center clock */}
      <div style={clockStyle}>
        <div style={hourHandStyle}></div>
        <div style={minuteHandStyle}></div>
        <div style={secondHandStyle}></div>
        <div style={centerDotStyle}></div>
      </div>
    </div>
  );
}

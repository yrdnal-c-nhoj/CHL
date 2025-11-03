/** @jsxImportSource react */
import { useState, useEffect } from "react";
import customFont2025_11_02 from "./vp.ttf"; // 🟩 Local font

const clockSize = 50; // Base clock diameter in vh units (for scaling hands & center dot)

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

// Calculate outer number positions in pixels relative to viewport
const getOuterNumberPosition = (hour, viewport) => {
  const adjustedHour = hour % 12;
  const degrees = adjustedHour * 30;
  const angleInRadians = (degrees * Math.PI) / 180 - Math.PI / 2;

  const dirX = Math.cos(angleInRadians);
  const dirY = Math.sin(angleInRadians);

  const scaleFactor = 0.9;

  let finalX = 50 + dirX * 50 * scaleFactor; // in %
  let finalY = 50 + dirY * 50 * scaleFactor; // in %

  // Convert percentage to pixels
  const leftPx = (finalX / 100) * viewport.width;
  const topPx = (finalY / 100) * viewport.height;

  return {
    left: `${leftPx}px`,
    top: `${topPx}px`,
    transform: "translate(-50%, -50%)",
  };
};

export default function AnalogClock() {
  const [rotation, setRotation] = useState(getHandRotation);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update clock rotation every second
  useEffect(() => {
    const interval = setInterval(() => setRotation(getHandRotation()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Update viewport size on resize
  useEffect(() => {
    const updateViewport = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const { secondsDeg, minutesDeg, hoursDeg } = rotation;
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const maxRadiusPx = Math.min(viewport.width, viewport.height) / 2 - 10;

  // --- Styles ---
  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: "100dvh",
    backgroundColor: "#1C3405FF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: "0.15vh",
    zIndex: 10,
  };

  const hourHandStyle = {
    ...handBaseStyle,
    height: `${clockSize * 0.7}vh`,
    width: `${clockSize * 0.012}vh`,
    backgroundColor: "#DBBEDDFF",
    transform: `translateX(-50%) rotate(${hoursDeg}deg)`,
    zIndex: 30,
  };

  const minuteHandStyle = {
    ...handBaseStyle,
    height: `${maxRadiusPx}px`,
    width: `${clockSize * 0.008}vh`,
    backgroundColor: "#DBBEDDFF",
    transform: `translateX(-50%) rotate(${minutesDeg}deg)`,
    zIndex: 20,
  };

  const secondHandStyle = {
    ...handBaseStyle,
    height: `${maxRadiusPx}px`,
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
    backgroundColor: "#F1ECEDFF",
    transform: "translate(-50%, -50%)",
    zIndex: 50,
  };

  const outerNumberStyle = {
    position: "absolute",
    fontSize: "7vh",
    color: "#EFD3F1FF",
    zIndex: 1,
  };

  const rectangleStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "75%",
    height: "75%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1.5vh solid #EFD3F1FF",
    transform: "translate(-50%, -50%)",
    zIndex: 5,
    pointerEvents: "none",
  };

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

      {/* Floating rectangle */}
      <div style={rectangleStyle}></div>

      {/* Outer numbers */}
      {hours.map((hour) => (
        <div
          key={`outer-${hour}`}
          style={{
            ...outerNumberStyle,
            ...getOuterNumberPosition(hour, viewport),
          }}
        >
          {hour}
        </div>
      ))}

      {/* Clock hands */}
      <div style={clockStyle}>
        <div style={hourHandStyle}></div>
        <div style={minuteHandStyle}></div>
        <div style={secondHandStyle}></div>
        <div style={centerDotStyle}></div>
      </div>
    </div>
  );
}

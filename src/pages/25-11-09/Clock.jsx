/** @jsxImportSource react */
import React, { useEffect, useState } from "react";
import customFont20251103 from "./dia.otf"; // 🟩 Local font

export default function EdgeClockWithHands() {
  const [time, setTime] = useState(new Date());
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const numberAndHandColor = "#0C0C0BFF";

  // Inject font-face dynamically
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: 'CustomFont';
        src: url(${customFont20251103}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Continuous update for smooth hands
  useEffect(() => {
    const tick = () => {
      setTime(new Date());
      const id = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(id);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  // Track viewport size
  useEffect(() => {
    const updateSize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const centerX = viewport.width / 2;
  const centerY = viewport.height / 2;

  // Time calculations
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() % 12 + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  // Hands style
  const handStyle = (widthPx, lengthPx, color, rotation) => ({
    position: "absolute",
    width: `${widthPx}px`,
    height: `${lengthPx}px`,
    backgroundColor: color,
    transformOrigin: "50% 100%",
    top: `${centerY - lengthPx}px`,
    left: `${centerX - widthPx / 2}px`,
    transform: `rotate(${rotation}deg)`,
    borderRadius: "2px",
    zIndex: 3,
  });

  // Place numbers at edges
  const numberStyle = (num) => {
    const margin = 20; // pixels from edge
    let x, y;

    if (num === 12) {
      x = centerX;
      y = margin;
    } else if (num === 3) {
      x = viewport.width - margin;
      y = centerY;
    } else if (num === 6) {
      x = centerX;
      y = viewport.height - margin;
    } else if (num === 9) {
      x = margin;
      y = centerY;
    } else if (num === 1 || num === 2) {
      const t = num === 1 ? 0.33 : 0.67;
      x = centerX + (viewport.width - centerX - margin) * t;
      y = margin + (centerY - margin) * t;
    } else if (num === 4 || num === 5) {
      const t = num === 4 ? 0.33 : 0.67;
      x = viewport.width - margin - (viewport.width - centerX - margin) * t;
      y = centerY + (viewport.height - centerY - margin) * t;
    } else if (num === 7 || num === 8) {
      const t = num === 7 ? 0.33 : 0.67;
      x = centerX - (centerX - margin) * t;
      y = viewport.height - margin - (viewport.height - centerY - margin) * t;
    } else {
      const t = num === 11 ? 0.33 : 0.67;
      x = margin + (centerX - margin) * t;
      y = centerY - (centerY - margin) * t;
    }

    return {
      position: "absolute",
      left: `${x}px`,
      top: `${y}px`,
      transform: "translate(-50%, -50%)",
      fontSize: "14vh",
      color: numberAndHandColor,
      fontFamily: "CustomFont, Arial, sans-serif", // Use custom font
      fontWeight: "bold",
      zIndex: 2,
    };
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#CBE1DFFF",
        boxSizing: "border-box",
      }}
    >
      {viewport.width > 0 &&
        numbers.map((n) => (
          <div key={n} style={numberStyle(n)}>
            {n}
          </div>
        ))}

      {/* Clock hands */}
      <div style={handStyle(6, 100, numberAndHandColor, hourDeg)} />
      <div style={handStyle(4, 130, numberAndHandColor, minuteDeg)} />
      <div style={handStyle(2, 135, numberAndHandColor, secondDeg)} />
    </div>
  );
}

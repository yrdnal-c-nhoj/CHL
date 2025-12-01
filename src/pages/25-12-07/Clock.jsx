// DigitalClock.jsx
import React, { useState, useEffect } from "react";

// --- Local imports (same folder) ---
import bgImg from "./shark.webp";

// Import font with today's date in variable name
import clockFont_2025_12_01 from "./shark.ttf";

export default function DigitalClock() {
  const [time, setTime] = useState(() => new Date());

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Format hours, minutes, seconds with leading zeros
  const formatTime = (num) => num.toString().padStart(2, "0");
  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  // --- Inject font-face inline ---
  useEffect(() => {
    if (!document.getElementById("ClockFont_2025_12_01")) {
      const style = document.createElement("style");
      style.id = "ClockFont_2025_12_01";
      style.textContent = `
        @font-face {
          font-family: 'ClockFont_2025_12_01';
          src: url(${clockFont_2025_12_01}) format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // --- Inline styles ---
  const containerStyle = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "ClockFont_2025_12_01, sans-serif",
  };

  const timeStyle = {
    fontSize: "12vh",
    color: "#ffffff",
    letterSpacing: "1rem",
    textShadow: "0 0 1vh rgba(0,0,0,0.7)",
  };

  return (
    <div style={containerStyle}>
      <div style={timeStyle}>
        {hours}{minutes}{seconds}
      </div>
    </div>
  );
}

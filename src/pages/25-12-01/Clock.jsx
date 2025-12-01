// DigitalClock.jsx
import React, { useState, useEffect } from "react";
import bgImg from "./shark.webp";
import clockFont_2025_12_01 from "./shark.ttf";

export default function DigitalClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (num) => num.toString().padStart(2, "0");
  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  // Font injection (unchanged)
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

  const containerStyle = {
    width: "100vw",
    height: "100dvh",                  // THIS IS THE FIX
    minHeight: "100dvh",               // extra safety
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "ClockFont_2025_12_01, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  };

  const digitStyle = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: "0.6em",
    fontSize: "10vh",           // keep vh here — looks great and scales nicely
    color: "#EE4747",
    textShadow: "0 0 1vh rgba(0,0,0,0.9)",
    // Remove the huge paddingTop — that's pushing it down too far!
    // paddingTop: "45vh",   ← DELETE THIS LINE
  };

  const digits = `${hours}${minutes}${seconds}`;

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        {digits.split("").map((d, i) => (
          <div key={i} style={digitStyle}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
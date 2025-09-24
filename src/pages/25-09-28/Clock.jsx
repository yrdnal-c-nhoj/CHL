import React, { useState, useEffect } from "react";
import bgImage from "./wall.jpg";
import fontA from "./not.otf";   // First typeface
import fontB from "./not2.otf"; // Second typeface

export default function DualFontClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @font-face { font-family: "FontA"; src: url(${fontA}) format("truetype"); font-display: swap; }
      @font-face { font-family: "FontB"; src: url(${fontB}) format("truetype"); font-display: swap; }
      body { margin: 0; background: black; }
    `;
    document.head.appendChild(styleEl);

    Promise.all([
      document.fonts.load("1rem FontA"),
      document.fonts.load("1rem FontB"),
    ]).then(() => {
      const img = new Image();
      img.src = bgImage;
      img.onload = () => setReady(true);
    });

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!ready) return <div style={{ width: "100vw", height: "100dvh", background: "black" }} />;

  const hours = (time.getHours() % 12) || 12; // no leading zero
  const minutes = time.getMinutes();
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const formatDigits = (num, length = 2) => num.toString().padStart(length, "0");
  const h = hours.toString(); // remove leading zero
  const m = formatDigits(minutes);

  const isPhone = window.innerWidth < 768;

  // Single character stacked for both fonts
  const stackedChar = (char) => (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: isPhone ? "9vw" : "6rem",
        height: isPhone ? "12vw" : "5rem",
        margin: "0.001rem",
      }}
    >
      <span
        style={{
          fontFamily: "FontA, sans-serif",
          fontSize: isPhone ? "14vw" : "9rem",
          color: "#EA0C0CFF",
          position: "absolute",
        }}
      >
        {char}
      </span>
      <span
        style={{
          fontFamily: "FontB, sans-serif",
          fontSize: isPhone ? "14vw" : "9rem",
          color: "#0A90FFFF",
          position: "absolute",
        }}
      >
        {char}
      </span>
    </div>
  );

  const renderTime = () => {
    // Digits with colon and AM/PM immediately after minutes
    const timeChars = [...h, ":", ...m, ...ampm];
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {timeChars.map((char, idx) => stackedChar(char))}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {/* Clock */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {renderTime()}
      </div>
    </div>
  );
}

// DigitalClock.jsx
import React, { useState, useEffect } from "react";
import bgImg from "./eyes.jpg"; // Background image
import font2025_11_20 from "./apple.ttf"; // Font file with today's date in variable name

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Load font via FontFace
    const font = new FontFace("CustomDigital", `url(${font2025_11_20})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontLoaded(true);
    });
    
    const interval = setInterval(() => setTime(new Date()), 10); // update every 10ms
    return () => clearInterval(interval);
  }, []);

  if (!fontLoaded) return null;

  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");
  const milliseconds = String(time.getMilliseconds()).padStart(3, "0"); // e.g., 045
  const msColumns = [milliseconds[0] + milliseconds[1], milliseconds[2]]; // split into two columns

  // Example meetings array (hours 9, 12, 15)
  const meetings = [9, 12, 15];
  const isMeetingHour = meetings.includes(time.getHours());

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        fontFamily: "CustomDigital, monospace",
        color: "#00FF00",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          fontSize: "8vh",
          display: "flex",
          gap: "2vh",
          textShadow: "0.2vh 0.2vh 0.1vh #000",
        }}
      >
        <span>{hours}</span>
        <span>:</span>
        <span>{minutes}</span>
        <span>:</span>
        <span>{seconds}</span>
      </div>

      <div
        style={{
          fontSize: "5vh",
          display: "flex",
          gap: "2vh",
          marginTop: "2vh",
          textShadow: "0.2vh 0.2vh 0.1vh #000",
        }}
      >
        <span>{msColumns[0]}</span>
        <span>{msColumns[1]}</span>
      </div>

      {isMeetingHour && (
        <div
          style={{
            marginTop: "3vh",
            fontSize: "4vh",
            color: "#FF0000",
            textShadow: "0.2vh 0.2vh 0.1vh #000",
          }}
        >
          Meeting!
        </div>
      )}
    </div>
  );
}

// src/components/CustomFontMirroredClock.jsx
import React, { useState, useEffect } from "react";
import todayFont251125 from "./digi.ttf";
import bgFront from "./bg.webp"; // top layer
import bgBack from "./bg1.jpg";  // back layer

export default function CustomFontMirroredClock() {
  const [time, setTime] = useState(getCurrentTime());

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fontFace = `
    @font-face {
      font-family: 'TodayFont';
      src: url(${todayFont251125}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `;

  const topImageSize = "60% auto";   // front image size
  const backImageSize = "200% auto"; // back image size

  const containerStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100dvh",
    overflow: "hidden",
    backgroundImage: `url(${bgFront}), url(${bgBack})`,
    backgroundRepeat: "no-repeat, no-repeat",
    // front (center), back (10vw left)
    backgroundPosition: "center center, calc(50% - 4vw) center",
    backgroundSize: `${topImageSize}, ${backImageSize}`,
    backgroundColor: "#000",
  };

  const mirroredClockStyle = {
    fontFamily: "TodayFont, monospace",
    fontSize: "10vw",
    color: "#37FA0B92",
    textShadow: "1.5px 1px 0px #FF0011FF, -1px -1px 0px #00f, 0 0 2px #E80DE8C2",
    transform: "scaleX(-1) translateX(-1vw)",
    textAlign: "center",
    zIndex: 2,
  };

  return (
    <div style={containerStyle}>
      <style>{fontFace}</style>
      <div style={mirroredClockStyle}>{time}</div>
    </div>
  );
}

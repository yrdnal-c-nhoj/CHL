// AnalogClock.jsx
import React, { useEffect, useState } from "react";
import bgImg from "./apple.webp";        // Main background
import tileImg from  "./ap.webp";      // Tiled background
import overlayImg from "./app.webp"; // Full-cover overlay
import customFontFile from "./apple.ttf";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load custom font
  useEffect(() => {
    const font = new FontFace("CustomClockFont", `url(${customFontFile})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontLoaded(true);
    });
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    fontFamily: fontLoaded ? "CustomClockFont" : "sans-serif",
    width: "100vw",
    height: "100dvh",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  };

  const mainBgStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
      backgroundPosition: "center",
    opacity: 0.9,
     filter: "brightness(1.2) contrast(0.9) saturate(1.9) hue-rotate(-10deg)",
    zIndex: 4,
  };

  const tiledBgStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${tileImg})`,
      backgroundRepeat: "repeat",
    opacity: 0.6,
    filter: "brightness(1.1) contrast(1.2) saturate(2.5)",    
    backgroundSize: "10vh 10vh", // <- tile size
    zIndex: 3,
  };

  const overlayBgStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${overlayImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.6,
    filter: "brightness(1.5) contrast(1.8) saturate(2.0)",
    zIndex: 2,
  };

  const clockStyle = {
    position: "relative",
    zIndex: 4,
    width: "40vh",
    height: "40vh",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#E1F3DDFF",
      fontSize: "4rem",
        zIndex: 5,
    textAlign: "center",
    textShadow: "1px 1px rgba(0,0,0)",
    // Avoid flash of unstyled text: hide until font is loaded
    opacity: fontLoaded ? 1 : 0,
    transition: "opacity 120ms linear",
    pointerEvents: fontLoaded ? "auto" : "none",
  };

  const formatTime = (date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}${m}`;
  };

  return (
    <div style={containerStyle}>
      <div style={mainBgStyle}></div>
      <div style={tiledBgStyle}></div>
      <div style={overlayBgStyle}></div>
      <div style={clockStyle}>{formatTime(time)}</div>
    </div>
  );
}

// src/components/DigitalClock.jsx
import { useState, useEffect } from "react";
import backgroundImage from "./gob.jpg"; 
import clockFontFile from "./gob.ttf";   

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load font
  useEffect(() => {
    const font = new FontFace("ClockFontScoped", `url(${clockFontFile})`);
    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontLoaded(true);
      })
      .catch((err) => {
        console.error("Font load failed:", err);
        setFontLoaded(true); // fallback
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    const s = date.getSeconds().toString().padStart(2, "0");
    return `${h}:${m}.${s}`;
  };

  const containerStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100dvh",
    width: "100vw",
    fontFamily: "'ClockFontScoped', monospace",
    overflow: "hidden",
  };

  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "saturate(0.6) brightness(0.6)",
    zIndex: 0,
  };

  const timeStyle = {
    position: "relative",
    display: "flex",
    zIndex: 1,
    visibility: fontLoaded ? "visible" : "hidden", // hide until font ready
  };

  const goldShimmerStyle = {
    fontSize: "2.5rem",
    background: "linear-gradient(90deg, #FFD700, #FFEC00, #FFC700, #FFD700, #FFEC00)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    textShadow: `
      0 0 1px #fff,
      0 0 2px #FFD700,
      0 0 4px #FFA500,
      0 0 6px #FFD700
    `,
    width: "2.0rem",
    textAlign: "center",
    lineHeight: "1",
    boxSizing: "border-box",
    animation: "shimmer 2s infinite linear",
  };

  const separatorStyle = {
    ...goldShimmerStyle,
    width: "0.9rem",
  };

  const timeString = formatTime(time).split("");

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}></div>
      <div style={timeStyle}>
        {timeString.map((char, idx) => {
          const isSeparator = char === ":" || char === ".";
          return (
            <div key={idx} style={isSeparator ? separatorStyle : goldShimmerStyle}>
              {char}
            </div>
          );
        })}
      </div>
    </div>
  );
}

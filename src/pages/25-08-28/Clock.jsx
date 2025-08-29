// src/components/DigitalClock.jsx
import { useState, useEffect } from "react";
import backgroundImage from "./gob.jpg"; // local image
import customFont from "./gob.ttf";       // local font

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load custom font once
  useEffect(() => {
    const font = new FontFace("ClockFont", `url(${customFont})`);
    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontLoaded(true);
      })
      .catch((error) => {
        console.error("Font loading failed:", error);
        setFontLoaded(true); // fallback
      });
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Inject shimmer animation keyframes
  useEffect(() => {
    const shimmerStyle = `
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    const styleTag = document.createElement("style");
    styleTag.innerHTML = shimmerStyle;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
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
    height: "100vh",
    width: "100vw",
    fontFamily: fontLoaded ? "'ClockFont', monospace" : "monospace",
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
  };

  // Fixed-width shimmering gold style for all characters
  const goldShimmerStyle = {
    fontSize: "3rem",
    fontFamily: fontLoaded ? "'ClockFont', monospace" : "monospace",
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
    width: "2.2rem",       // FIXED width to prevent jumping
    textAlign: "center", // center inside box
    lineHeight: "1",
    boxSizing: "border-box",
    animation: "shimmer 2s infinite linear",
  };

  const timeString = formatTime(time).split("");

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}></div>
      <div style={timeStyle}>
        {timeString.map((char, idx) => (
          <div key={idx} style={goldShimmerStyle}>
            {char}
          </div>
        ))}
      </div>
    </div>
  );
}

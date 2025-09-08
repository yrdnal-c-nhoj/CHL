import React, { useEffect, useState } from "react";
import bgImage from "./wall.jpg"; // local background image
import fontFile from "./wall.ttf"; // local font file

const fontVar = "CustomFont20250908"; // custom variable name

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Inject @font-face dynamically
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: '${fontVar}';
        src: url(${fontFile}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 12-hour format, no leading zeros
  const hour24 = now.getHours();
  const hours = hour24 % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const amPm = hour24 < 12 ? "am" : "pm";

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fontVar,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background image with filter */}
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
          filter: "saturate(0.5) hue-rotate(180deg)", // example filter, adjust as needed
          zIndex: 0,
        }}
      />

      {/* Clock on top */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          lineHeight: "0.7",
          position: "relative",
          zIndex: 1, // make sure it stays above the background
        }}
      >
        <span
          style={{
            fontSize: "5rem",
            color: "#8B678BFF",
            letterSpacing: "0.1rem",
            opacity: "0.6",
          }}
        >
          {hours}:{minutes}
        </span>
        <span
          style={{
            fontSize: "5rem",
            color: "#8B678BFF",
            opacity: "0.6",
            marginTop: "0.5rem",
          }}
        >
          {amPm}
        </span>
      </div>
    </div>
  );
}

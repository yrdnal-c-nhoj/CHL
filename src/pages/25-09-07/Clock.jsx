import React, { useEffect, useState } from "react";
import bgImage from "./wall.jpg";         // local background image
import fontFile from "./wall.ttf";   // local font file

const fontVar = "CustomFont20250908";  // custom variable name

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
  const minutes = now.getMinutes();
  const amPm = hour24 < 12 ? "am" : "pm";

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: fontVar
      }}
    >
      <span
        style={{
          fontSize: "8rem",
          color: "#CECAC0FF",
          letterSpacing: "0.1rem",
          opacity: "0.4",
          lineHeight: "0.8",
          textAlign: "center"
        }}
      >
        {hours}{minutes} {amPm}
      </span>
    </div>
  );
}

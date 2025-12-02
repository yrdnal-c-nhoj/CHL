// DigitalClock.jsx
import React, { useState, useEffect, useRef } from "react";
import font_2025_12_01 from "./nono.ttf";
import backgroundImg from "./crax.jpg";

export default function DigitalClock() {
  const [now, setNow] = useState(() => new Date());
  const fontFamily = "ClockFont_2025_12_01";
  const styleId = "ClockFontStyle_2025_12_01";
  const injected = useRef(false);

  // Inject @font-face + mobile viewport fix ONCE
  useEffect(() => {
    if (injected.current) return;

    // Preload the font to avoid flash of unstyled content
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "font";
    preloadLink.href = font_2025_12_01;
    preloadLink.type = "font/ttf";
    preloadLink.crossOrigin = "anonymous";
    document.head.appendChild(preloadLink);

    const css = `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${font_2025_12_01}') format('truetype');
        font-display: swap;
      }

      /* Fix 100vh clipping on mobile browsers (2025 best practice) */
      html, body {
        height: 100%;
        height: 100dvh;
        height: -webkit-fill-available;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }

      body {
        min-height: 100dvh;
        min-height: -webkit-fill-available;
      }
    `;

    const tag = document.createElement("style");
    tag.id = styleId;
    tag.appendChild(document.createTextNode(css));
    document.head.appendChild(tag);

    injected.current = true;
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Leetspeak digit substitution
  const digitMap = {
    "0": "O",
    "1": "I",
    "2": "Z",
    "3": "E",
    "4": "h",
    "5": "S",
    "6": "g",
    "7": "L",
    "8": "B",
    "9": "g",
  };

  const sub = (str) => str.split("").map((d) => digitMap[d] || d).join("");

  const HH = sub(String(now.getHours()).padStart(2, "0"));
  const MM = sub(String(now.getMinutes()).padStart(2, "0"));
  const SS = sub(String(now.getSeconds()).padStart(2, "0"));

  const isPhone = window.innerWidth < 600;

  // STYLES
  const digitBox = {
    width: isPhone ? "22vw" : "14vw",
    height: isPhone ? "24vw" : "16vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: `'${fontFamily}', monospace`,
    fontSize: isPhone ? "24vw" : "16vw",
    color: "#071A16FF",
    // background: "rgba(0,0,0,0.4)",
    borderRadius: "8px",
    textShadow: `
  
      -1px -1px 0 #F98016FF,
      1px -1px 0 #F98016FF,
      -1px 1px 0 #F98016FF,
      1px 1px 0   #F9800FFF
    `,
    userSelect: "none",
  };


  const container = {
    width: "100vw",
    height: "100dvh",                    // This fixes the clipping!
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    margin: 0,
    padding: isPhone ? "2vh 0" : "0",
    boxSizing: "border-box",
  };

  const row = {
    display: "flex",
    flexDirection: "row",
    gap: isPhone ? "3vw" : "3vw",
    alignItems: "center",
  };

  const column = {
    display: "flex",
    flexDirection: "column",
    gap: "4vh",
    alignItems: "center",
  };

  const renderPair = (digits) => (
    <div style={{ display: "flex", gap: isPhone ? "2vw" : "1vw" }}>
      <div style={digitBox}>{digits[0]}</div>
      <div style={digitBox}>{digits[1]}</div>
    </div>
  );

  return (
    <>
      <div style={container}>
        {isPhone ? (
          <div style={column}>
            {renderPair(HH)}
            {renderPair(MM)}
            {renderPair(SS)}
          </div>
        ) : (
          <div style={row}>
            {renderPair(HH)}
            {renderPair(MM)}
            {renderPair(SS)}
          </div>
        )}
      </div>
    </>
  );
}
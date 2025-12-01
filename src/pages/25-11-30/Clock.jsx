// DigitalClock.jsx
import React, { useState, useEffect, useRef } from "react";
import font_2025_12_01 from "./nono.ttf";
import backgroundImg from "./crax.jpg";

export default function DigitalClock() {
  const [now, setNow] = useState(() => new Date());

  const fontFamily = "ClockFont_2025_12_01";
  const styleId = "ClockFontStyle_2025_12_01";
  const injected = useRef(false);

  // Inject @font-face once
  useEffect(() => {
    if (injected.current) return;
    if (document.getElementById(styleId)) {
      injected.current = true;
      return;
    }

    const css = `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${font_2025_12_01}') format('truetype');
        font-display: swap;
      }
    `;
    const tag = document.createElement("style");
    tag.id = styleId;
    tag.appendChild(document.createTextNode(css));
    document.head.appendChild(tag);
    injected.current = true;
  }, []);

  // Tick every second
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Digit substitution map
  const digitMap = {
    "0": "1",
    "1": "T",
    "2": "n",
    "3": "8",
    "4": "F",
    "5": "r",
    "6": "C",
    "7": "e",
    "8": "q",
    "9": "k",
  };
  const sub = (str) => str.split("").map((d) => digitMap[d] ?? d).join("");

  const HH = sub(String(now.getHours()).padStart(2, "0"));
  const MM = sub(String(now.getMinutes()).padStart(2, "0"));
  const SS = sub(String(now.getSeconds()).padStart(2, "0"));

  const isPhone = window.innerWidth < 600;

  // ----- STYLES -----
  const digitBox = {
    width: isPhone ? "15vw" : "10vw",
    height: isPhone ? "24vw" : "16vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily,
    fontSize: isPhone ? "18vw" : "12vw",
    color: "#180204FF",
    background: "transparent",
    border: "none",
    textShadow: "-1px -1px 0 orange, 1px -1px 0 orange, -1px 1px 0 orange, 1px 1px 0 orange, -1px 0 0 orange, 0 -1px 0 orange, 0 1px 0 orange, 1px 0 0 orange",
  };

  const colonBox = {
    width: isPhone ? "1.8vw" : "0.6vw",
    height: isPhone ? "24vw" : "16vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, sans-serif",
    fontSize: isPhone ? "18vw" : "12vw",
    color: "#1F041FFF",
    padding: 0,
    margin: 0,
  };

  const row = {
    display: "flex",
    flexDirection: "row",
    gap: isPhone ? "2vw" : "1vw",
    alignItems: "center",
    justifyContent: "center",
  };

  const column = {
    display: "flex",
    flexDirection: "column",
    gap: "1vh",
    alignItems: "center",
    justifyContent: "center",
  };

  const container = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const renderPair = (digits) => (
    <div style={{ display: "flex", gap: isPhone ? "2vw" : "1vw" }}>
      <div style={digitBox}>{digits[0]}</div>
      <div style={digitBox}>{digits[1]}</div>
    </div>
  );

  return (
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
          <div style={colonBox}>:</div>

          {renderPair(MM)}
          <div style={colonBox}>:</div>

          {renderPair(SS)}
        </div>
      )}
    </div>
  );
}

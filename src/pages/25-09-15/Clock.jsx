import React, { useEffect, useState } from "react";
import backgroundImageUrl from "./plaid.jpg";
import myFontUrl from "./plaid.ttf";

const SkewFlatClock = ({
  horizontalColors = ["#BB100AFF", "#FFFFFF", "#026033FF"],
  verticalColors = ["#BB100AFF", "#FFFFFF", "#026033FF"],
  verticalRepeats = 40,
  horizontalRepeats = 30,
}) => {
  const [time, setTime] = useState("");
  const [hue, setHue] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      hours = hours % 12 || 12; // 12-hour format
      setTime(`${hours}:${minutes}_`);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    const hueInterval = setInterval(() => {
      setHue((prev) => (prev + 1) % 360);
    }, 200);

    return () => {
      clearInterval(timeInterval);
      clearInterval(hueInterval);
    };
  }, []);

  const createTartanGrid = (colors) => {
    const rows = [];
    for (let row = 0; row < verticalRepeats; row++) {
      const rowColor = colors[row % colors.length];
      const cols = [];
      for (let col = 0; col < horizontalRepeats; col++) {
        cols.push(
          <span
            key={`${row}-${col}`}
            style={{
              display: "inline-block",
              marginRight: "0.1rem",
              color: rowColor,
              opacity: 0.65,
              fontFamily: "MyCustomFont",
            }}
          >
            {time}
          </span>
        );
      }
      rows.push(
        <div key={row} style={{ whiteSpace: "nowrap", lineHeight: "1.05" }}>
          {cols}
        </div>
      );
    }
    return rows;
  };

  const baseGridStyle = {
    fontSize: "2.6rem",
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "center",
    translate: "-50% -50%",
  };

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F3EFEFFF",
        filter: `hue-rotate(${hue}deg)`,
      }}
    >
      <style>
        {`
          @font-face {
            font-family: 'MyCustomFont';
            src: url(${myFontUrl}) format('truetype');
            font-display: swap;
          }
        `}
      </style>

      <div
        role="timer"
        aria-live="polite"
        style={{
          height: "200dvh",        // enlarged to cover rotated viewport
          width: "200vw",
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundRepeat: "repeat",
          backgroundSize: "15rem 15rem", // tile size
          transform: "rotate(-17deg)",
          transformOrigin: "center",
          position: "relative",
        }}
      >
        {/* Horizontal threads */}
        <div style={{ ...baseGridStyle, transform: "rotate(0deg)" }}>
          {createTartanGrid(horizontalColors)}
        </div>

        {/* Vertical threads */}
        <div style={{ ...baseGridStyle, transform: "rotate(90deg)" }}>
          {createTartanGrid(verticalColors)}
        </div>
      </div>
    </div>
  );
};

export default SkewFlatClock;

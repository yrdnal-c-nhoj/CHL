import React, { useEffect, useState } from "react";
import backgroundImageUrl from "./plaid.jpg"; // put your texture here

const SkewFlatClock = ({
  horizontalColors = ["#0E1A40", "#004B87", "#1A3C34"], // weft
  verticalColors = ["#F1C40F", "#FFFFFF", "#E6DBDBFF"], // warp
  verticalRepeats = 40,
  horizontalRepeats = 30,
}) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
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
              opacity: 0.85,
              textShadow: `0 0 2px ${rowColor}55`,
            }}
          >
            {time}
          </span>
        );
      }
      rows.push(
        <div
          key={row}
          style={{
            whiteSpace: "nowrap",
            lineHeight: "1.05",
          }}
        >
          {cols}
        </div>
      );
    }
    return rows;
  };

  const baseGridStyle = {
    fontSize: "2.6rem",
    fontFamily: "'Times New Roman', serif",
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "center",
    translate: "-50% -50%",
  };

  const horizontalGrids = [{ transform: "rotate(0deg)" }];
  const verticalGrids = [{ transform: "rotate(90deg)" }];

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      {/* Rotating wrapper (everything tilts 17°) */}
      <div
        role="timer"
        aria-live="polite"
        style={{
          height: "150dvh",
          width: "150vw",
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundRepeat: "repeat",     // tile background
          backgroundSize: "auto",         // natural size, or set e.g. "200px"
          transform: "rotate(-17deg)",    // tilt counterclockwise
          transformOrigin: "center",
          position: "relative",
        }}
      >
        {/* Horizontal tartan threads */}
        {horizontalGrids.map((style, index) => (
          <div key={`h-${index}`} style={{ ...baseGridStyle, ...style }}>
            {createTartanGrid(horizontalColors)}
          </div>
        ))}

        {/* Vertical tartan threads */}
        {verticalGrids.map((style, index) => (
          <div key={`v-${index}`} style={{ ...baseGridStyle, ...style }}>
            {createTartanGrid(verticalColors)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkewFlatClock;

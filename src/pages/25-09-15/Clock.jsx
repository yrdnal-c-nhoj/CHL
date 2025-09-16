import React, { useEffect, useState } from "react";

const SkewFlatClock = ({
  colors = ["#1A3C34", "#D81E05", "#004B87", "#F1C40F", "#FFFFFF", "#0E1A40"],
  stripeWidths = [2, 4, 1, 3, 0.5, 2.5],
  verticalRepeats = 50, // Restored to original for viewport coverage
  horizontalRepeats = 30, // Restored to original for viewport coverage
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
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const createTartanGrid = () => {
    const rows = [];
    for (let row = 0; row < verticalRepeats; row++) {
      const cols = [];
      for (let col = 0; col < horizontalRepeats; col++) {
        const colorIndex = (row + col) % colors.length;
        const color = colors[colorIndex];
        const width = stripeWidths[col % stripeWidths.length];
        cols.push(
          <span
            key={`${row}-${col}`}
            style={{
              display: "inline-block",
              width: `${width}rem`,
              marginRight: "0.1rem",
              color,
              textShadow: `0 0 1px ${color}88, 1px 1px 2px ${color}55`,
            }}
          >
            {time}
          </span>
        );
      }
      rows.push(
        <div key={row} style={{ whiteSpace: "nowrap", lineHeight: "5.2" }}>
          {cols}
        </div>
      );
    }
    return rows;
  };

  const baseGridStyle = {
    fontSize: "1.8rem",
    fontWeight: "bold",
    fontFamily: "'Times New Roman', serif",
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "center",
    translate: "-50% -50%",
    opacity: 0.9,
  };

  const grids = [
    { fontSize: "1.8rem", transform: "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(-2vw, -1vh)" },
    { fontSize: "1.8rem", transform: "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(2vw, 1vh)" },
    { fontSize: "3rem", opacity: 0.7, transform: "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(-2vw, -2vh)" },
    { fontSize: "3rem", opacity: 0.7, transform: "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(2vw, -2vh)" },
  ];

  const perpendicularGrids = [
    { transform: "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(-2vw, -2vh)" },
    { transform: "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(2vw, -2vh)" },
    { transform: "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(0vw, -2vh)" },
  ];

  return (
    <div
      role="timer"
      aria-live="polite"
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1A3C34",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {grids.map((style, index) => (
        <div key={index} style={{ ...baseGridStyle, ...style }}>
          {createTartanGrid()}
        </div>
      ))}
      <div style={{ transform: "rotate(90deg)", position: "absolute", top: 0, left: 0, fontSize: "3rem", opacity: 0.7 }}>
        {perpendicularGrids.map((style, index) => (
          <div key={index} style={{ ...baseGridStyle, ...style }}>
            {createTartanGrid()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkewFlatClock;
import React, { useEffect, useState } from "react";

const SkewFlatClock = () => {
  const [time, setTime] = useState("");
  const [fontVar, setFontVar] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`); // seconds removed
      setFontVar(now.toISOString().slice(0, 10).replace(/-/g, ""));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000); // still updates every second
    return () => clearInterval(interval);
  }, []);

  const tartanColors = [
    "#1A3C34", // Dark green
    "#D81E05", // Red
    "#004B87", // Navy blue
    "#F1C40F", // Yellow
    "#FFFFFF", // White
    "#0E1A40", // Dark blue
  ];

  const createTartanGrid = () => {
    const rows = [];
    const verticalRepeats = 50;
    const horizontalRepeats = 30;
    const stripeWidths = [2, 4, 1, 3, 0.5, 2.5];

    for (let row = 0; row < verticalRepeats; row++) {
      const cols = [];
      let currentWidthIndex = 0;

      for (let col = 0; col < horizontalRepeats; col++) {
        const colorIndex = (row + col) % tartanColors.length;
        const color = tartanColors[colorIndex];
        const width = stripeWidths[currentWidthIndex % stripeWidths.length];

        cols.push(
          <span
            key={`${row}-${col}`}
            style={{
              display: "inline-block",
              width: `${width}rem`,
              marginRight: "0.1rem",
              color,
              textShadow: `
                0 0 1px ${color}88,
                1px 1px 2px ${color}55
              `,
            }}
          >
            {time}
          </span>
        );

        currentWidthIndex++;
      }

      rows.push(
        <div key={row} style={{ whiteSpace: "nowrap", lineHeight: "5.2" }}>
          {cols}
        </div>
      );
    }

    return rows;
  };

  const componentId = `clock-${Math.random().toString(36).substr(2, 9)}`;

  const baseGridStyle = {
    fontSize: "1.8rem",
    fontWeight: "bold",
    fontFamily: fontVar
      ? `'CustomFont-${componentId}', 'Times New Roman', serif`
      : "'Times New Roman', serif",
    userSelect: "none",
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "center",
    translate: "-50% -50%",
    opacity: 0.9,
  };

  const createTwoGrids = () => (
    <>
      {/* Small first grid */}
      <div
        style={{
          ...baseGridStyle,
          transform:
            "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(-2vw, -1vh)",
        }}
      >
        {createTartanGrid()}
      </div>

      {/* Small second grid */}
      <div
        style={{
          ...baseGridStyle,
          transform:
            "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(2vw, 1vh)",
        }}
      >
        {createTartanGrid()}
      </div>
    </>
  );

  const createGrids = () => (
    <>
      {createTwoGrids()}

      {/* Bigger number line */}
      <div
        style={{
          ...baseGridStyle,
          fontSize: "3rem",
          opacity: 0.7,
          transform:
            "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(-2vw, -2vh)",
        }}
      >
        {createTartanGrid()}
      </div>

      {/* Extra line next to bigger-number line */}
      <div
        style={{
          ...baseGridStyle,
          fontSize: "3rem",
          opacity: 0.7,
          transform:
            "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(2vw, -2vh)",
        }}
      >
        {createTartanGrid()}
      </div>

      {/* Perpendicular overlay of bigger lines with middle line */}
      <div
        style={{
          transform: "rotate(90deg)",
          position: "absolute",
          top: 0,
          left: 0,
          fontSize: "3rem",
          opacity: 0.7,
        }}
      >
        {/* Left line */}
        <div
          style={{
            ...baseGridStyle,
            transform:
              "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(-2vw, -2vh)",
          }}
        >
          {createTartanGrid()}
        </div>

        {/* Right line */}
        <div
          style={{
            ...baseGridStyle,
            transform:
              "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(2vw, -2vh)",
          }}
        >
          {createTartanGrid()}
        </div>

        {/* Middle line */}
        <div
          style={{
            ...baseGridStyle,
            transform:
              "rotate(-15deg) skewX(-40deg) scaleY(0.25) translate(0vw, -2vh)",
          }}
        >
          {createTartanGrid()}
        </div>
      </div>
    </>
  );

  return (
    <div
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
      <style scoped>
        {fontVar &&
          `
          @font-face {
            font-family: 'CustomFont-${componentId}';
            src: url('ren.ttf') format('truetype');
            font-display: swap;
            font-style: normal;
            font-weight: normal;
          }
          `}
      </style>

      {createGrids()}
    </div>
  );
};

export default SkewFlatClock;

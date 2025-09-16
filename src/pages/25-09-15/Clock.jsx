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
    // Update the time every minute
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    // Animate hue rotation
    const hueInterval = setInterval(() => {
      setHue((prev) => (prev + 1) % 360); // increase hue by 1 degree every 50ms
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
              opacity: 0.85,
              textShadow: `0 0 2px ${rowColor}55`,
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
        background: "#000",
        filter: `hue-rotate(${hue}deg)`, // dynamic hue rotation
      }}
    >
      {/* Scoped @font-face */}
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
  style={{
    height: "150dvh",
    width: "150vw",
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundRepeat: "repeat",        // tile the image
    backgroundSize: "auto",            // keeps original image size
    backgroundPosition: "center",      // optional centering
    transform: "rotate(-17deg)",       // rotate everything together
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

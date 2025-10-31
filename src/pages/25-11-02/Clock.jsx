import React, { useEffect, useState } from "react";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Clock hands
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

  // Styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    background: "#f0f0f0",
  };

  const clockStyle = {
    position: "relative",
    height: "40vh",
    width: "40vh",
    borderRadius: "50%",
    border: "0.5vh solid #333",
    background: "#fff",
    boxShadow: "0 0 2vh rgba(0,0,0,0.2)",
  };

  const handStyle = (width, height, bgColor, deg) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: `${width}vh`,
    height: `${height}vh`,
    backgroundColor: bgColor,
    transformOrigin: "bottom center",
    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
    borderRadius: "0.25vh",
  });

  const centerDotStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "1.5vh",
    height: "1.5vh",
    backgroundColor: "#333",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
  };

  // Roman numerals
  const romanNumerals = [
    "I", "II", "III", "IV", "V", "VI",
    "VII", "VIII", "IX", "X", "XI", "XII"
  ];

  const numberStyle = (num) => {
    const clockRadius = 20; // half of clock's 40vh
    const offset = 3; // push numbers outside by 3vh
    const radius = clockRadius + offset; // total distance from center
    const angle = ((num - 3) / 12) * 2 * Math.PI; // align 12 at top
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    const rotateDeg = (angle * 180) / Math.PI; // tangent rotation

    return {
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      transform: `translate(-50%, -50%) rotate(${rotateDeg}deg)`,
      transformOrigin: "center center",
      fontSize: "3vh",
      fontWeight: "bold",
      color: "#333",
    };
  };

  return (
    <div style={containerStyle}>
      <div style={clockStyle}>
        {/* Hour hand */}
        <div style={handStyle(0.8, 12, "#333", hourDeg)} />
        {/* Minute hand */}
        <div style={handStyle(0.5, 16, "#666", minuteDeg)} />
        {/* Second hand */}
        <div style={handStyle(0.2, 18, "red", secondDeg)} />
        {/* Center dot */}
        <div style={centerDotStyle} />
        {/* Numbers */}
        {romanNumerals.map((num, i) => (
          <div key={i} style={numberStyle(i + 1)}>
            {num}
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function RockClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate rotation angles
  const seconds = time.getSeconds();
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() % 12 + minutes / 60;

  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  // Clock center and hand lengths in vh
  const clockSize = 50; // 50vh diameter
  const center = clockSize / 2;
  const handStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "bottom center",
    borderRadius: "0.5vh",
  };

  return (
    <div
      style={{
        position: "relative",
        width: `${clockSize}vh`,
        height: `${clockSize}vh`,
        borderRadius: "50%",
        border: "0.5vh solid #888",
        margin: "5vh auto",
        background:
          "linear-gradient(to bottom, #d9c9b1 0%, #c7b299 100%)", // sedimentary feel
      }}
    >
      {/* Hours Hand - Sedimentary */}
      <div
        style={{
          ...handStyles,
          width: "0.8vh",
          height: "20vh",
          background:
            "linear-gradient(to top, #c7b299 0%, #d9c9b1 50%, #c7b299 100%)",
          transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
          zIndex: 1,
        }}
      />

      {/* Minutes Hand - Composite */}
      <div
        style={{
          ...handStyles,
          width: "0.6vh",
          height: "28vh",
          background:
            "repeating-linear-gradient(45deg, #999 0%, #bbb 5%, #888 10%)",
          transform: `translate(-50%, -100%) rotate(${minDeg}deg)`,
          zIndex: 2,
        }}
      />

      {/* Seconds Hand - Igneous */}
      <div
        style={{
          ...handStyles,
          width: "0.4vh",
          height: "30vh",
          background: "linear-gradient(to top, #222 0%, #555 50%, #900 100%)",
          transform: `translate(-50%, -100%) rotate(${secDeg}deg)`,
          zIndex: 3,
        }}
      />

      {/* Center Pin */}
      <div
        style={{
          position: "absolute",
          width: "2vh",
          height: "2vh",
          backgroundColor: "#555",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 4,
        }}
      />
    </div>
  );
}

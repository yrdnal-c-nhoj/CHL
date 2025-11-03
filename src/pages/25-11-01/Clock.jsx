/** @jsxImportSource react */
import React, { useEffect, useState } from "react";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  // Continuous update for sweeping second hand
  useEffect(() => {
    const tick = () => {
      setTime(new Date());
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const radius = 25; // Clock radius in vh
  const center = radius;

  const numbers = [1, 2, 3, 4, 58, 6, 7, 8, 9, 10, 11, 12];

  // Time calculations
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() % 12 + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  const clockStyle = {
    position: "relative",
    width: `${radius * 2}vh`,
    height: `${radius * 2}vh`,
    borderRadius: "50%",
    border: "0.3vh solid black",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  // Hands pivot at the base (bottom center)
  const handStyle = (widthVh, lengthVh, color, rotation) => ({
    position: "absolute",
    width: `${widthVh}vh`,
    height: `${lengthVh}vh`,
    backgroundColor: color,
    transformOrigin: "50% 100%", // Pivot at the bottom center of the hand
    top: `${center - lengthVh}vh`, // Position base at clock center
    left: `${center - widthVh / 2}vh`, // Center horizontally
    transform: `rotate(${rotation}deg)`, // Only rotate
    borderRadius: "0.5vh",
  });

  const numberStyle = (num) => {
    const angle = (num - 3) * (Math.PI / 6); // Start at 3 o'clock
    const x = center + Math.cos(angle) * (radius - 4);
    const y = center + Math.sin(angle) * (radius - 4);
    return {
      position: "absolute",
      left: `${x}vh`,
      top: `${y}vh`,
      transform: "translate(-50%, -50%)",
      fontSize: "3vh",
      fontWeight: "bold",
    };
  };

  const lineStyle = (num) => {
    const angle = (num - 3) * (Math.PI / 6); // Same angle as numbers
    const rotation = (num - 3) * 30; // Convert to degrees for CSS rotation
    return {
      position: "absolute",
      width: `100vh`, // Long enough to extend past viewport
      height: `0.2vh`, // Thin line
      backgroundColor: "gray", // Distinct color for visibility
      transformOrigin: "0% 50%", // Rotate from left edge (center of clock)
      top: `${center}vh`, // Center vertically
      left: `${center}vh`, // Center horizontally
      transform: `rotate(${rotation}deg)`, // Rotate to align with number
    };
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={clockStyle}>
        {/* Lines */}
        {numbers.map((n) => (
          <div key={`line-${n}`} style={lineStyle(n)} />
        ))}

        {/* Numbers */}
        {numbers.map((n) => (
          <div key={n} style={numberStyle(n)}>
            {n}
          </div>
        ))}

        {/* Hands */}
        <div style={handStyle(0.8, radius * 0.5, "black", hourDeg)} />
        <div style={handStyle(0.5, radius * 0.7, "black", minuteDeg)} />
        <div style={handStyle(0.2, radius * 0.95, "red", secondDeg)} />
      </div>
    </div>
  );
}
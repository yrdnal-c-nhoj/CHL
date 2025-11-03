/** @jsxImportSource react */
import { useState, useEffect } from "react";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const clockSize = 40; // in vh
  const center = clockSize / 2;

  // --- Hand Rotations ---
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

  // --- Digit Positions (12 at top) ---
  const digits = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2; // -90° so 12 is top
    const radius = center * 0.85;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { num: i + 1, x, y };
  });

  return (
    <div
      style={{
        width: `${clockSize}vh`,
        height: `${clockSize}vh`,
        borderRadius: "50%",
        border: "0.5vh solid black",
        position: "relative",
        margin: "5vh auto",
        backgroundColor: "#fff",
      }}
    >
      {/* Hour Hand */}
      <div
        style={{
          position: "absolute",
          width: "0.5vh",
          height: `${center * 0.5}vh`,
          backgroundColor: "black",
          top: `${center - center * 0.5}vh`,
          left: `${center - 0.25}vh`,
          transformOrigin: "50% 100%",
          transform: `rotate(${hourDeg}deg)`,
        }}
      />
      {/* Minute Hand */}
      <div
        style={{
          position: "absolute",
          width: "0.3vh",
          height: `${center * 0.7}vh`,
          backgroundColor: "black",
          top: `${center - center * 0.7}vh`,
          left: `${center - 0.15}vh`,
          transformOrigin: "50% 100%",
          transform: `rotate(${minuteDeg}deg)`,
        }}
      />
      {/* Second Hand */}
      <div
        style={{
          position: "absolute",
          width: "0.2vh",
          height: `${center * 0.9}vh`,
          backgroundColor: "red",
          top: `${center - center * 0.9}vh`,
          left: `${center - 0.1}vh`,
          transformOrigin: "50% 100%",
          transform: `rotate(${secondDeg}deg)`,
        }}
      />

      {/* Digits */}
      {digits.map((d) => (
        <div
          key={d.num}
          style={{
            position: "absolute",
            left: `${d.x}vh`,
            top: `${d.y}vh`,
            transform: "translate(-50%, -50%)",
            fontSize: "3vh",
            fontWeight: "bold",
          }}
        >
          {d.num}
        </div>
      ))}

      {/* Center Circle */}
      <div
        style={{
          position: "absolute",
          width: "1.5vh",
          height: "1.5vh",
          backgroundColor: "black",
          borderRadius: "50%",
          top: `${center - 0.75}vh`,
          left: `${center - 0.75}vh`,
        }}
      />
    </div>
  );
}

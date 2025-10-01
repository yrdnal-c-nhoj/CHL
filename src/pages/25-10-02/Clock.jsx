import React, { useState, useEffect } from "react";

// Import images from the same folder
import one from "./1.png";
import two from "./12.png";
import three from "./11.png";
import four from "./10.png";
import five from "./9.png";
import six from "./8.png";
import seven from "./7.png";
import eight from "./6.png";
import nine from "./5.png";
import ten from "./4.png";
import eleven from "./3.png";
import twelve from "./2.png";

export default function ImageAnalogClock() {
  const [time, setTime] = useState(new Date());
  const [ready, setReady] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fade in after small delay
  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  const clockSize = "90vw";
  const center = { x: 50, y: 50 };
  const radius = 45;

  // Number images with individual width/height
  const numberImages = [
    { src: one, angle: 0, width: "30%", height: "30%" },
    { src: two, angle: 30, width: "20%", height: "20%" },
    { src: three, angle: 60, width: "20%", height: "20%" },
    { src: four, angle: 90, width: "20%", height: "20%" },
    { src: five, angle: 120, width: "25%", height: "25%" },
    { src: six, angle: 150, width: "24%", height: "24%" },
    { src: seven, angle: 180, width: "24%", height: "24%" },
    { src: eight, angle: 210, width: "20%", height: "20%" },
    { src: nine, angle: 240, width: "22%", height: "22%" },
    { src: ten, angle: 270, width: "24%", height: "24%" },
    { src: eleven, angle: 300, width: "21%", height: "21%" },
    { src: twelve, angle: 330, width: "21%", height: "21%" },
  ];

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  // Hand style generator (pivot from bottom, center-aligned)
  const handStyle = (width, length, color, angle) => ({
    position: "absolute",
    width: width,
    height: length,
    backgroundColor: color,
    top: "50%",
    left: "50%",
    transformOrigin: "50% 100%",
    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
    borderRadius: "0.5rem",
    pointerEvents: "none",
  });

  if (!ready) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          backgroundColor: "black",
          zIndex: 9999,
        }}
      ></div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100dvh",
        backgroundColor: "#111",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <div
        style={{
          position: "relative",
          width: clockSize,
          height: clockSize,
          backgroundColor: "#222",
          borderRadius: "50%",
          isolation: "isolate",
        }}
      >
        {/* Numbers */}
        {numberImages.map((num, idx) => {
          const angleRad = (num.angle - 90) * (Math.PI / 180);

          // Adjust radius slightly based on image size
          const widthPercent = parseFloat(num.width);
          const heightPercent = parseFloat(num.height);

          const adjustedRadiusX = radius * (1 - widthPercent / 100 / 2);
          const adjustedRadiusY = radius * (1 - heightPercent / 100 / 2);

          const x = center.x + adjustedRadiusX * Math.cos(angleRad);
          const y = center.y + adjustedRadiusY * Math.sin(angleRad);

          return (
            <img
              key={idx}
              src={num.src}
              alt={`number ${idx + 1}`}
              style={{
                position: "absolute",
                width: num.width,
                height: num.height,
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                objectFit: "contain",
              }}
            />
          );
        })}

        {/* Hands */}
        <div style={handStyle("0.8rem", "18dvh", "white", hourAngle)} />
        <div style={handStyle("0.5rem", "28dvh", "white", minuteAngle)} />
        <div style={handStyle("0.15rem", "32.5dvh", "red", secondAngle)} />

        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            width: "1.2rem",
            height: "1.2rem",
            backgroundColor: "white",
            borderRadius: "50%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
}

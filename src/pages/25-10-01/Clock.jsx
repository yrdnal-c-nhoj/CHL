import React, { useState, useEffect } from "react";

// Import number images from the same folder
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

// Import clock face background image
import clockFace from "./gears.webp";

// Import background video and fallback GIF
import backgroundVideo from "./sma.mp4";
import fallbackGif from "./sma.webp";

export default function ImageAnalogClock() {
  const [time, setTime] = useState(new Date());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  const clockSize = "90vw";
  const center = { x: 50, y: 50 };
  const radius = 45;

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

  // Fierce metallic hands
  const metallicHandStyle = (width, length, angle) => ({
    position: "absolute",
    width: width,
    height: length,
    top: "50%",
    left: "50%",
    transformOrigin: "50% 100%",
    transform: `translate(-50%, -100%) rotate(${angle}deg)`,

    background: `linear-gradient(
      135deg,
      #d4d4d4 0%,
      #b0b0b0 20%,
      #e6e6e6 50%,
      #b0b0b0 80%,
      #d4d4d4 100%
    )`,
    borderRadius: "0.5rem",
    boxShadow: `
      0 0.3rem 0.5rem rgba(0,0,0,0.6),
      inset 0 0.15rem 0.3rem rgba(255,255,255,0.8),
      inset 0 -0.15rem 0.3rem rgba(0,0,0,0.4)
    `,
    pointerEvents: "none",
    border: "0.05rem solid #999",
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
          zIndex: 99,
        }}
      ></div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        isolation: "isolate",
        backgroundColor: "#111",
      }}
    >
      {/* Background video with fallback GIF */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100vw",
          height: "100dvh",
          objectFit: "cover",
          zIndex: -2,
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
        <img
          src={fallbackGif}
          alt="Fallback background"
          style={{
            width: "100vw",
            height: "100dvh",
            objectFit: "cover",
          }}
        />
      </video>

      {/* Clock Face */}
      <div
        style={{
          position: "relative",
          width: clockSize,
          height: clockSize,
          borderRadius: "50%",
          opacity: 0.85,
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        {/* Desaturated clock face as backgroundImage */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${clockFace})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(100%)", // <-- desaturate
            zIndex: -1,
          }}
        />

        {/* Numbers */}
        {numberImages.map((num, idx) => {
          const angleRad = (num.angle - 90) * (Math.PI / 180);
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
                opacity: 0.8,
                transform: "translate(-50%, -50%)",
                objectFit: "contain",
              }}
            />
          );
        })}

        {/* Hands */}
        <div style={metallicHandStyle("0.8rem", "18dvh", hourAngle)} />
        <div style={metallicHandStyle("0.5rem", "28dvh", minuteAngle)} />
        <div style={metallicHandStyle("0.15rem", "32.5dvh", secondAngle)} />

        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            width: "1.0rem",
            height: "1.0rem",
            backgroundColor: "grey",
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

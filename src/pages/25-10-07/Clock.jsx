import React, { useState, useEffect } from "react";

// Import background video, fallback GIF, and font
import backgroundVideo from "./big.mp4";
import fallbackGif from "./big.webp";
import OctFont from "./str.ttf";

export default function ImageAnalogClock() {
  const [time, setTime] = useState(new Date());
  const [ready, setReady] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Preload custom font
  useEffect(() => {
    const font = new FontFace("Oct022025Font", `url(${OctFont})`);
    font
      .load()
      .then(() => {
        document.fonts.add(font);
        setTimeout(() => setReady(true), 200); // slight delay for smooth fade-in
      })
      .catch(() => {
        console.error("Font failed to load");
        setReady(true); // proceed even if font fails
      });
  }, []);

  const clockSize = "80%";
  const center = { x: 50, y: 50 };
  const radius = 45;

  const numbers = [
    { digit: "twelve", angle: 0 },
    { digit: "one", angle: 30 },
    { digit: "two", angle: 60 },
    { digit: "three", angle: 90 },
    { digit: "four", angle: 120 },
    { digit: "five", angle: 150 },
    { digit: "six", angle: 180 },
    { digit: "seven", angle: 210 },
    { digit: "eight", angle: 240 },
    { digit: "nine", angle: 270 },
    { digit: "ten", angle: 300 },
    { digit: "eleven", angle: 330 },
  ];

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

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
          zIndex: 1,
        }}
      />
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
      {/* Inject font-face */}
      <style>
        {`
          @font-face {
            font-family: "Oct022025Font";
            src: url(${OctFont}) format("woff2");
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      {/* Background video with fallback */}
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
          zIndex: -1,
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

      {/* Clock face */}
      <div
        style={{
          position: "relative",
          width: clockSize,
          height: clockSize,
          borderRadius: "50%",
          isolation: "isolate",
        }}
      >
        {/* Clock hands – rendered first to go behind numbers */}
        <div style={handStyle("0.01rem", "18dvh", "white", hourAngle)} />
        <div style={handStyle("0.01rem", "28dvh", "white", minuteAngle)} />
        <div style={handStyle("0.5rem", "432.5dvh", "red", secondAngle)} />

        {/* Numbers */}
        {numbers.map((num, idx) => {
          const angleRad = (num.angle - 90) * (Math.PI / 180);
          const fontSize = "3rem";
          const adjustedRadius = radius * 0.9;

          const x = center.x + adjustedRadius * Math.cos(angleRad);
          const y = center.y + adjustedRadius * Math.sin(angleRad);

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                fontFamily: "Oct022025Font, sans-serif",
                fontSize: fontSize,
                color: "white",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              {num.digit}
            </div>
          );
        })}
      </div>
    </div>
  );
}

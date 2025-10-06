import React, { useState, useEffect } from "react";

// Import number images
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

// Clock face
import clockFace from "./gears.webp";

// Background video and fallback
import backgroundVideo from "./small.mp4";
import fallbackGif from "./small.webp";

export default function ImageAnalogClock() {
  const [time, setTime] = useState(new Date());
  const [ready, setReady] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Update time smoothly
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 16);
    return () => clearInterval(interval);
  }, []);

  // Rotate face slowly
  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setRotation((prev) => (prev - 0.1) % 360);
    }, 16);
    return () => clearInterval(rotateInterval);
  }, []);

  // Preload all images before rendering
  useEffect(() => {
    const sources = [
      one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve,
      clockFace, fallbackGif
    ];

    let loaded = 0;
    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === sources.length) {
          setReady(true); // All assets loaded
        }
      };
      img.onerror = () => {
        // Even on error, count as loaded (to avoid hang)
        loaded++;
        if (loaded === sources.length) {
          setReady(true);
        }
      };
    });
  }, []);

  const clockSize = "min(80vw, 80vh)";
  const center = { x: 50, y: 50 };
  const radius = 38;

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
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

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
      #FDF8F8 0%,
      #B3B0B0 25%,
      #fff 50%,
      #939292 75%,
      #FAF7F7 100%
    )`,
    borderRadius: "0.5rem",
    boxShadow: `
      -2px -2px 0 #E2E2E1,
      2px 2px 0 #1E1E1E,
      0 0.3rem 0.5rem rgba(0,0,0,0.6),
      inset 0 0.15rem 0.3rem rgba(255,255,255,0.8),
      inset 0 -0.15rem 0.3rem rgba(0,0,0,0.4),
      0 0 8px #fff,
      0 0 12px #bbb
    `,
    pointerEvents: "none",
    border: "0.05rem solid #999",
    opacity: 1.0,
  });

  const metallicNumberStyle = (width, height) => ({
    position: "absolute",
    width: width,
    height: height,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    objectFit: "contain",
    filter: `
      grayscale(80%) 
      contrast(80%) 
      brightness(1.1)
      drop-shadow(2px 2px 0 #1E1E1E)
      drop-shadow(-2px -2px 0 #E2E2E1)
    `,
    opacity: 0.95,
  });

  // Don’t render until ready
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
      {/* Video background */}
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
          filter: "saturate(0.6) contrast(0.9) brightness(1.3)",
          zIndex: -2,
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Fallback */}
      <img
        src={fallbackGif}
        alt="Fallback background"
        style={{
          position: "absolute",
          width: "100vw",
          height: "100dvh",
          objectFit: "cover",
          zIndex: -3,
        }}
      />

      {/* Clock container */}
      <div
        style={{
          position: "relative",
          width: "min(90vw, 90vh)",
          height: "min(90vw, 90vh)",
          borderRadius: "50%",
          overflow: "visible",
          isolation: "isolate",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Rotating clock face */}
        <div
          style={{
            position: "absolute",
            width: clockSize,
            height: clockSize,
            backgroundImage: `url(${clockFace})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(95%)",
            opacity: 0.9,
            zIndex: -1,
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "50% 50%",
            transition: "transform 0.016s linear",
          }}
        />

        {/* Numbers */}
        {numberImages.map((num, idx) => {
          const angleRad = (num.angle - 90) * (Math.PI / 180);
          const x = center.x + radius * Math.cos(angleRad);
          const y = center.y + radius * Math.sin(angleRad);

          return (
            <img
              key={idx}
              src={num.src}
              alt={`number ${idx + 1}`}
              style={{
                ...metallicNumberStyle(num.width, num.height),
                left: `${x}%`,
                top: `${y}%`,
              }}
            />
          );
        })}

        {/* Hands */}
        <div style={metallicHandStyle("0.8rem", "24dvh", hourAngle)} />
        <div style={metallicHandStyle("0.5rem", "36dvh", minuteAngle)} />
        <div style={metallicHandStyle("0.15rem", "40dvh", secondAngle)} />
      </div>
    </div>
  );
}

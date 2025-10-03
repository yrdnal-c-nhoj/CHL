import React, { useState, useEffect } from "react";

// Import your 12 number images
import num1 from "./1.gif";
import num2 from "./6.webp";
import num3 from "./4.gif";
import num4 from "./10.gif";
import num5 from "./3.gif";
import num6 from "./5.webp";
import num7 from "./8.webp";
import num8 from "./12.gif";
import num9 from "./2.gif";
import num10 from "./9.gif";
import num11 from "./7.gif";
import num12 from "./11.webp";

// Import hand images
import hourHand from "./hannd.gif";
import minuteHand from "./haa.gif";
import secondHand from "./han.gif";

const numberImages = [
  num12, num1, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11
];

const AnalogClockWithImages = () => {
  const [time, setTime] = useState(new Date());
  const [ready, setReady] = useState(false);

  // Preload all images
  useEffect(() => {
    let loaded = 0;
    const allImages = [...numberImages, hourHand, minuteHand, secondHand];
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === allImages.length) setReady(true);
      };
    });
  }, []);

  // Update every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!ready) {
    return <div style={{ width: "100vw", height: "100dvh", backgroundColor: "black" }} />;
  }

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const clockFaceSize = "min(90vw, 80vh)";

  const numberStyle = (angleDeg) => {
    const radius = 40;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);
    return {
      position: "absolute",
      width: "25%",
      height: "25%",
      top: `calc(50% + ${y}%)`,
      left: `calc(50% + ${x}%)`,
      transform: "translate(-50%, -50%)",
      zIndex: 10, // numbers on top
    };
  };

  const handImageStyle = (rotationDeg, sizePercent) => ({
    position: "absolute",
    width: sizePercent,
    height: "auto",
    top: "50%",
    left: "50%",
    transformOrigin: "50% 100%",
    transform: `translate(-50%, -100%) rotate(${rotationDeg}deg)`,
    zIndex: 5, // hands below numbers
  });

  return (
    <div style={{ position: "relative", width: "100vw", height: "100dvh" }}>
      {/* Background layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to top, #737575FF, #272525FF)",
          animation: "bgBW 30s ease-in-out infinite alternate",
          zIndex: 0, // behind everything
        }}
      />

      {/* Clock layer */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: clockFaceSize,
            height: clockFaceSize,
            borderRadius: "50%",
          }}
        >
          {/* Hour hand */}
          <img
            src={hourHand}
            alt="Hour hand"
            style={handImageStyle((hours % 12) * 30 + minutes * 0.5, "5%")}
          />

          {/* Minute hand */}
          <img
            src={minuteHand}
            alt="Minute hand"
            style={handImageStyle(minutes * 6, "6%")}
          />

          {/* Second hand */}
          <img
            src={secondHand}
            alt="Second hand"
            style={handImageStyle(seconds * 6, "9%")}
          />

          {/* Numbers */}
          {Array.from({ length: 12 }).map((_, i) => (
            <img
              key={i}
              src={numberImages[i]}
              alt={`Number ${i + 1}`}
              style={numberStyle(i * 30 - 60)}
            />
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes bgBW {
            0% { filter: invert(0); }
            50% { filter: invert(1); }
            100% { filter: invert(0); }
          }
        `}
      </style>
    </div>
  );
};

export default AnalogClockWithImages;

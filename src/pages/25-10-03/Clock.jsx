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

  // Smooth time updates with requestAnimationFrame
  useEffect(() => {
    let frameId;
    const tick = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  if (!ready) {
    return <div style={{ width: "100vw", height: "100dvh", backgroundColor: "black" }} />;
  }

  const ms = time.getMilliseconds();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Smooth hand angles
  const secondAngle = (seconds + ms / 1000) * 6;
  const minuteAngle = (minutes + seconds / 60 + ms / 60000) * 6;
  const hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30;

  const clockFaceSize = "min(90vw, 90vh)";

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
      zIndex: 10,
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
    zIndex: 5,
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
          animation: "bgBW 15s ease-in-out infinite alternate",
          zIndex: 0,
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
          <img src={hourHand} alt="Hour hand" style={handImageStyle(hourAngle, "5%")} />

          {/* Minute hand */}
          <img src={minuteHand} alt="Minute hand" style={handImageStyle(minuteAngle, "6%")} />

          {/* Second hand */}
          <img src={secondHand} alt="Second hand" style={handImageStyle(secondAngle, "9%")} />

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

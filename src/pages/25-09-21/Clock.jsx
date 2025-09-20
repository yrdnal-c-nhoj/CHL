import React, { useState, useEffect } from "react";
import bgImage from "./oort.jpg";
import customFont from "./oort.ttf";

export default function AnalogClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @font-face {
        font-family: "CustomClockFont";
        src: url(${customFont}) format("truetype");
        font-display: swap;
      }

      @keyframes spinBackground {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes smoothSecond {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleEl);

    const loadFont = document.fonts.load("1rem CustomClockFont");

    const img = new Image();
    img.src = bgImage;

    Promise.all([
      loadFont,
      new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      }),
    ]).then(() => setReady(true));

    const interval = setInterval(() => setTime(new Date()), 1000); // only hour/minute update
    return () => clearInterval(interval);
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          backgroundColor: "black",
        }}
      />
    );
  }

  const minutes = time.getMinutes() + time.getSeconds() / 60;
  const hours = time.getHours() + minutes / 60;

  const minDeg = (minutes / 60) * 360;
  const hourDeg = ((hours % 12) / 12) * 360;

  const handWidth = "0.5%";

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        backgroundColor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Spinning background */}
      <div
        style={{
          position: "absolute",
          width: "150vw",
          height: "150vw",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "spinBackground 120s linear infinite",
          filter: "hue-rotate(120deg) saturate(1.2) brightness(0.9) contrast(1.1)",
        }}
      />

      {/* Clock face */}
      <div
        style={{
          position: "relative",
          width: "60vw",
          height: "60vw",
          maxHeight: "80dvh",
          borderRadius: "50%",
          // border: `${handWidth} solid white`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "CustomClockFont",
          color: "white",
          zIndex: 1,
        }}
      >
        {/* Hour hand */}
        <div
          style={{
            position: "absolute",
            width: handWidth,
            height: "20%",
            backgroundColor: "white",
            transformOrigin: "50% 100%",
            transform: `rotate(${hourDeg}deg) translateY(-50%)`,
          }}
        />
        {/* Minute hand */}
        <div
          style={{
            position: "absolute",
            width: handWidth,
            height: "30%",
            backgroundColor: "white",
            transformOrigin: "50% 100%",
            transform: `rotate(${minDeg}deg) translateY(-50%)`,
          }}
        />
        {/* Second hand (smooth continuous) */}
        <div
          style={{
            position: "absolute",
            width: handWidth,
            height: "40%",
            backgroundColor: "red",
            transformOrigin: "50% 100%",
            top: "10%",
            animation: `smoothSecond 60s linear infinite`,
            transform: `rotate(${time.getSeconds() * 6}deg) translateY(-50%)`,
          }}
        />
      </div>
    </div>
  );
}

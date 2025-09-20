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

    let animationFrameId;
    const updateTime = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(updateTime);
    };
    animationFrameId = requestAnimationFrame(updateTime);

    return () => cancelAnimationFrame(animationFrameId);
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

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() + minutes / 60;

  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360;
  const hourDeg = ((hours % 12) / 12) * 360;

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
      {/* Spinning background image */}
      <div
        style={{
          position: "absolute",
          width: "150vw",
          height: "150vw",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "spinBackground 240s linear infinite",
          filter: "hue-rotate(120deg) saturate(1.2) brightness(0.9) contrast(1.1)",
        }}
      />

      {/* Clock face */}
      <div
        style={{
          position: "relative",
          width: "80vw",
          height: "80vw",
          // maxHeight: "80dvh",
          borderRadius: "50%",
          border: "2px solid",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "CustomClockFont",
          color: "#08B0CDFF",
          zIndex: 1,
        }}
      >
        {/* Hour hand */}
        <div
          style={{
            position: "absolute",
            width: "1px",
            height: "20%",
            backgroundColor: "#0E1010FF",
            transformOrigin: "50% 100%",
            transform: `rotate(${hourDeg}deg) translateY(-50%)`,
            top: "30%",
          }}
        />
        {/* Minute hand */}
        <div
          style={{
            position: "absolute",
             width: "1px",
            height: "30%",
              backgroundColor: "#0E1010FF",
            transformOrigin: "50% 100%",
            transform: `rotate(${minDeg}deg) translateY(-50%)`,
            top: "20%",
          }}
        />
        {/* Second hand */}
        <div
          style={{
            position: "absolute",
             width: "1px",
            height: "40%",
             backgroundColor: "#0E1010FF",
            transformOrigin: "50% 100%",
            transform: `rotate(${secDeg}deg) translateY(-50%)`,
            top: "10%",
          }}
        />
      </div>
    </div>
  );
}
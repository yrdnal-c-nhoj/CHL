import React, { useEffect, useState } from "react";
import customFontUrl from "./scr.otf";
import pageBg from "./bg.webp"; // full-screen background image

const CLOCK_FONT_FAMILY = "DigitalClockFont__Scoped";

const StickyNoteClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  let hours = time.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 → 12
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Rotated background */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "140%",
          height: "140%",
          backgroundImage: `url(${pageBg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          transform: "translate(-50%, -50%) rotate(4deg)",
          zIndex: -1,
        }}
      />

      {/* Sticky Note */}
      <div
        style={{
          width: "180px",
          height: "180px",
          padding: "15px",
          transform: "rotate(-3deg) translateY(-20px)",
          backgroundColor: "#ffff99",
          boxShadow:
            "-3px 0px 6px rgba(0,0,0,0.5), 3px 0px 6px rgba(0,0,0,0.5), 0px 6px 12px rgba(0,0,0,0.8)",
          border: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <style>
          {`
            @font-face {
              font-family: '${CLOCK_FONT_FAMILY}';
              src: url(${customFontUrl}) format('opentype');
              font-weight: normal;
              font-style: normal;
            }
          `}
        </style>

        <div
          style={{
            fontFamily: CLOCK_FONT_FAMILY,
            fontSize: "2rem",
            color: "#3174E9",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          {`${hours}:${minutes} ${ampm}`}
        </div>
      </div>
    </div>
  );
};

export default StickyNoteClock;

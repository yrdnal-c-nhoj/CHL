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
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${pageBg})`,
        backgroundSize: "170%", // Zoom in on the background
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Opaque Sticky Note */}
      <div
        style={{
          width: "220px",
          height: "220px",
          padding: "15px",
          transform: "rotate(-3deg) translateY(-20px)", // Move sticky note up
          backgroundColor: "#ffff99", // solid opaque sticky note
          boxShadow:
            "5px 5px 15px rgba(0,0,0,0.3), -3px -3px 10px rgba(0,0,0,0.2)",
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
              src: url(${customFontUrl}) format('truetype');
              font-weight: normal;
              font-style: normal;
            }
          `}
        </style>

        <div
          style={{
            fontFamily: CLOCK_FONT_FAMILY,
            fontSize: "2rem",
            color: "#3174E9FF",
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
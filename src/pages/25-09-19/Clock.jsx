import React, { useState, useEffect } from "react";
import bgImage from "./oort.jpg";

export default function AnalogClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Inject CSS for spinning background + responsive clock
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @keyframes spinBackground {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .clock-face {
        position: relative;
        border-radius: 50%;
        border: 2px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0BCAF5FF;
        z-index: 1;
        width: 70vw;   /* default for laptops */
        height: 40vh;
      }

      @media (max-width: 768px) {
        .clock-face {
          width: 60vw;   /* mobile width */
          height: 90vh;  /* mobile taller height */
        }
      }
    `;
    document.head.appendChild(styleEl);

    // Preload background image
    const img = new Image();
    img.src = bgImage;
    img.onload = () => setReady(true);

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
      <div className="clock-face">
        {/* Hour hand */}
        <div
          style={{
            position: "absolute",
            width: "1px",
            height: "20%",
            backgroundColor: "#292A2BFF",
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
   backgroundColor: "#232325FF",            transformOrigin: "50% 100%",
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
            backgroundColor: "#09E3FBFF",            transformOrigin: "50% 100%",
            transform: `rotate(${secDeg}deg) translateY(-50%)`,
            top: "10%",
          }}
        />
      </div>
    </div>
  );
}

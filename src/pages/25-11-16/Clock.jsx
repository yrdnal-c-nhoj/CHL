// AnalogClock.jsx
import React, { useEffect, useRef, useCallback } from "react";
import bgImg from "./ray.webp";
import clockBg from "./ray2.webp"; // <-- Background ONLY for clock face

export default function AnalogClock() {
  const rafRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  const tick = useCallback(() => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = now.getHours() % 12 + m / 60;

    if (hourRef.current)
      hourRef.current.style.transform = `translate(-50%,-100%) rotate(${h * 30}deg)`;
    if (minuteRef.current)
      minuteRef.current.style.transform = `translate(-50%,-100%) rotate(${m * 6}deg)`;
    if (secondRef.current)
      secondRef.current.style.transform = `translate(-50%,-100%) rotate(${s * 6}deg)`;

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // Main container
  const containerStyle = {
    width: "100%",
    minHeight: "100dvh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  // Page background image
  const bgStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transform: "scaleY(-1)", // flip vertically
    zIndex: 0,
  };

  // Clock container
  const clockStyle = {
    width: "40vw",
    height: "80vh",
    position: "relative",
    background: "rgba(255,255,255,0.35)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  };

  // NEW: Inner clock face background
  const clockBackgroundStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${clockBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.05,                // <-- Your request
    filter: "brightness(0.8) contrast(4)", // <-- Also your request
    zIndex: 0,                   // Below clock hands
  };

  // Hand styles
  const handBase = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "50% 100%",
     background: "rgba(12,12,112,0.2)",
    transform: "translate(-50%,-100%)",
    borderRadius: "0.6vh",
    zIndex: 1, // above clock background
  };

  return (
    <div style={containerStyle}>
      <div style={bgStyle} aria-hidden="true" />

      <div style={clockStyle}>
        {/* NEW background image behind clock hands */}
        <div style={clockBackgroundStyle} aria-hidden="true" />

        <div
          ref={hourRef}
          style={{
            ...handBase,
            width: "0.4vh",
            height: "7vh",
           
          }}
        />
        <div
          ref={minuteRef}
          style={{
            ...handBase,
            width: "0.3vh",
            height: "13vh",
    
          }}
        />
        <div
          ref={secondRef}
          style={{
            ...handBase,
            width: "0.1vh",
            height: "98vh",
            background: "rgba(200,40,40)",
          }}
        />
      </div>
    </div>
  );
}

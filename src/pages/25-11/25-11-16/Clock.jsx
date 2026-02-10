import React, { useEffect, useRef, useCallback } from "react";
import bgImg from "../../../assets/images/25-11-16/ray.webp";
import clockBg from "../../../assets/images/25-11-16/ray2.webp";

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
    const h = (now.getHours() % 12) + m / 60;

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

  // Main container: Ensures the clock is centered and fits the screen
  const containerStyle = {
    width: "100%",
    height: "100dvh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#000",
  };

  // Page background
  const bgStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transform: "scaleY(-1)", 
    zIndex: 0,
  };

  // Clock container: Uses 'vmin' to ensure it never exceeds the screen width OR height
  const clockStyle = {
    width: "90vmin",  // 90% of the smallest screen dimension
    height: "90vmin", // Keeps it a perfect square
    position: "relative",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "50%", // Standard round clock face
    overflow: "hidden",
    zIndex: 1,
    border: "1px solid rgba(255,255,255,0.2)",
  };

  const clockBackgroundStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${clockBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.1,
    filter: "brightness(0.8) contrast(2)",
    zIndex: 0,
  };

  // Hand styles: Now using percentages so they scale WITH the clock
  const handBase = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "50% 100%",
    background: "rgba(255, 255, 255, 0.8)",
    borderRadius: "10px",
    zIndex: 2,
  };

  return (
    <div style={containerStyle}>
      <div style={bgStyle} aria-hidden="true" />

      <div style={clockStyle}>
        <div style={clockBackgroundStyle} aria-hidden="true" />
        
        {/* Center Pin */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "12px",
          height: "12px",
          background: "white",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 5
        }} />

        {/* Hour Hand */}
        <div
          ref={hourRef}
          style={{
            ...handBase,
            width: "2%",
            height: "25%",
            background: "rgba(255,255,255,0.9)",
          }}
        />
        {/* Minute Hand */}
        <div
          ref={minuteRef}
          style={{
            ...handBase,
            width: "1.5%",
            height: "40%",
            background: "rgba(255,255,255,0.7)",
          }}
        />
        {/* Second Hand */}
        <div
          ref={secondRef}
          style={{
            ...handBase,
            width: "1%",
            height: "45%",
            background: "#ff4d4d", // Brighter red for visibility
          }}
        />
      </div>
    </div>
  );
}
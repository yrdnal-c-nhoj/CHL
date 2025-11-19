// AnalogClock.jsx
import React, { useEffect, useRef, useCallback } from "react";
import bgImg from "./ray.webp";

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

  const clockDiameter = "60vh";

  // Main container
  const containerStyle = {
    width: "100%",
    minHeight: "100dvh",
    position: "relative", // IMPORTANT
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  // Background layer (now visible!)
  const bgStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transform: "scaleY(-1)", // flip vertically
    zIndex: 0,               // IMPORTANT: must be above page paint
  };

  const clockStyle = {
    width: "80vh",
    height: "80vh",
    borderRadius: "50%",
    position: "relative",
    background: "rgba(255,255,255,0.15)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,               // clock stays above background
  };

  const handBase = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "50% 100%",
    transform: "translate(-50%,-100%)",
    borderRadius: "0.6vh",
  };

  return (
    <div style={containerStyle}>
      <div style={bgStyle} aria-hidden="true" />

      <div style={clockStyle}>
        <div ref={hourRef} style={{ ...handBase, width: "0.8vh", height: "18vh", background: "rgba(12,12,12,0.6)" }} />
        <div ref={minuteRef} style={{ ...handBase, width: "0.5vh", height: "26vh", background: "rgba(18,18,18,0.6)" }} />
        <div ref={secondRef} style={{ ...handBase, width: "0.2vh", height: "28vh", background: "rgba(200,40,40,0.45)" }} />
      </div>
    </div>
  );
}

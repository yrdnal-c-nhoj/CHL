import React, { useEffect, useRef } from "react";
import treeImg from "./trees.jpg";

export default function ClockPage() {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const rafRef = useRef(null);
  const bgRef = useRef(null);
  const bgRafRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const hourAngle = (hours + minutes / 60) * 30;
      const minuteAngle = (minutes + seconds / 60) * 6;

      if (hourRef.current)
        hourRef.current.style.transform = `rotate(${hourAngle}deg) translateX(-50%)`;
      if (minuteRef.current)
        minuteRef.current.style.transform = `rotate(${minuteAngle}deg) translateX(-50%)`;

      rafRef.current = requestAnimationFrame(updateClock);
    };
    rafRef.current = requestAnimationFrame(updateClock);

    const rotateBackground = () => {
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const degrees = (seconds / 60) * 360;
      if (bgRef.current) {
        bgRef.current.style.transform = `translate(-50%, -50%) rotate(${-degrees}deg)`;
      }
      bgRafRef.current = requestAnimationFrame(rotateBackground);
    };
    rotateBackground();

    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(bgRafRef.current);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Full-viewport spinning background */}
      <div
        ref={bgRef}
        style={{
          backgroundImage: `url(${treeImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "200%",
          height: "200%",
          transformOrigin: "center",
        }}
      />

      {/* Clock container */}
      <div
        style={{
          width: "50vh",
          height: "50vh",
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Hour hand */}
        <div
          ref={hourRef}
          style={{
            position: "absolute",
            width: "0.5%",
            height: "25%",
            background: "#C2DDEDFF",
            top: "25%",
            left: "50%",
            transformOrigin: "bottom center",
            borderRadius: "1rem",
          }}
        />

        {/* Minute hand */}
        <div
          ref={minuteRef}
          style={{
            position: "absolute",
            width: "0.5%",
            height: "35%",
            background: "#C2DDEDFF",
            top: "15%",
            left: "50%",
            transformOrigin: "bottom center",
            borderRadius: "1rem",
          }}
        />
      </div>
    </div>
  );
}

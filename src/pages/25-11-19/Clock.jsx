import React, { useEffect, useState } from "react";
import riverFont_2025_11_11 from "./diag.ttf"; // your custom font file

export default function RiverClock() {
  const [side, setSide] = useState("left");
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Handle screen resizing to switch river side
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < window.innerHeight) {
        setSide("right");
      } else {
        setSide("left");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inject @font-face and keyframes to avoid leakage
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      @font-face {
        font-family: 'RiverFont';
        src: url(${riverFont_2025_11_11}) format('woff2');
      }
      @keyframes flow {
        0% { background-position-y: 0vh; }
        100% { background-position-y: -100vh; }
      }
    `;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  const styles = {
    wrapper: {
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      position: "relative",
      background: "linear-gradient(to top, #b6e2f2 0%, #eaf9ff 100%)",
    },
    river: {
      position: "absolute",
      [side]: "0",
      top: "0",
      width: "22vw",
      height: "100vh",
      background: `
        repeating-linear-gradient(
          90deg,
          rgba(0, 95, 135, 0.9) 0%,
          rgba(0, 155, 205, 0.9) 50%,
          rgba(0, 95, 135, 0.9) 100%
        )
      `,
      backgroundSize: "200% 200%",
      animation: "flow 6s linear infinite",
      clipPath: "polygon(0 0, 100% 10%, 100% 90%, 0 100%)",
      boxShadow: side === "left" 
        ? "2vw 0 4vw rgba(0,0,0,0.2)" 
        : "-2vw 0 4vw rgba(0,0,0,0.2)",
    },
    clock: {
      position: "absolute",
      top: "50%",
      left: side === "left" ? "25vw" : "55vw",
      transform: "translateY(-50%)",
      fontFamily: "RiverFont, sans-serif",
      fontSize: "10vh",
      letterSpacing: "0.5vw",
      color: "#004f6e",
      textShadow: "0 0 1vh rgba(0,0,0,0.3)",
      whiteSpace: "nowrap",
      userSelect: "none",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.river}></div>
      <div style={styles.clock}>{time}</div>
    </div>
  );
}

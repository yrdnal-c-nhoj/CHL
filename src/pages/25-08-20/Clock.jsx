import { useEffect, useState } from "react";
import myFontUrl from "./sq.ttf";

export default function FullViewportClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const digits = (() => {
    const h = now.getHours() % 12 || 12;
    const hh = String(h).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return (hh + mm).split("");
  })();

  // Inject custom font
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: 'CustomFont';
        src: url(${myFontUrl}) format('truetype');
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Calculate dimensions
  const digitCount = digits.length; // Typically 4 digits (HH:MM)
  const baseFontSize = window.innerHeight * 0.25; // Base size before scaling
  const scaleY = window.innerHeight / (baseFontSize * 0.75); // Stretch to fill height
  const digitWidth = window.innerWidth / digitCount; // Exact width per digit

  const colors = ["#FF3C38", "#FFDD00", "#00D1FF", "#00FF88"];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "flex-start", // Align digits to left edge
        alignItems: "center",
        gap: 0,
        background: "black",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        border: 0, // No borders
      }}
    >
      {digits.map((d, i) => (
        <span
          key={i}
          style={{
            fontFamily: "CustomFont",
            fontSize: `${baseFontSize}px`,
            color: colors[i % colors.length],
            lineHeight: 1,
            display: "block",
            transform: `scaleY(${scaleY})`, // Stretch to full viewport height
            width: `${digitWidth}px`, // Exact width to fill viewport
            textAlign: "center",
            flex: `0 0 ${digitWidth}px`, // Fixed width, no shrinking
            margin: 0,
            padding: 0,
            border: 0, // No borders
          }}
        >
          {d}
        </span>
      ))}
    </div>
  );
}
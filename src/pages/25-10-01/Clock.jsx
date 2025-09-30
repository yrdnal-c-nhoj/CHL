import React, { useState, useEffect } from "react";
const customFont = new URL("./bebas.ttf", import.meta.url).href;

export default function StripedClock() {
  const [time, setTime] = useState("");
  const [ready, setReady] = useState(false);
  const [offset, setOffset] = useState(0);
  const fontName = "Font093025";

  // Format current time HH:MM:SS AM/PM
  function getClockTime() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h === 0 ? 12 : h;
    return `${h.toString().padStart(2, "0")}:${m}:${s} ${ampm}`;
  }

  // Tick every second
  useEffect(() => {
    setTime(getClockTime());
    const id = setInterval(() => {
      setTime(getClockTime());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Animate stripes for optical illusion (1/10th speed)
  useEffect(() => {
    let frame;
    const animate = () => {
      setOffset((prev) => (prev + 0.005) % 100);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Inject @font-face rule and preload font
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: '${fontName}';
        src: url(${customFont}) format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    const font = new FontFace(fontName, `url(${customFont})`);
    const timeout = setTimeout(() => {
      console.warn("Font loading timed out, using fallback");
      setReady(true);
    }, 5000);

    font.load().then((loaded) => {
      document.fonts.add(loaded);
      setReady(true);
      clearTimeout(timeout);
    }).catch((error) => {
      console.error("Font loading failed:", error);
      setReady(true);
      clearTimeout(timeout);
    });

    return () => {
      document.head.removeChild(style);
      clearTimeout(timeout);
    };
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          background: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "monospace",
          fontSize: "2rem",
          textAlign: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        backgroundImage: `
          linear-gradient(
            135deg,
            black 25%,
            white 25%,
            white 50%,
            black 50%,
            black 75%,
            white 75%
          )`,
        backgroundSize: "3rem 3rem",
        backgroundPosition: `${offset}rem ${offset}rem`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontFamily: `${fontName}, monospace`,
          fontSize: "12vw",
          fontWeight: "bold",
          color: ready ? "transparent" : "white",
          background: `
            repeating-linear-gradient(
              145deg, /* Offset angle for contrast */
              white 0,
              white 1rem,
              black 1rem,
              black 2rem
            )`,
          WebkitBackgroundClip: ready ? "text" : "none",
          backgroundClip: ready ? "text" : "none",
          backgroundPosition: `${offset}rem ${offset}rem`,
          lineHeight: "1",
          textAlign: "center",
          textShadow: ready ? "0 0 0.2rem rgba(0, 0, 0, 0.5)" : "0 0 0.2rem rgba(255, 255, 255, 0.8)",
        }}
      >
        {time}
      </div>
    </div>
  );
}
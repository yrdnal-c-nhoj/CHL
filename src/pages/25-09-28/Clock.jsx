import React, { useState, useEffect } from "react";
import bgImage from "./wall.jpg";
import customFont from "./anim.ttf";

export default function StreamlineClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Inject @font-face dynamically
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @font-face {
        font-family: "Streamline25";
        src: url(${customFont}) format("truetype");
        font-display: swap;
      }
      body { margin: 0; background: black; }
    `;
    document.head.appendChild(styleEl);

    // Preload font
    document.fonts.load("1rem Streamline25").then(() => {
      // Preload image
      const img = new Image();
      img.src = bgImage;
      img.onload = () => setReady(true);
    });

    // Clock tick
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          background: "black",
        }}
      />
    );
  }

  // Format time
  let hours = time.getHours() % 12 || 12;
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();

  const formatDigits = (num, length = 2) => num.toString().padStart(length, "0");

  const h = formatDigits(hours);
  const m = formatDigits(minutes);
  const s = formatDigits(seconds);

  const isPhone = window.innerWidth < 768;

  const digitBox = (digit, key) => (
    <div
      key={key}
      style={{
        flex: "1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0.2rem",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "1rem",
        boxShadow: "0 0 1rem rgba(0,0,0,0.6) inset",
      }}
    >
      <span
        style={{
          fontFamily: "Streamline25, sans-serif",
          fontSize: isPhone ? "8vw" : "6rem",
          color: "#f5f5f5",
          letterSpacing: "0.1rem",
        }}
      >
        {digit}
      </span>
    </div>
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: isPhone ? "row" : "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      {/* Desktop: H/M/S stacked | Phone: all in one row */}
      {isPhone ? (
        [...h, ...m, ...s].map((d, i) => digitBox(d, i))
      ) : (
        <>
          <div style={{ display: "flex" }}>{[...h].map((d, i) => digitBox(d, "h" + i))}</div>
          <div style={{ display: "flex" }}>{[...m].map((d, i) => digitBox(d, "m" + i))}</div>
          <div style={{ display: "flex" }}>{[...s].map((d, i) => digitBox(d, "s" + i))}</div>
        </>
      )}
    </div>
  );
}

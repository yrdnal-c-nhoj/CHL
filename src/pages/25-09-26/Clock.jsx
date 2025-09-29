import React, { useState, useEffect } from "react";
import bgImage926 from "./wall.webp";
import font20250926A from "./not.otf";   // give date-specific names
import font20250926B from "./not2.otf";

export default function DualFontClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isPhone, setIsPhone] = useState(window.innerWidth < 768);
  const [fadeStarted, setFadeStarted] = useState(false);

  // Device-specific styling
  const phoneFontSize = "22vw";
  const desktopFontSize = "8rem";
  const phoneDigitSpacing = "0.6vw";
  const desktopDigitSpacing = "-0.7rem";
  const phoneColonSpacing = "-3vw";
  const desktopColonSpacing = "-1.5rem";

  const fontSize = isPhone ? phoneFontSize : desktopFontSize;
  const digitSpacing = isPhone ? phoneDigitSpacing : desktopDigitSpacing;
  const colonSpacing = isPhone ? phoneColonSpacing : desktopColonSpacing;

  // Preload fonts + background image
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @font-face {
        font-family: "FontA";
        src: url(${font20250926A}) format("opentype");
        font-display: swap;
      }
      @font-face {
        font-family: "FontB";
        src: url(${font20250926B}) format("opentype");
        font-display: swap;
      }
      @keyframes fadeLoop {
        0% { opacity: 0; }
        11.75% { opacity: 1; }
        30% { opacity: 1; }
        61.25% { opacity: 0; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(styleEl);

    Promise.all([
      document.fonts.load("1rem FontA"),
      document.fonts.load("1rem FontB"),
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = bgImage926;
        img.onload = resolve;
        img.onerror = reject;
      }),
    ]).then(() => setReady(true));

    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleResize = () => setIsPhone(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setFadeStarted(true), 3000);
    return () => clearTimeout(t);
  }, [ready]);

  if (!ready) {
    return (
      <div style={{ width: "100vw", height: "100dvh", background: "black" }} />
    );
  }

  // Time formatting
  const hours = (time.getHours() % 12) || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = time.getHours() >= 12 ? "PM" : "AM";
  const formatDigits = (n) => n.toString().padStart(2, "0");

  const h = hours.toString();
  const m = formatDigits(minutes);
  const s = formatDigits(seconds);

  const stackedChar = (char) => (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: isPhone ? "17vw" : "6rem",
        height: isPhone ? "17vw" : "5rem",
        marginLeft: char === ":" ? colonSpacing : digitSpacing,
        marginRight: char === ":" ? colonSpacing : digitSpacing,
      }}
    >
      {/* FontA - always visible */}
      <span
        style={{
          fontFamily: "FontA, sans-serif",
          fontSize,
          color: "#F44444FF",
          textShadow: `
            -0.2rem -0.2rem 0 #F5F3D6FF,
            0.2rem 0.2rem 0 #000000,
            0.4rem 0.4rem 1rem rgba(250,180,0,0.9),
            0 0 1.5rem #CAFF44FF,
            0 0 2.5rem #04FF00FF,
            0 0 3.5rem #66FFB3FF
          `,
          position: "absolute",
        }}
      >
        {char}
      </span>

      {/* FontB - fades in/out */}
      <span
        style={{
          fontFamily: "FontB, sans-serif",
          fontSize,
          color: "#5CB6FFFF",
          position: "absolute",
          textShadow: "0 0 1rem rgba(10,144,255,0.7)",
          opacity: 0,
          animation: fadeStarted ? "fadeLoop 15s linear infinite" : "none",
        }}
      >
        {char}
      </span>
    </div>
  );

  const renderTime = () => {
    if (isPhone) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex" }}>{[...h].map(stackedChar)}</div>
          <div style={{ display: "flex" }}>{[...m].map(stackedChar)}</div>
          <div style={{ display: "flex" }}>{[...s].map(stackedChar)}</div>
          <div style={{ display: "flex" }}>{[...ampm].map(stackedChar)}</div>
        </div>
      );
    } else {
      const chars = [...h, ":", ...m, ":", ...s, ...ampm];
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {chars.map((c, i) => stackedChar(c))}
        </div>
      );
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "black",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bgImage926})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7) contrast(1.9)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{renderTime()}</div>
    </div>
  );
}

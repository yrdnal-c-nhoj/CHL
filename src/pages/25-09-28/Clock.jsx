import React, { useState, useEffect } from "react";
import bgImage from "./wall.jpg";
import fontA from "./not.otf";
import fontB from "./not2.otf";

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

  // Choose current device spacing/font
  const fontSize = isPhone ? phoneFontSize : desktopFontSize;
  const digitSpacing = isPhone ? phoneDigitSpacing : desktopDigitSpacing;
  const colonSpacing = isPhone ? phoneColonSpacing : desktopColonSpacing;

  // Inject fonts and CSS
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @font-face {
        font-family: "FontA";
        src: url(${fontA}) format("truetype");
        font-display: swap;
      }
      @font-face {
        font-family: "FontB";
        src: url(${fontB}) format("truetype");
        font-display: swap;
      }
      body {
        margin: 0;
        background: black;
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

    // Preload fonts and background
    Promise.all([
      document.fonts.load("1rem FontA"),
      document.fonts.load("1rem FontB")
    ]).then(() => {
      const img = new Image();
      img.src = bgImage;
      img.onload = () => setReady(true);
    });

    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleResize = () => setIsPhone(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Start FontB fade animation after 4 seconds
  useEffect(() => {
    if (!ready) return;
    const startTimer = setTimeout(() => setFadeStarted(true), 4000);
    return () => clearTimeout(startTimer);
  }, [ready]);

  if (!ready)
    return <div style={{ width: "100vw", height: "100dvh", background: "black" }} />;

  const hours = (time.getHours() % 12) || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const formatDigits = (num) => num.toString().padStart(2, "0");

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
        margin: char === ":" ? colonSpacing : digitSpacing,
      }}
    >
      {/* FontA always visible */}
      <span
        style={{
          fontFamily: "FontA, sans-serif",
          fontSize: fontSize,
          color: "#F44444FF",
          textShadow: `
            -1px -1px 0px #F5F3D6FF,
            1px 1px 0px #000000,
            2px 2px 11px rgba(250,180,0,0.9),
            0 0 15px #CAFF44FF,
            0 0 25px #04FF00FF,
            0 0 35px #66FFB3FF
          `,
          position: "absolute",
        }}
      >
        {char}
      </span>

      {/* FontB fades in/out */}
      <span
        style={{
          fontFamily: "FontB, sans-serif",
          fontSize: fontSize,
          color: "#5CB6FFFF",
          position: "absolute",
          textShadow: "0 0 10px rgba(10,144,255,0.7)",
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex" }}>{[...h].map(stackedChar)}</div>
          <div style={{ display: "flex" }}>{[...m].map(stackedChar)}</div>
          <div style={{ display: "flex" }}>{[...s].map(stackedChar)}</div>
          <div style={{ display: "flex" }}>{[...ampm].map(stackedChar)}</div>
        </div>
      );
    } else {
      const timeChars = [...h, ":", ...m, ":", ...s, ...ampm];
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
          {timeChars.map((char, idx) => stackedChar(char))}
        </div>
      );
    }
  };

  return (
    <div style={{ width: "100vw", height: "100dvh", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7) contrast(1.9)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      {/* Clock */}
      <div style={{ position: "relative", zIndex: 1 }}>{renderTime()}</div>
    </div>
  );
}

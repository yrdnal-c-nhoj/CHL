import React, { useEffect, useState } from "react";
import fallbackImg from "./midsun.webp";
import fontFile_2025_10_31 from "./mi.otf";

export default function VideoClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());

  // Time update loop
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 10);
    return () => clearInterval(interval);
  }, []);

  // Preload assets: image and font (no video)
  useEffect(() => {
    let fontLoaded = false;
    let imageLoaded = false;

    const checkReady = () => {
      if (imageLoaded && fontLoaded) {
        setTimeout(() => setReady(true), 100);
      }
    };

    const font = new FontFace("CustomFont", `url(${fontFile_2025_10_31})`);
    font
      .load()
      .then(() => {
        document.fonts.add(font);
        fontLoaded = true;
        checkReady();
      })
      .catch(() => {
        fontLoaded = true;
        checkReady();
      });

    const img = new Image();
    img.src = fallbackImg;
    img.onload = () => {
      imageLoaded = true;
      checkReady();
    };
    img.onerror = () => {
      imageLoaded = true;
      checkReady();
    };
  }, []);


  // Time formatting
  const formatTime = () => {
    const h = String(time.getHours()).padStart(2, "0");
    const m = String(time.getMinutes()).padStart(2, "0");
    const s = String(time.getSeconds()).padStart(2, "0");
    const ms = String(Math.floor(time.getMilliseconds() / 10)).padStart(2, "0");
    return h + m + s + ms;
  };
  const digits = formatTime().split("");

  // Inline styles
  const containerStyle = {
    width: "100vw",
    height: "100dvh",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "opacity 0.4s ease-in-out",
    opacity: ready ? 1 : 0,
  };


  const fallbackStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "block",
    filter: "brightness(1.3) contrast(1.4) hue-rotate(-10deg) saturate(1.2)",
  };

  const clockStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    width: "98vw",
    transform: "rotate(180deg) translateY(3vh)",
    zIndex: 2,
    fontFamily: "CustomFont, Arial, sans-serif",
    fontSize: "24vw",
    color: "#e6f2ff",
    userSelect: "none",
    textAlign: "center",
    textShadow: `
      1px 1px 0 #0A4FB8FF,
      -1px 0px 7px rgba(0, 50, 100, 0.8)
    `,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };


  return (
    <div style={containerStyle}>
      {/* Inject @font-face inline to avoid style leakage */}
      <style>{`
        @font-face {
          font-family: 'CustomFont';
          src: url(${fontFile_2025_10_31}) format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
      <div style={fallbackStyle} aria-hidden={false} />
      {ready && (
        <div style={clockStyle}>
          {digits.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      )}
    </div>
  );
}
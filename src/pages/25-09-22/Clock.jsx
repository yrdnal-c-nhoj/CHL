import React, { useEffect, useState } from "react";
import bgVideo from "./di.mp4";
import fallbackImage from "./fire.gif";
import customFont from "./disney.ttf";

export default function DigitalClockVideo() {
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isPhone, setIsPhone] = useState(window.innerWidth <= 768);

  // Load custom font
  useEffect(() => {
    const font = new FontFace("CustomFont", `url(${customFont})`);
    font
      .load()
      .then((loadedFont) => document.fonts.add(loadedFont))
      .catch(() => console.warn("Custom font failed to load"));
  }, []);

  // Update time every 10ms
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 10);
    return () => clearInterval(interval);
  }, []);

  // Video error handlers
  useEffect(() => {
    const videoEl = document.getElementById("bg-video");
    if (videoEl) {
      videoEl.onerror = () => setVideoFailed(true);
      videoEl.onabort = () => setVideoFailed(true);
      videoEl.onstalled = () => setVideoFailed(true);
    }
  }, []);

  // Responsive detection
  useEffect(() => {
    const handleResize = () => setIsPhone(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inject keyframes for shimmer/sparkle
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes sparkle {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Format time
  const formatNumber = (num, length = 2) => String(num).padStart(length, "0");
  const hours = formatNumber(time.getHours() % 12 || 12);
  const minutes = formatNumber(time.getMinutes());
  const seconds = formatNumber(time.getSeconds());
  const milliseconds = formatNumber(Math.floor(time.getMilliseconds() / 10), 2);
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const containerStyle = {
    height: "100dvh",
    width: "100vw",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'CustomFont', sans-serif",
  };

  // Nightmare dark background
  const mediaStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100dvh",
    objectFit: "cover",
    zIndex: 0,
    pointerEvents: "none",
    filter:
      "invert(1) hue-rotate(200deg) contrast(1.8) saturate(1.5) blur(0.15rem) brightness(0.8)",
  };

  const clockStyle = {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: isPhone ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    gap: isPhone ? "0.5rem" : "1rem",
    fontSize: isPhone ? "2.5rem" : "4rem",
    textAlign: "center",
  };

  const rowStyle = {
    display: "flex",
    flexDirection: "row",
  };

  // Magical numbers style
  const boxStyle = {
    width: isPhone ? "2.5rem" : "3.2rem",
    height: isPhone ? "3rem" : "3.8rem",
    minWidth: isPhone ? "2.5rem" : "3.2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'CustomFont', sans-serif",
    fontSize: isPhone ? "3.8rem" : "5.5rem",
    lineHeight: 1,
    textAlign: "center",
    background: "linear-gradient(90deg, #FFD700, #FFDD55, #FFE27A, #FFD700)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "sparkle 3.5s infinite linear",
    textShadow:
      "0 0 0.5rem #fff7b2, 0 0 1rem #ffe066, 0 0 1.5rem #ffcc00, 0 0 2rem #fff8c2",
  };

  // AM/PM style (larger on horizontal)
  const ampmBoxStyle = {
    ...boxStyle,
    width: isPhone ? "4rem" : "6rem",
    minWidth: isPhone ? "4rem" : "6rem",
    fontSize: isPhone ? "1.5rem" : "3rem", // bigger horizontally
    textShadow:
      "0 0 0.4rem #fff7b2, 0 0 0.8rem #ffe066, 0 0 1.2rem #ffcc00, 0 0 1.5rem #fff8c2",
  };

  const renderBoxes = (str) =>
    str.split("").map((c, i) => (
      <div key={i} style={boxStyle}>
        {c}
      </div>
    ));

  return (
    <div style={containerStyle}>
      {!videoFailed ? (
        <video
          id="bg-video"
          style={mediaStyle}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={bgVideo}
          type="video/mp4"
        />
      ) : (
        <img style={mediaStyle} src={fallbackImage} alt="Background fallback" />
      )}

      <div style={clockStyle}>
        {isPhone ? (
          <>
            <div style={rowStyle}>{renderBoxes(hours)}</div>
            <div style={rowStyle}>{renderBoxes(minutes)}</div>
            <div style={rowStyle}>{renderBoxes(seconds)}</div>
            <div style={rowStyle}>{renderBoxes(milliseconds)}</div>
            <div style={rowStyle}>{renderBoxes(ampm)}</div>
          </>
        ) : (
          <div style={rowStyle}>
            {renderBoxes(hours)}
            {renderBoxes(minutes)}
            {renderBoxes(seconds)}
            {renderBoxes(milliseconds)}
            <div style={ampmBoxStyle}>{ampm}</div>
          </div>
        )}
      </div>
    </div>
  );
}

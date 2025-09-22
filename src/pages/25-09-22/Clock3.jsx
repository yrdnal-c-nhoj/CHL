
import React, { useEffect, useState } from "react";
import bgVideo from "./disn.mp4";
import fallbackImage from "./fire.gif";
import customFont from "./disney.ttf";

export default function DigitalClockVideo() {
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isPhone, setIsPhone] = useState(window.innerWidth <= 768);

  // Load custom font with monospace fallback
  useEffect(() => {
    const font = new FontFace("CustomFont", `url(${customFont})`);
    font.load()
      .then((loadedFont) => document.fonts.add(loadedFont))
      .catch(() => console.warn("Custom font failed to load"));
  }, []);

  // Update time every 10ms for smoother millisecond display
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 10);
    return () => clearInterval(interval);
  }, []);

  // Video error handling
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

  // Format numbers with fixed width
  const formatNumber = (num, length = 2) => String(num).padStart(length, "0");
  const hours = formatNumber(time.getHours() % 12 || 12);
  const minutes = formatNumber(time.getMinutes());
  const seconds = formatNumber(time.getSeconds());
  const milliseconds = formatNumber(Math.floor(time.getMilliseconds() / 10));
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const containerStyle = {
    height: "100dvh",
    width: "100vw",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontFamily: "'CustomFont', 'Roboto Mono', monospace",
  };

  const mediaStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100dvh",
    objectFit: "cover",
    zIndex: 0,
    pointerEvents: "none",
  };

  const clockStyle = {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: isPhone ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    gap: isPhone ? "0.5rem" : "1rem",
    fontSize: isPhone ? "3rem" : "5rem",
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: "1rem",
  };

  const rowStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "0.3rem",
  };

  const boxStyle = {
    width: isPhone ? "2.5rem" : "3rem",
    height: isPhone ? "3rem" : "3.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: "0.5rem",
    fontFamily: "'Roboto Mono', monospace", // Enforce monospace for digits
    fontSize: isPhone ? "2rem" : "2.5rem",
    lineHeight: 1,
    textAlign: "center",
  };

  // Helper to render each character in its own box
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
            <div style={boxStyle}>:</div>
            {renderBoxes(minutes)}
            <div style={boxStyle}>:</div>
            {renderBoxes(seconds)}
            <div style={boxStyle}>.</div>
            {renderBoxes(milliseconds)}
            <div style={{ ...boxStyle, width: isPhone ? "4rem" : "5rem" }}>{ampm}</div>
          </div>
        )}
      </div>
    </div>
  );
}
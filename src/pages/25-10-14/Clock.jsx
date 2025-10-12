import React, { useEffect, useRef, useState } from "react";
import bgVideo from "./rose.mp4";
import bgFallback from "./rose.webp";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());
  const [videoPlayable, setVideoPlayable] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);

  // Smooth continuous update
  useEffect(() => {
    let frame;
    const update = () => {
      setTime(new Date());
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Try playing background video
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onCanPlay = () => setVideoPlayable(true);
    const onError = () => setVideoFailed(true);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("error", onError);

    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    const playPromise = v.play();
    if (playPromise?.catch) playPromise.catch(() => {});

    return () => {
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("error", onError);
    };
  }, []);

  const ms = time.getMilliseconds();
  const seconds = time.getSeconds() + ms / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() % 12 + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: "100dvh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b1220",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  const backgroundBaseStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
    display: "block",
    transition: "opacity 400ms ease, filter 1s ease",
  };

  // 🌹 Apply visual filters here:
  const backgroundFilters = `
    brightness(1.3)
    contrast(0.7)
    saturate(0.7)
    hue-rotate(-40deg)
   
  `;

  const backgroundTransform = "rotate(0.5deg) scale(1.02)";

  const backgroundVideoStyle = {
    ...backgroundBaseStyle,
    opacity: videoPlayable && !videoFailed ? 1 : 0,
    filter: backgroundFilters,
    transform: backgroundTransform,
  };

  const backgroundImageStyle = {
    ...backgroundBaseStyle,
    opacity: videoPlayable && !videoFailed ? 0 : 1,
    filter: backgroundFilters,
    transform: backgroundTransform,
  };

  const handsContainerStyle = {
    position: "relative",
    zIndex: 2,
    width: "40vmin",
    height: "40vmin",
    pointerEvents: "none",
  };

  const handCommon = {
    position: "absolute",
    bottom: "50%",
    left: "50%",
    transformOrigin: "50% 100%",
    borderRadius: "0.4vh",
    willChange: "transform",
    opacity:    "0.1",
    background: "#E669DAFF",
    // romantic text shadow to make them soft & fuzzy
    boxShadow: "0 0 2.4vh rgba(255,0,60,0.6)",
  };

  const hourStyle = {
    ...handCommon,
    width: "1.9vh",
    height: "12vmin",
    transform: `translate(-50%, 0) rotate(${hourDeg}deg)`,
  };

  const minuteStyle = {
    ...handCommon,
    width: "0.9vh",
    height: "28vmin",
    transform: `translate(-50%, 0) rotate(${minuteDeg}deg)`,
  };

  const secondStyle = {
    ...handCommon,
    width: "0.4vh",
    height: "37vmin",
    transform: `translate(-50%, 0) rotate(${secondDeg}deg)`,
  };

  return (
    <div style={containerStyle} aria-label="Analog clock with filtered video background">
      <video
        ref={videoRef}
        style={backgroundVideoStyle}
        src={bgVideo}
        playsInline
        muted
        loop
        preload="auto"
        aria-hidden
      />
      <img src={bgFallback} alt="background fallback" style={backgroundImageStyle} aria-hidden />
      <div style={handsContainerStyle}>
        <div style={hourStyle} />
        <div style={minuteStyle} />
        <div style={secondStyle} />
      </div>
      <span style={{ position: "absolute", left: -9999 }}>{time.toLocaleTimeString()}</span>
    </div>
  );
}

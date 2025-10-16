import React, { useEffect, useRef, useState } from "react";
import bgVideo from "./rose.mp4";
import bgFallback from "./rose.webp";

export default function AnalogClock() {
  const [videoPlayable, setVideoPlayable] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);

  // Store the reference "start time" (real time when mounted)
  const startTime = useRef(Date.now());

  // Animated render loop
  const [, forceRender] = useState(0);
  useEffect(() => {
    let frame;
    const update = () => {
      forceRender((x) => x + 1);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Background video handling
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
    v.play().catch(() => {});

    return () => {
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("error", onError);
    };
  }, []);

  // ---- TIME CALCULATIONS ----
  const now = new Date();
  const baseMs = startTime.current;
  const elapsed = Date.now() - baseMs;
  const ms = now.getMilliseconds() + elapsed % 1000;

  // Get smooth fractional time values
  const seconds = now.getSeconds() + ms / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = now.getHours() % 12 + minutes / 60;

  // Continuous degree values
  const secondDeg = seconds * 6; // 360° / 60
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  // ---- STYLES ----
  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: "100dvh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b1220",
  };

  const backgroundBaseStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
    transition: "opacity 0.4s ease, filter 1s ease",
  };

  const backgroundFilters = `
    brightness(2.9)
    contrast(0.8)
    saturate(1.3)
    hue-rotate(-30deg)
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
    borderRadius: "0.6vh",
    willChange: "transform",
    background: "rgba(255, 0, 40, 0.95)",
    opacity: 0.9,
    boxShadow: `
    0 0 3vh rgba(255, 20, 20, 0.8),
      0 0 6vh rgba(255, 40, 60, 0.6),
      0 0 10vh rgba(255, 0, 0, 0.5)
    `,
  };

  const hourStyle = {
    ...handCommon,
    width: "1.6vh",
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
    height: "44vmin",
    opacity: 0.85,
    boxShadow: `
      0 0 3vh rgba(255, 20, 20, 0.8),
      0 0 6vh rgba(255, 40, 60, 0.6),
      0 0 10vh rgba(255, 0, 0, 0.5)
    `,
    filter: "blur(0.4vh)",
    transform: `translate(-50%, 0) rotate(${secondDeg}deg)`,
  };

  return (
    <div style={containerStyle}>
      <video
        ref={videoRef}
        style={backgroundVideoStyle}
        src={bgVideo}
        playsInline
        muted
        loop
        preload="auto"
      />
      <img src={bgFallback} alt="" style={backgroundImageStyle} />
      <div style={handsContainerStyle}>
        <div style={hourStyle} />
        <div style={minuteStyle} />
        <div style={secondStyle} />
      </div>
    </div>
  );
}

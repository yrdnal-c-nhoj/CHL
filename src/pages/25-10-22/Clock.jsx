import React, { useEffect, useRef, useState } from "react";
import videoFile from "./bg.mp4";
import fallbackImg from "./bg.webp";
import fontFile_2025_10_22 from "./fundy.ttf"; // local font in same folder

export default function ClockWithVideo() {
  const [fontReady, setFontReady] = useState(false);
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());

  // Update time every 10ms for smooth milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 10);
    return () => clearInterval(interval);
  }, []);

  // Load custom TTF font properly (avoids flash)
  useEffect(() => {
    const font = new FontFace(
      "MyCustomFont",
      `url(${fontFile_2025_10_22}) format("truetype")`
    );
    font
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
        setFontReady(true);
      })
      .catch(() => setFontReady(true)); // fallback if it fails silently
  }, []);

  // Video fallback handling
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onError = () => setVideoFailed(true);
    v.addEventListener("error", onError);
    v.addEventListener("stalled", onError);
    const playPromise = v.play?.();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => setVideoFailed(true));
    }
    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onError);
    };
  }, []);

  // Format time as HH:MM:SS:MMM with leading zeros
  const formatTime = () => {
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const seconds = String(time.getSeconds()).padStart(2, "0");
    const milliseconds = String(time.getMilliseconds()).padStart(3, "0");
    return `${hours}${minutes}${seconds}${milliseconds.slice(0, 2)}`;
  };

  const timeString = formatTime();
  const timeChars = timeString.split("");

  // Inline Styles
  const containerStyle = {
    width: "100vw",
    height: "100dvh",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
    display: fontReady ? "block" : "none",
  };

  const mediaLayerStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
    pointerEvents: "none",
    display: videoFailed ? "none" : "block",
  };

  const fallbackBackgroundStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: videoFailed ? "block" : "none",
  };

  const clockStyle = {
    position: "absolute",
    bottom: 0,
    width: "100%",
    textAlign: "center",
    zIndex: 1,
    animation: "float 26s linear infinite",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.1rem",
  };

  const digitBoxStyle = {
  fontFamily: "'MyCustomFont', sans-serif",
  fontSize: "4rem",
  width: "2rem",
  textAlign: "center",
  color: "transparent", // watery blue
  opacity: 0.85,
  textShadow: `
    0 0 8px #9ED7D0FF,
    0 0 6px #63998EFF,
    0 0 4px #55706AFF,
    0 0 2px #262F2CFF
  `,
  animation: "colorCycle 26s linear infinite", // keep your existing color animation
};


  const separatorStyle = {
    ...digitBoxStyle,
    width: "1rem",
  };

  const fontFaceCSS = `
    @font-face {
      font-family: 'MyCustomFont';
      src: url(${fontFile_2025_10_22}) format('truetype');
      font-display: block;
    }
    @keyframes float {
      0% { bottom: 0; }
      50% { bottom: calc(100vh - 4rem - 20px); }
      100% { bottom: 0; }
    }
    @keyframes colorCycle {
      0% { color: #E8A270FF; }
      23.08% { color: #749B82FF; }
      50% { color: #90B1E5FF; }
      76.92% { color: #80A48EFF; }
      100% { color:  #E8A270FF; }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{fontFaceCSS}</style>
      <video
        ref={videoRef}
        style={mediaLayerStyle}
        src={videoFile}
        loop
        muted
        playsInline
        autoPlay
        preload="auto"
      />
      <div style={fallbackBackgroundStyle} aria-hidden />
      <div style={clockStyle}>
        {timeChars.map((char, index) => (
          <span
            key={index}
            style={char.match(/[0-9]/) ? digitBoxStyle : separatorStyle}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
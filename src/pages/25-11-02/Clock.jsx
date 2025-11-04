import React, { useEffect, useRef, useState } from "react";
import bgVideo from "./swim.mp4";
import fallbackImg from "./swim.webp";
import fontFile2025_11_04 from "./sperm.ttf"; // Custom scientific font

export default function MonarchScene() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoStyle, setVideoStyle] = useState({});
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load custom font and wait until it's ready
  useEffect(() => {
    const fontFace = new FontFace(
      "MedTech2025_11_04",
      `url(${fontFile2025_11_04}) format("truetype")`
    );
    fontFace.load().then((loaded) => {
      document.fonts.add(loaded);
      document.fonts.ready.then(() => setFontLoaded(true));
    });
  }, []);

  // Adjust background video scaling
  const adjustVideoPosition = () => {
    const video = videoRef.current;
    if (!video) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const videoAspect = video.videoWidth / video.videoHeight;
    const viewportAspect = vw / vh;

    const baseStyle = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      objectFit: "cover",
      zIndex: 0,
      filter: "saturate(1.5)",
    };

    if (viewportAspect < videoAspect) {
      setVideoStyle({ ...baseStyle, height: "100dvh", width: "auto" });
    } else {
      setVideoStyle({ ...baseStyle, width: "100dvw", height: "auto" });
    }
  };

  const handleVideoLoaded = () => adjustVideoPosition();
  const handleVideoError = () => setVideoFailed(true);

  useEffect(() => {
    window.addEventListener("resize", adjustVideoPosition);
    return () => window.removeEventListener("resize", adjustVideoPosition);
  }, []);

  // Update time every 25ms
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 25);
    return () => clearInterval(interval);
  }, []);

  const h = String(time.getHours()).padStart(2, "0");
  const m = String(time.getMinutes()).padStart(2, "0");
  const s = String(time.getSeconds()).padStart(2, "0");
  const ms = String(time.getMilliseconds()).padStart(3, "0");

  return (
    <div
      style={{
        height: "100dvh",
        width: "100dvw",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#000",
        fontFamily: "'MedTech2025_11_04', monospace",
      }}
    >
      {/* Background Video or Fallback Image */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          src={bgVideo}
          muted
          autoPlay
          loop
          playsInline
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          style={videoStyle}
        />
      ) : (
        <img
          src={fallbackImg}
          alt=""
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "100dvh",
            width: "auto",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}

      {/* Centered Vertical Clock */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#00FFFF",
          textShadow: "0 0 1vh #00FFFF",
          userSelect: "none",
          zIndex: 10,
          width: "90vw",
          opacity: fontLoaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <div style={timeRowStyle("15vh")}>{h}</div>
        <div style={timeRowStyle("15vh")}>{m}</div>
        <div style={timeRowStyle("15vh")}>{s}</div>
        <div style={timeRowStyle("15vh", 0.6)}>{ms}</div>
      </div>
    </div>
  );
}

const timeRowStyle = (fontSize, opacity = 1) => ({
  fontSize,
  fontWeight: "bold",
  letterSpacing: "0.1rem",
  textAlign: "center",
  minWidth: "10rem",
  opacity,
});

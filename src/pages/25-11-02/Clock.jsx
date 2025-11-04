import React, { useEffect, useRef, useState } from "react";
import bgVideo from "./swim.mp4";
import fallbackImg from "./swim.webp";
import fontFile2025_11_04 from "./sperm.ttf"; // Custom scientific font

export default function MonarchScene() {
  const videoRef = useRef(null);
  const [mediaReady, setMediaReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoStyle, setVideoStyle] = useState({});
  const [time, setTime] = useState(new Date());

  // Load custom font
  useEffect(() => {
    const fontFace = new FontFace(
      "MedTech2025_11_04",
      `url(${fontFile2025_11_04}) format("truetype")`
    );
    fontFace.load().then((loaded) => {
      document.fonts.add(loaded);
    });
  }, []);

  const adjustVideoPosition = () => {
    const video = videoRef.current;
    if (!video) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const videoAspect = video.videoWidth / video.videoHeight;
    const viewportAspect = vw / vh;

    if (viewportAspect < videoAspect) {
      setVideoStyle({
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: "100dvh",
        width: "auto",
        objectFit: "cover",
        zIndex: 0,
        filter: "saturate(1.5)",
      });
    } else {
      setVideoStyle({
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100dvw",
        height: "auto",
        objectFit: "cover",
        zIndex: 0,
        filter: "saturate(1.5)",
      });
    }
  };

  const handleVideoLoaded = () => {
    setMediaReady(true);
    adjustVideoPosition();
  };
  const handleVideoError = () => setVideoFailed(true);
  const handleImageLoad = () => setMediaReady(true);

  useEffect(() => {
    window.addEventListener("resize", adjustVideoPosition);
    return () => window.removeEventListener("resize", adjustVideoPosition);
  }, []);

  // Clock update (every 25ms)
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 25);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    const ms = String(date.getMilliseconds()).padStart(3, "0");
    return `${h}${m}${s}${ms}`;
  };

  const timeStr = formatTime(time);

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
          onLoad={handleImageLoad}
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

      {/* Centered Digital Clock */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.1vh",
          color: "#00FFFF",
          fontSize: "9vh",
          letterSpacing: "0.35vh",
          userSelect: "none",
          zIndex: 10,
        }}
      >
        {timeStr.split("").map((char, i) => (
          <div
            key={i}
            style={{
              minWidth: char === "." ? "2vw" : "7vw",
              textAlign: "center",
              fontWeight: "bold",
              fontFeatureSettings: "'tnum' 1, 'lnum' 1",
              backdropFilter: "blur(0.2rem)",
            }}
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
}

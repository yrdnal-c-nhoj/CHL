import React, { useEffect, useRef, useState } from "react";
import videoFile from "./mids.mp4";
import fallbackImg from "./midsun.webp";
import fontFile_2025_10_31 from "./mi.otf";

export default function VideoClock() {
  const [ready, setReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [time, setTime] = useState(new Date());
  const videoRef = useRef(null);

  // Time update loop
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 10);
    return () => clearInterval(interval);
  }, []);

  // Preload assets: video, fallback image, and font
  useEffect(() => {
    let fontLoaded = false;
    let imageLoaded = false;
    let videoLoaded = false;

    const checkReady = () => {
      if ((videoLoaded || videoFailed) && imageLoaded && fontLoaded) {
        // Delay slightly for smooth fade-in
        setTimeout(() => setReady(true), 100);
      }
    };

    // Load font
    const font = new FontFace("CustomFont", `url(${fontFile_2025_10_31})`);
    font.load().then(() => {
      document.fonts.add(font);
      fontLoaded = true;
      checkReady();
    }).catch(() => {
      fontLoaded = true;
      checkReady();
    });

    // Load fallback image
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

    // Handle video loading / failure
    const v = videoRef.current;
    if (v) {
      const onLoadedData = () => {
        videoLoaded = true;
        checkReady();
      };
      const onError = () => {
        setVideoFailed(true);
        setShowPlayButton(true);
        videoLoaded = false;
        checkReady();
      };
      v.addEventListener("loadeddata", onLoadedData);
      v.addEventListener("error", onError);
      v.addEventListener("stalled", onError);

      const playPromise = v.play?.();
      if (playPromise) {
        playPromise.catch(() => setShowPlayButton(true));
      }

      return () => {
        v.removeEventListener("loadeddata", onLoadedData);
        v.removeEventListener("error", onError);
        v.removeEventListener("stalled", onError);
      };
    }
  }, [videoFailed]);

  const handlePlayClick = () => {
    const v = videoRef.current;
    if (v) {
      v.play()
        .then(() => setShowPlayButton(false))
        .catch(() => console.error("Manual play failed"));
    }
  };

  // Time formatting
  const formatTime = () => {
    const h = String(time.getHours()).padStart(2, "0");
    const m = String(time.getMinutes()).padStart(2, "0");
    const s = String(time.getSeconds()).padStart(2, "0");
    const ms = String(Math.floor(time.getMilliseconds() / 10)).padStart(2, "0");
    return h + m + s + ms;
  };
  const digits = formatTime().split("");

  // Styles
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
    opacity: ready ? 1 : 0, // invisible until ready
  };

  const videoStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
    display: videoFailed ? "none" : "block",
    pointerEvents: "none",
    filter: "brightness(1.1) contrast(0.8) hue-rotate(15deg) saturate(1.2)",
  };

  const fallbackStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: videoFailed ? "block" : "none",
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
      <video
        ref={videoRef}
        style={videoStyle}
        loop
        muted
        playsInline
        autoPlay
        preload="auto"
      >
        <source src={videoFile} type="video/mp4" />
      </video>
      <div style={fallbackStyle} aria-hidden />
      {showPlayButton && ready && (
        <button
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 3,
            padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: "rgba(0, 30, 60, 0.8)",
            color: "#e6f2ff",
            border: "1px solid rgba(100, 180, 255, 0.5)",
            borderRadius: "5px",
            textShadow: "0 0 4px rgba(100, 180, 255, 0.5)",
          }}
          onClick={handlePlayClick}
        >
          Play Video
        </button>
      )}
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

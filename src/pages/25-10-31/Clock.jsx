import React, { useEffect, useRef, useState } from "react";
import videoFile from "./midsun.mp4";
import fallbackImg from "./midsun.webp";
import fontFile_2025_10_31 from "./mi.otf";

export default function VideoClock() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [time, setTime] = useState(new Date());
  const videoRef = useRef(null);

  // Load custom font before rendering
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace("CustomFont", `url(${fontFile_2025_10_31})`);
      await font.load();
      document.fonts.add(font);
      setFontLoaded(true);
    };
    loadFont();
  }, []);

  // Clock update every 10ms
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 10);
    return () => clearInterval(interval);
  }, []);

  // Video error handling
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onError = (e) => {
      console.error("Video error:", e.target.error);
      setVideoFailed(true);
      setShowPlayButton(true);
    };
    const onStalled = () => setShowPlayButton(true);

    v.addEventListener("error", onError);
    v.addEventListener("stalled", onStalled);

    const playPromise = v.play?.();
    if (playPromise) {
      playPromise.catch((err) => {
        console.error("Autoplay failed:", err);
        setShowPlayButton(true);
      });
    }

    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onStalled);
    };
  }, []);

  const handlePlayClick = () => {
    const v = videoRef.current;
    if (v) {
      v.play()
        .then(() => setShowPlayButton(false))
        .catch((err) => console.error("Manual play failed:", err));
    }
  };

  // Format time HHMMSSMS
  const formatTime = () => {
    const h = String(time.getHours()).padStart(2, "0");
    const m = String(time.getMinutes()).padStart(2, "0");
    const s = String(time.getSeconds()).padStart(2, "0");
    const ms = String(Math.floor(time.getMilliseconds() / 10)).padStart(2, "0");
    return h + m + s + ms;
  };

  const digits = formatTime().split("");

  const containerStyle = {
    width: "100vw",
    height: "100dvh",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: fontLoaded ? 1 : 0,
    transition: "opacity 0.15s linear",
  };

  const mediaStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
    pointerEvents: "none",
    display: videoFailed ? "none" : "block",
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
    maxWidth: "100%",
    transform: "rotate(180deg) translateY(5vh)",
    zIndex: 2,
    fontFamily: "CustomFont, Arial, sans-serif",
    fontSize: "24vw",
    color: "#e6f2ff",
    userSelect: "none",
    textAlign: "center",
    textShadow: `
      1px 0px 0 #274676FF,
      -1px 0px 17px rgba(0, 50, 100, 0.8)
    `,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  const scopedCSS = `
    @font-face {
      font-family: "CustomFont";
      src: url(${fontFile_2025_10_31}) format("opentype");
      font-weight: normal;
      font-style: normal;
    }

    @media (max-width: 768px) {
      div[data-clock] {
        font-size: 3.5rem;
      }
      video {
        object-fit: contain;
      }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{scopedCSS}</style>
      <video
        ref={videoRef}
        style={mediaStyle}
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
      >
        <source src={videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={fallbackStyle} aria-hidden />
      {showPlayButton && (
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
            backgroundColor: "rgba(0,30,60,0.8)",
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
      {fontLoaded && (
        <div style={clockStyle} data-clock>
          {digits.map((d, i) => (
            <span key={i} style={{ display: "block" }}>{d}</span>
          ))}
        </div>
      )}
    </div>
  );
}

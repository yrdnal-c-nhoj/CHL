import React, { useEffect, useRef, useState } from "react";
import videoFile from "./midsun.mp4";
import fallbackImg from "./midsun.webp";
import fontFile_2025_10_31 from "./mid.ttf"; // your TTF font

export default function VideoClock() {
  const [fontReady, setFontReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [time, setTime] = useState(new Date());
  const videoRef = useRef(null);

  // Clock update every 10ms
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 10);
    return () => clearInterval(interval);
  }, []);

  // Load custom font
  useEffect(() => {
    const font = new FontFace(
      "CustomFont",
      `url(${fontFile_2025_10_31}) format("truetype")`
    );
    font
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        setFontReady(true);
      })
      .catch(() => setFontReady(true));
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
    display: fontReady ? "block" : "none",
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
  };

  const fallbackStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: videoFailed ? "block" : "none",
  };

  // Clock styling with digits hugging edges, upside-down
  const clockStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    justifyContent: "space-between",
    transform: "rotate(180deg)", // upside down
    zIndex: 2,
    fontFamily: "CustomFont, monospace",
    fontSize: "5rem",
    color: "#fff",
    userSelect: "none",
    padding: "0 0.5rem",
  };

  const scopedCSS = `
    @font-face {
      font-family: "CustomFont";
      src: url(${fontFile_2025_10_31}) format("truetype");
      font-weight: normal;
      font-style: normal;
      font-display: block;
    }

    @media (max-width: 768px) {
      div[data-clock] {
        font-size: 3rem;
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
          }}
          onClick={handlePlayClick}
        >
          Play Video
        </button>
      )}
      <div style={clockStyle} data-clock>
        {digits.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </div>
  );
}

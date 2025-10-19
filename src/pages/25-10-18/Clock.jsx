// MediaClock.jsx
import React, { useEffect, useRef, useState } from "react";
import bgVideo from "./total.mp4";
import fallbackImg from "./tot.webp";
import font_20251018 from "./tot.ttf";

export default function MediaClock() {
  const [mediaReady, setMediaReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [fontReady, setFontReady] = useState(false);
  const [time, setTime] = useState("--:--");
  const videoRef = useRef(null);

  const backgroundShiftX = "49%";
  const backgroundShiftY = "center";

  // Load font
  useEffect(() => {
    const fontName = "SereneFont";
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @font-face {
        font-family: '${fontName}';
        src: url(${font_20251018}) format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(styleEl);

    const f = new FontFace(fontName, `url(${font_20251018})`);
    f.load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
        setFontReady(true);
      })
      .catch(() => setFontReady(true));

    return () => document.head.removeChild(styleEl);
  }, []);

  // Update time
  useEffect(() => {
    function updateTime() {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setTime(`${hh}${mm}`);
    }
    updateTime();
    const id = setInterval(updateTime, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const handleVideoLoaded = () => setMediaReady(true);
  const handleVideoError = () => {
    console.warn("Video failed to load, switching to fallback image.");
    setVideoFailed(true);
  };
  const handleImageLoad = () => setMediaReady(true);

  const allReady = mediaReady && fontReady;

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#F9F985FF",
      }}
    >
      {/* BACKGROUND MEDIA */}
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
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100dvh",
            width: "100vw",
            objectFit: "cover",
            objectPosition: `${backgroundShiftX} ${backgroundShiftY}`,
            zIndex: 0,
          }}
        />
      ) : (
        <img
          src={fallbackImg}
          alt=""
          onLoad={handleImageLoad}
          onError={() => setMediaReady(true)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100dvh",
            width: "100vw",
            objectFit: "cover",
            objectPosition: `${backgroundShiftX} ${backgroundShiftY}`,
            zIndex: 0,
          }}
        />
      )}

      {/* CLOCK */}
      {allReady && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "14vh",
              fontWeight: 700,
              color: "#2B2626FF",
              textShadow: "1.2px -0.2px #F1E499FF",
              letterSpacing: "2.6vh",
              fontFamily:
                "'SereneFont', ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace",
              textAlign: "center",
            }}
          >
            {time}
          </span>
        </div>
      )}
    </div>
  );
}

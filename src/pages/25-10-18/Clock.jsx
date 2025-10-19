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

  // Adjust these to reposition the background
  const backgroundShiftX = "46%";
  const backgroundShiftY = "center";

  // Load font once
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
      .catch((err) => {
        console.error("Font failed to load:", err);
        setFontReady(true);
      });

    return () => document.head.removeChild(styleEl);
  }, []);

  // Update time (24-hour, with leading zeros)
  useEffect(() => {
    function updateTime() {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setTime(`${hh}${mm}`);
    }
    updateTime();
    // Update at the start of each new minute
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          onError={() => {
            console.error("Fallback image failed to load.");
            setMediaReady(true);
          }}
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
            position: "relative",
            zIndex: 2,
            height: "100dvh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "14vh",
              fontWeight: 700,
              color: "#3A0505FF",
              textShadow: "1 1.6vh 1.2vh rgba(0,0,0)",
              letterSpacing: "2.6vh",
              fontFamily:
                "'SereneFont', ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace",
            }}
          >
            {time}
          </span>
        </div>
      )}
    </div>
  );
}

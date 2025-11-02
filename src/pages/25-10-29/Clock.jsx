/** @jsxImportSource react */
import React, { useEffect, useRef, useState } from "react";
import bgVideo from "./tilt.mp4";
import fallbackImg from "./tilt.webp";
import romanFont2025_10_27 from "./tilt.ttf";

export default function MonarchClock() {
  const videoRef = useRef(null);
  const [mediaReady, setMediaReady] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoStyle, setVideoStyle] = useState({});
  const [now, setNow] = useState(new Date());

  /* ------------------------------------------------------------------
     1. Update time frequently (25ms for smooth milliseconds)
  ------------------------------------------------------------------ */
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 25);
    return () => clearInterval(tick);
  }, []);

  /* ------------------------------------------------------------------
     2. Preload font
  ------------------------------------------------------------------ */
  useEffect(() => {
    const link = document.createElement("link");
    link.href = romanFont2025_10_27;
    link.rel = "preload";
    link.as = "font";
    link.type = "font/ttf";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  /* ------------------------------------------------------------------
     3. Load custom font
  ------------------------------------------------------------------ */
  useEffect(() => {
    const fontFamilyName = "RomanClockFont_2025_10_27";
    const font = new FontFace(
      fontFamilyName,
      `url(${romanFont2025_10_27}) format('truetype')`
    );

    font
      .load()
      .then(() => {
        document.fonts.add(font);
        setFontLoaded(true);
      })
      .catch(() => {
        console.warn("Font failed to load; using fallback.");
        setFontLoaded(true);
      });

    const timeout = setTimeout(() => setFontLoaded(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  /* ------------------------------------------------------------------
     4. Video behavior
  ------------------------------------------------------------------ */
  const handleVideoLoaded = () => {
    setMediaReady(true);
    adjustVideoPosition();
  };
  const handleVideoError = () => setVideoFailed(true);
  const handleImageLoad = () => setMediaReady(true);

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
        left: 0,
        transform: "translateY(-50%)",
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
        height: "100dvh",
        width: "auto",
        objectFit: "contain",
        zIndex: 0,
        filter: "saturate(1.5)",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", adjustVideoPosition);
    return () => window.removeEventListener("resize", adjustVideoPosition);
  }, []);

  /* ------------------------------------------------------------------
     5. Compute digital time
  ------------------------------------------------------------------ */
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const milliseconds = Math.floor(now.getMilliseconds() / 10)
    .toString()
    .padStart(2, "0");

  const timeString = `${hours}.${minutes}.${seconds}.${milliseconds}`;

  /* ------------------------------------------------------------------
     6. Styling
  ------------------------------------------------------------------ */
  const counterFont = {
    fontFamily: fontLoaded
      ? "RomanClockFont_2025_10_27, 'Courier New', monospace"
      : "'Courier New', monospace",
    fontWeight: 700,
    color: "#D1D9D1FF",
    opacity: 0.9,
    mixBlendMode: "screen",
    userSelect: "none",
    whiteSpace: "nowrap",
  };

  // responsive scale that shrinks on small viewports
  const scale =
    typeof window !== "undefined" && window.innerWidth < 600 ? 0.7 : 1;

  const overlayContainer = {
    position: "absolute",
    bottom: "5dvh",
    left: "50%",
    transform: `translateX(-50%) scale(${scale})`,
    zIndex: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1dvh",
    // backgroundColor: "rgba(0,0,0,0.25)",
    padding: "1.5dvh 3dvh",
    borderRadius: "0.8dvh",
    animation: "flicker 3s infinite, fadeIn 1.5s ease-out",
  };

  const topLine = {
    ...counterFont,
    fontSize: "7dvh",
    letterSpacing: "0.9dvh",
    textAlign: "center",
  };

  const bottomLine = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  };

  const recStyle = {
    ...counterFont,
    fontSize: "7dvh",
    textAlign: "center",
    flex: 1,
  };

  const lockStyle = {
    ...counterFont,
    fontSize: "7dvh",
    textAlign: "right",
    flex: 1,
  };

  const flickerAnimation = `
    @keyframes flicker {
      0%, 18%, 20%, 22%, 25%, 53%, 57%, 100% { opacity: 0.9; }
      19%, 21%, 24%, 54%, 56% { opacity: 1; }
    }
  `;

  const fadeInAnimation = `
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
  `;

  const scanlineOverlay = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage:
      "repeating-linear-gradient(to bottom, rgba(0,0,0,0.2) 0, rgba(0,0,0,0.2) 1px, transparent 2px)",
    pointerEvents: "none",
    zIndex: 2,
  };

  /* ------------------------------------------------------------------
     7. Render
  ------------------------------------------------------------------ */
  return (
    <div
      style={{
        height: "100dvh",
        width: "100dvw",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#000",
      }}
    >
      <style>{flickerAnimation + fadeInAnimation}</style>

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
            left: 0,
            transform: "translateY(-50%)",
            height: "100dvh",
            width: "auto",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}

      <div style={scanlineOverlay} />

      {mediaReady && fontLoaded && (
        <div style={overlayContainer}>
          <div style={topLine}>TCR {timeString}</div>
          <div style={bottomLine}>
            <div style={recStyle}>REC</div>
            <div style={lockStyle}>LOCK</div>
          </div>
        </div>
      )}
    </div>
  );
}

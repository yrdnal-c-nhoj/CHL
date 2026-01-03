/** @jsxImportSource react */
import React, { useEffect, useRef, useState } from "react";
import bgVideo from "../../assets/clocks/25-10-29/tilt.mp4";
import fallbackImg from "../../assets/clocks/25-10-29/tilt.webp";
import romanFont2025_10_27 from '../../assets/fonts/25-10-29-tilt.ttf';

export default function MonarchClock() {
  const [mediaReady, setMediaReady] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [now, setNow] = useState(new Date());

  /* ------------------------------------------------------------------
     1. Update time frequently (25ms for smooth milliseconds)
  ------------------------------------------------------------------ */
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 25);
    return () => clearInterval(tick);
  }, []);

  /* ------------------------------------------------------------------
     2. Preload and load font with scoping
  ------------------------------------------------------------------ */
  useEffect(() => {
    const link = document.createElement("link");
    link.href = romanFont2025_10_27;
    link.rel = "preload";
    link.as = "font";
    link.type = "font/ttf";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    // Generate unique ID for this component instance
    const uniqueId = `font-${Math.random().toString(36).substr(2, 9)}`;
    const scopedFontName = `RomanClockFont_2025_10_27_${uniqueId}`;

    const font = new FontFace(
      scopedFontName,
      `url(${romanFont2025_10_27}) format('truetype')`
    );
    font
      .load()
      .then(() => {
        // Add to document fonts for global availability during component lifetime
        document.fonts.add(font);
        setFontLoaded(scopedFontName);
      })
      .catch(() => setFontLoaded("'Courier New', monospace"));

    const timeout = setTimeout(() => setFontLoaded("'Courier New', monospace"), 3000);
    return () => {
      clearTimeout(timeout);
      document.head.removeChild(link);
      // Remove font when component unmounts
      if (font.family === scopedFontName) {
        document.fonts.delete(font);
      }
    };
  }, []);

  /* ------------------------------------------------------------------
     3. Compute time
  ------------------------------------------------------------------ */
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const milliseconds = Math.floor(now.getMilliseconds() / 10)
    .toString()
    .padStart(2, "0");
  const timeString = `${hours}.${minutes}.${seconds}.${milliseconds}`;

  /* ------------------------------------------------------------------
     4. Styles
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
    padding: "1.5dvh 3dvh",
    borderRadius: "0.8dvh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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

  /* ------------------------------------------------------------------
     5. Render
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
          src={bgVideo}
          muted
          autoPlay
          loop
          playsInline
          onLoadedData={() => setMediaReady(true)}
          onError={() => setVideoFailed(true)}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            filter: "saturate(1.5)",
          }}
        />
      ) : (
        <img
          src={fallbackImg}
          alt=""
          onLoad={() => setMediaReady(true)}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
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

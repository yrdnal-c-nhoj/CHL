import React, { useEffect, useState, useCallback, useRef } from "react";
import bgVideo from "./deex.mp4";
import fallbackImage from "./deex.gif";
import customFontmmm from "./disney.ttf";

export default function DigitalClockVideo() {
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isPhone, setIsPhone] = useState(window.innerWidth <= 768);
  const [isReady, setIsReady] = useState(false); // prevent FOUC
  const videoRef = useRef(null); // Ref for video element

  // Load custom font
  useEffect(() => {
    console.log("Starting font load for CustomFontmmm");
    const font = new FontFace("CustomFontmmm", `url(${customFontmmm})`);
    font
      .load()
      .then((loadedFont) => {
        console.log("Font loaded successfully");
        document.fonts.add(loadedFont);
        return document.fonts.ready;
      })
      .then(() => {
        console.log("Font ready, setting isReady to true");
        setIsReady(true);
      })
      .catch((error) => {
        console.warn("Custom font failed to load:", error.message);
        setIsReady(true); // fallback to system font
      });
  }, []);

  // Update time every ~16ms for smooth display
  useEffect(() => {
    console.log("Starting time update interval");
    const interval = setInterval(() => {
      const newTime = new Date();
      setTime(newTime);
      console.log("Time updated:", newTime.toLocaleTimeString());
    }, 16);
    return () => {
      console.log("Clearing time update interval");
      clearInterval(interval);
    };
  }, []);

  // Video event handlers
  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      console.log("Attaching video event handlers");
      videoEl.oncanplay = () => console.log("Video can play at", new Date().toLocaleTimeString());
      videoEl.onplay = () => console.log("Video is playing at", new Date().toLocaleTimeString());
      videoEl.onerror = () => {
        console.error("Video error:", videoEl.error?.message || "Unknown error");
        setVideoFailed(true);
      };
      videoEl.onabort = () => {
        console.warn("Video aborted");
        setVideoFailed(true);
      };
      videoEl.onstalled = () => {
        console.warn("Video stalled");
        setVideoFailed(true);
      };
    }
    console.log("videoFailed state:", videoFailed);
    return () => {
      if (videoEl) {
        console.log("Cleaning up video event handlers");
        videoEl.oncanplay = null;
        videoEl.onplay = null;
        videoEl.onerror = null;
        videoEl.onabort = null;
        videoEl.onstalled = null;
      }
    };
  }, [videoFailed]);

  // Responsive detection
  useEffect(() => {
    const handleResize = () => {
      const newIsPhone = window.innerWidth <= 768;
      console.log("Window resized, isPhone:", newIsPhone);
      setIsPhone(newIsPhone);
    };
    window.addEventListener("resize", handleResize);
    console.log("Initial isPhone state:", isPhone);
    return () => {
      console.log("Removing resize event listener");
      window.removeEventListener("resize", handleResize);
    };
  }, [isPhone]);

  // Inject keyframes for bronze/gold shimmer
  useEffect(() => {
    console.log("Injecting sparkle keyframes");
    const style = document.createElement("style");
    style.id = "sparkle-styles"; // Prevent duplicates
    style.innerHTML = `
      @keyframes sparkle {
        0% { color: #42210B; }
        25% { color: #8B4513; }
        50% { color: #D4AF37; }
        75% { color: #C28840; }
        100% { color: #42210B; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      console.log("Removing sparkle keyframes");
      document.head.removeChild(style);
    };
  }, []);

  // Format time
  const formatNumber = (num, length = 2) => String(num).padStart(length, "0");
  const hours = formatNumber(time.getHours() % 12 || 12);
  const minutes = formatNumber(time.getMinutes());
  const seconds = formatNumber(time.getSeconds());
  const milliseconds = formatNumber(Math.floor(time.getMilliseconds() / 10), 2);
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  // Styles
  const containerStyle = {
    height: "100dvh",
    width: "100vw",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'CustomFontmmm', sans-serif",
    visibility: isReady ? "visible" : "hidden",
  };

  const mediaStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100dvh",
    objectFit: "cover",
    zIndex: 0,
    pointerEvents: "none",
  };

  const clockStyle = {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: isPhone ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    gap: isPhone ? "0.5rem" : "1rem",
    fontSize: isPhone ? "2.5rem" : "4rem",
    textAlign: "center",
  };

  const rowStyle = { display: "flex", flexDirection: "row" };

  const boxStyle = {
    width: isPhone ? "2.5rem" : "3.2rem",
    height: isPhone ? "3rem" : "3.8rem",
    minWidth: isPhone ? "2.5rem" : "3.2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'CustomFontmmm', sans-serif",
    fontSize: isPhone ? "3.8rem" : "5.5rem",
    lineHeight: 1,
    textAlign: "center",
    animation: "sparkle 3.5s infinite linear",
    textShadow:
      "0 0 0.3rem #42210B, 0 0 0.6rem #8B4513, 0 0 1rem #D4AF37, 0 0 1.5rem #C28840",
  };

  const ampmBoxStyle = {
    ...boxStyle,
    width: isPhone ? "4rem" : "6rem",
    minWidth: isPhone ? "4rem" : "6rem",
    fontSize: isPhone ? "1.5rem" : "3rem",
  };

  const renderBoxes = useCallback(
    (str) => {
      console.log("Rendering boxes for:", str);
      return str.split("").map((c, i) => <div key={i} style={boxStyle}>{c}</div>);
    },
    [boxStyle]
  );

  return (
    <div style={containerStyle}>
      {!videoFailed ? (
        <video
          ref={videoRef}
          id="bg-video"
          style={mediaStyle}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata" // Changed from "auto" for faster initial load
          src={bgVideo}
          type="video/mp4"
        />
      ) : (
        <img style={mediaStyle} src={fallbackImage} alt="Background fallback" />
      )}
      <div style={clockStyle}>
        {isPhone ? (
          <>
            <div style={rowStyle}>{renderBoxes(hours)}</div>
            <div style={rowStyle}>{renderBoxes(minutes)}</div>
            <div style={rowStyle}>{renderBoxes(seconds)}</div>
            <div style={rowStyle}>{renderBoxes(milliseconds)}</div>
            <div style={rowStyle}>{renderBoxes(ampm)}</div>
          </>
        ) : (
          <div style={rowStyle}>
            {renderBoxes(hours)}
            {renderBoxes(minutes)}
            {renderBoxes(seconds)}
            {renderBoxes(milliseconds)}
            <div style={ampmBoxStyle}>{ampm}</div>
          </div>
        )}
      </div>
    </div>
  );
}
// ClockWithVideo.jsx
import React, { useEffect, useRef, useState } from "react";
import videoFile from "./bg.mp4";
import fallbackImg from "./bg.webp";
import fontFile_2025_10_22 from "./fundy.ttf"; // local font in same folder

export default function ClockWithVideo() {
  const [fontReady, setFontReady] = useState(false);
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());

  // Update time every 10ms for smooth milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 10);
    return () => clearInterval(interval);
  }, []);

  // Load custom font
  useEffect(() => {
    const font = new FontFace(
      "MyCustomFont",
      `url(${fontFile_2025_10_22}) format("truetype")`
    );
    font
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
        setFontReady(true);
      })
      .catch(() => setFontReady(true));
  }, []);

  // Handle video fallback
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onError = () => setVideoFailed(true);
    v.addEventListener("error", onError);
    v.addEventListener("stalled", onError);
    const playPromise = v.play?.();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => setVideoFailed(true));
    }
    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onError);
    };
  }, []);

  // Format time as HHMMSScc
  const formatTime = () => {
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const seconds = String(time.getSeconds()).padStart(2, "0");
    const milliseconds = String(time.getMilliseconds()).padStart(3, "0");
    return `${hours}${minutes}${seconds}${milliseconds.slice(0, 2)}`;
  };

  const timeChars = formatTime().split("");

  // Inline styles
  const containerStyle = {
    width: "100vw",
    height: "100dvh",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
    display: fontReady ? "block" : "none",
  };

  const mediaLayerStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
    pointerEvents: "none",
    display: videoFailed ? "none" : "block",
  };

  const fallbackBackgroundStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: videoFailed ? "block" : "none",
  };

  const clockStyle = {
    position: "absolute",
    bottom: 0,
    width: "100%",
    textAlign: "center",
    zIndex: 1,
    animation: "float 26.3s linear infinite",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.1rem",
  };

  const digitBoxStyle = {
    fontFamily: "'MyCustomFont', sans-serif",
    fontSize: "4rem",
    width: "2rem",
    textAlign: "center",
    color: "#DF9268FF",
    animation: "colorCycle 26s linear infinite",
    textShadow: `
      0 0 8px #4B3424FF,
      0 0 6px #98643FFF,
      0 0 4px #C88A5E,
      0 0 2px #D2C497FF
    `,
    transition: "text-shadow 1s linear",
  };

  const separatorStyle = {
    ...digitBoxStyle,
    width: "1rem",
  };

  const fontFaceCSS = `
    @font-face {
      font-family: 'MyCustomFont';
      src: url(${fontFile_2025_10_22}) format('truetype');
      font-display: block;
    }

    @keyframes float {
      0% { bottom: 0; }
      50% { bottom: calc(100dvh - 4rem - 20px); }
      100% { bottom: 0; }
    }

    @keyframes colorCycle {
      0% {
        color: #df9268ff;
        text-shadow:
           -1px 0 0px #4b3424ff,
          0 0 6px #98643fff,
          0 0 4px #c88a5e,
          1px 0 2px #d2c497ff;
        opacity: 1;
      }

      23.08% {
        opacity: 0;
        color: #7C947CFF;
        text-shadow:
      -1px  -1px #04140BFF,
          3px 2px 6px #E6EDE9FF,
          -2px 0 4px #EBECEBFF,
          1px 1px #e4ebe6ff;
      }

      50% {
        opacity: 1;
        color: #F4ECCCFF;
        text-shadow:
          1px 1px #e10e23ff,
          0 0 6px #F8FDF7FF,
          0 0 4px #5874a0ff,
          -1px 0 #0d131cff;
      }

      76.92% {
        opacity: 0;
        color: #7C947CFF;
        text-shadow:
          -1px  -1px #04140BFF,
          3px 2px 6px #E6EDE9FF,
          -2px 0 4px #EBECEBFF,
          1px 1px #e4ebe6ff;
      }

      100% {
        color: #df9268ff;
        text-shadow:
          -1px 0 0px #4b3424ff,
          0 0 6px #98643fff,
          0 0 4px #c88a5e,
          1px 0 2px #d2c497ff;
        opacity: 1;
      }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{fontFaceCSS}</style>
      <video
        ref={videoRef}
        style={mediaLayerStyle}
        src={videoFile}
        loop
        muted
        playsInline
        autoPlay
        preload="auto"
      />
      <div style={fallbackBackgroundStyle} aria-hidden />
      <div style={clockStyle}>
        {timeChars.map((char, index) => (
          <span
            key={index}
            style={char.match(/[0-9]/) ? digitBoxStyle : separatorStyle}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

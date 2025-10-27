import React, { useEffect, useRef, useState } from "react";
import videoFile from "./bg.mp4";
import fallbackImg from "./bg.webp";
import fontFile_2025_10_22 from "./fundy.ttf"; // Local font in same folder

export default function ClockWithVideo() {
  const [fontReady, setFontReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());
  const videoRef = useRef(null);

  // Update time smoothly (every 10ms)
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 10);
    return () => clearInterval(interval);
  }, []);

  // Load local custom font (no leakage)
  useEffect(() => {
    const font = new FontFace(
      "MyCustomFont",
      `url(${fontFile_2025_10_22}) format("truetype")`
    );
    font
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        setFontReady(true);
      })
      .catch(() => setFontReady(true));
  }, []);

  // Handle video fallback gracefully
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onError = () => setVideoFailed(true);
    v.addEventListener("error", onError);
    v.addEventListener("stalled", onError);

    const playPromise = v.play?.();
    if (playPromise?.catch) playPromise.catch(() => setVideoFailed(true));

    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onError);
    };
  }, []);

  // Format current time (HHMMSScc)
  const formatTime = () => {
    const h = String(time.getHours()).padStart(2, "0");
    const m = String(time.getMinutes()).padStart(2, "0");
    const s = String(time.getSeconds()).padStart(2, "0");
    const ms = String(time.getMilliseconds()).padStart(3, "0");
    return `${h}${m}${s}${ms.slice(0, 2)}`;
  };

  const timeChars = formatTime().split("");

  // Inline styles (no leakage, all self-contained)
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

  const clockStyle = {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.1rem",
    zIndex: 1,
    animation: "float_2025_10_22 26.3s linear infinite",
  };

  const digitStyle = {
    fontFamily: "'MyCustomFont', sans-serif",
    fontSize: "4rem",
    width: "2rem",
    textAlign: "center",
    color: "#DF9268FF",
    animation: "colorCycle_2025_10_22 26s linear infinite",
    textShadow: `
      0 0 8px #4B3424FF,
      0 0 6px #98643FFF,
      0 0 4px #C88A5E,
      0 0 2px #D2C497FF
    `,
    transition: "text-shadow 1s linear",
  };

  const separatorStyle = {
    ...digitStyle,
    width: "1rem",
  };

  // Scoped font-face + animations
  const scopedCSS = `
    @font-face {
      font-family: 'MyCustomFont';
      src: url(${fontFile_2025_10_22}) format('truetype');
      font-display: block;
    }

    @keyframes float_2025_10_22 {
      0% { bottom: 0; }
      50% { bottom: calc(100dvh - 4rem - 20px); }
      100% { bottom: 0; }
    }

    @keyframes colorCycle_2025_10_22 {
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
          -1px -1px #04140BFF,
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
          -1px -1px #04140BFF,
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
      <style>{scopedCSS}</style>
      <video
        ref={videoRef}
        style={mediaStyle}
        src={videoFile}
        loop
        muted
        playsInline
        autoPlay
        preload="auto"
      />
      <div style={fallbackStyle} aria-hidden />
      <div style={clockStyle}>
        {timeChars.map((char, i) => (
          <span
            key={i}
            style={/[0-9]/.test(char) ? digitStyle : separatorStyle}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

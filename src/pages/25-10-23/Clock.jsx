import React, { useRef, useEffect, useState } from "react";
import videoFile from "./esp.mp4";
import videoWebM from "./esp.webp"; // Added for compatibility
import fallbackImg from "./esp.jpeg"; // Fallback image
import fontFile from "./noto.ttf"; // Custom font

export default function EsperantoClockWithVideo() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle video fallback
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onError = (e) => {
      console.error("Video error:", e);
      setVideoFailed(true);
    };

    const onCanPlay = () => setVideoFailed(false);

    v.addEventListener("error", onError);
    v.addEventListener("stalled", onError);
    v.addEventListener("canplay", onCanPlay);

    const playPromise = v.play?.();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(onError);
    }

    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onError);
      v.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  // Capitalize first letter of every word
  const capitalizeWords = (phrase) =>
    phrase
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // Hours spelled out
  const hoursWords = [
    "unu","du","tri","kvar","kvin","ses","sep","ok","naŭ","dek",
    "dek unu","dek du","dek tri","dek kvar","dek kvin","dek ses","dek sep",
    "dek ok","dek naŭ","dudek","dudek unu","dudek du","dudek tri","dudek kvar"
  ];

  // Minutes & seconds spelled out
  const minutesAndSecondsWords = [
    "nul","unu","du","tri","kvar","kvin","ses","sep","ok","naŭ","dek",
    "dek unu","dek du","dek tri","dek kvar","dek kvin","dek ses","dek sep",
    "dek ok","dek naŭ","dudek","dudek unu","dudek du","dudek tri","dudek kvar",
    "dudek kvin","dudek ses","dudek sep","dudek ok","dudek naŭ","tridek",
    "tridek unu","tridek du","tridek tri","tridek kvar","tridek kvin","tridek ses",
    "tridek sep","tridek ok","tridek naŭ","kvardek","kvardek unu","kvardek du",
    "kvardek tri","kvardek kvar","kvardek kvin","kvardek ses","kvardek sep",
    "kvardek ok","kvardek naŭ","kvindek","kvindek unu","kvindek du","kvindek tri",
    "kvindek kvar","kvindek kvin","kvindek ses","kvindek sep","kvindek ok","kvindek naŭ"
  ];

  const hourWord = capitalizeWords(hoursWords[time.getHours()]);
  const minuteWord = capitalizeWords(minutesAndSecondsWords[time.getMinutes()]);
  const secondWord = capitalizeWords(minutesAndSecondsWords[time.getSeconds()]);

  // Styles
  const containerStyle = {
  fontFamily: "'CustomFont', sans-serif",
  width: "100vw",
  height: "100dvh",
  minHeight: "100dvh",
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#000",
  color: "#F1D8D8FF",
  fontSize: "4vh",
  textShadow: "1px 1px #EF2A07FF, -1px -1px #F7E11BFF",
  zIndex: 1,
};


  const videoStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
    filter: " saturate(0.6) brightness(0.8) contrast(0.8)",
  };

  const fallbackStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: videoFailed ? "block" : "none",
    zIndex: 0,
    filter: "hue-rotate(90deg) saturate(1.5) brightness(0.8) contrast(1.2)",
  };

  const rowBaseStyle = {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80vw",
    left: "50%",
    transform: "translateX(-50%)",
    gap: "1vw",
  };

  const boxStyle = {
    borderRadius: "0.5vh",
    padding: "1vh 1.5vw",
    textAlign: "right",
    minWidth: "40vw",
    transition: "all 0.3s ease-in-out",
  };

  const labelStyle = {
    textAlign: "left",
    minWidth: "40vw",
  };

  return (
    <div style={containerStyle}>
      {/* Custom font */}
      <style>
        {`
          @font-face {
            font-family: 'CustomFont';
            src: url(${fontFile}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      {/* Background Video or Fallback Image */}
      <video
        ref={videoRef}
        style={videoStyle}
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
      >
        <source src={videoFile} type="video/mp4" />
        <source src={videoWebM} type="video/webm" />
      </video>
      <div style={fallbackStyle} aria-hidden={!videoFailed}>
        {videoFailed && (
          <span style={{ display: "none" }}>Fallback background image</span>
        )}
      </div>

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          width: "100%",
          textAlign: "center",
          fontSize: "6vh",
        }}
      >
        BONVENON AL <br />LA ESPERANTO HORLOĜO!
      </div>

      {/* Clock Rows */}
      <div style={{ ...rowBaseStyle, top: "40%" }}>
        <div style={boxStyle}>{hourWord}</div>
        <div style={labelStyle}>{capitalizeWords("horoj")}</div>
      </div>

      <div style={{ ...rowBaseStyle, top: "55%" }}>
        <div style={boxStyle}>{minuteWord}</div>
        <div style={labelStyle}>{capitalizeWords("minutoj")}</div>
      </div>

      <div style={{ ...rowBaseStyle, top: "70%" }}>
        <div style={boxStyle}>{secondWord}</div>
        <div style={labelStyle}>{capitalizeWords("sekundoj")}</div>
      </div>
    </div>
  );
}

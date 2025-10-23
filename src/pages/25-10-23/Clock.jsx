import React, { useRef, useEffect, useState } from "react";
import videoFile from "./esp.mp4";
import videoWebM from "./esp.webp";
import fallbackImg from "./esp.jpeg";
import fontFile from "./esp.ttf";
import cornerUL from "./ul.webp"; // 🟩 upper-left decorative image
import cornerLR from "./lr.webp"; // 🟩 lower-right decorative image

export default function VictorianEsperantoClock() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());

  const textAndOrnamentColor = "#21032BFF";
  const textAndOrnamentShadow = "2px 2px 4px #F1E7D8FF";

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onError = () => setVideoFailed(true);
    const onCanPlay = () => setVideoFailed(false);
    v.addEventListener("error", onError);
    v.addEventListener("stalled", onError);
    v.addEventListener("canplay", onCanPlay);
    v.play()?.catch(onError);
    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onError);
      v.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  const capitalizeWords = (phrase) => {
    const words = phrase.split(" ");
    if (words.length === 0) return phrase;
    return [
      words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase(),
      ...words.slice(1).map((word) => word.toLowerCase()),
    ].join(" ");
  };

  const hoursWords = [
    "nul","unu","du","tri","kvar","kvin","ses","sep","ok","naŭ","dek",
    "dek unu","dek du","dek tri","dek kvar","dek kvin","dek ses","dek sep",
    "dek ok","dek naŭ","dudek","dudek unu","dudek du","dudek tri"
  ];

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

  const containerStyle = {
    fontFamily: "'CustomFont', serif",
    width: "100vw",
    height: "100dvh",
    minHeight: "100dvh",
    position: "relative",
    overflow: "hidden",
    color: textAndOrnamentColor,
    zIndex: 1,
  };

  const videoStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
    filter: "saturate(0.5) brightness(1.9) contrast(0.5) sepia(0.2)",
  };

  const fallbackStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: videoFailed ? "block" : "none",
    zIndex: 0,
    filter: "sepia(0.3) contrast(0.4) brightness(1.9)",
  };

  const rowStyle = {
    position: "absolute",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90vw",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "4vh",
    whiteSpace: "nowrap",
    top: "0",
    textShadow: textAndOrnamentShadow,
    fontWeight: "normal", // ✅ explicitly ensure no bold
  };

  const numberStyle = { textAlign: "left", flexShrink: 0, fontWeight: "normal" };
  const labelStyle = { textAlign: "right", flexShrink: 0, fontWeight: "normal" };
  const dotsStyle = {
    flexGrow: 1,
    height: "1px",
    backgroundImage: `repeating-linear-gradient(to right, ${textAndOrnamentColor} 0 2px, transparent 2px 6px)`,
    margin: "0 1vw",
    opacity: 0.6,
    boxShadow: textAndOrnamentShadow,
  };

  const renderRow = (number, label, top) => (
    <div style={{ ...rowStyle, top }}>
      <div style={numberStyle}>{number}</div>
      <div style={dotsStyle} />
      <div style={labelStyle}>{label}</div>
    </div>
  );

  const frameStyle = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 2,
    border: "10px solid transparent",
    boxShadow: "inset 0 0 30px rgba(200,185,155,0.6), 0 0 40px rgba(0,0,0,0.7)",
  };

  const cornerImageStyle = {
    position: "absolute",
    width: "16vh",
    height: "auto",
    opacity: 0.6,
    // filter: `drop-shadow(${textAndOrnamentShadow}) sepia(0.3)`,
    tint: textAndOrnamentColor,
  };

  return (
    <div style={containerStyle}>
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
{/* Decorative Victorian Frame */}
<div className="victorian-frame" style={frameStyle}>
  <img
    src={cornerUL}
    alt="Victorian corner upper-left"
    style={{ ...cornerImageStyle, top: "0", left: "0", opacity: 0.6 }}
  />
  <img
    src={cornerLR}
    alt="Victorian corner lower-right"
    style={{ ...cornerImageStyle, bottom: "0", right: "0", opacity: 0.6 }}
  />
</div>

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

      <div style={fallbackStyle} aria-hidden={!videoFailed} />

      <div
        style={{
          position: "absolute",
          top: "8%",
          width: "100%",
          textAlign: "center",
          fontSize: "5vh",
          textShadow: textAndOrnamentShadow,
          fontWeight: "normal", // ✅ ensure heading not bold
        }}
      >
        Bonvenon al <br />la Esperanta <br />horloĝo!
      </div>

      {renderRow(hourWord, capitalizeWords("horoj"), "45%")}
      {renderRow(minuteWord, capitalizeWords("minutoj"), "60%")}
      {renderRow(secondWord, capitalizeWords("sekundoj"), "75%")}
    </div>
  );
}

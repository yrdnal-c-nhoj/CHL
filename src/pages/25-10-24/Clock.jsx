import React, { useRef, useEffect, useState } from "react";
import videoFile from "./esp.mp4";
import videoWebM from "./esp.webp";
import fallbackImg from "./esp.jpeg";
import fontFile251024 from "./esp.ttf";
import cornerUL from "./ul.webp";
import cornerLR from "./lr.webp";

export default function VictorianEsperantoClock() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());
  const textAndOrnamentColor = "#110116FF";
  const textAndOrnamentShadow = "-1px 1px 0px #F1E7D8FF";

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

  const hoursWords = [
    "nula", "unua", "dua", "tria", "kvara", "kvina", "sesa", "sepa", "oka", "naŭa", "deka",
    "dek unua", "dek dua", "dek tria", "dek kvara", "dek kvina", "dek sesa", "dek sepa",
    "dek oka", "dek naŭa", "dudeka", "dudek unua", "dudek dua", "dudek tria"
  ];

  const minutesAndSecondsWords = [
    "nul", "unu", "du", "tri", "kvar", "kvin", "ses", "sep", "ok", "naŭ", "dek",
    "dek unu", "dek du", "dek tri", "dek kvar", "dek kvin", "dek ses", "dek sep",
    "dek ok", "dek naŭ", "dudek", "dudek unu", "dudek du", "dudek tri", "dudek kvar",
    "dudek kvin", "dudek ses", "dudek sep", "dudek ok", "dudek naŭ", "tridek",
    "tridek unu", "tridek du", "tridek tri", "tridek kvar", "tridek kvin", "tridek ses",
    "tridek sep", "tridek ok", "tridek naŭ", "kvardek", "kvardek unu", "kvardek du",
    "kvardek tri", "kvardek kvar", "kvardek kvin", "kvardek ses", "kvardek sep",
    "kvardek ok", "kvardek naŭ", "kvindek", "kvindek unu", "kvindek du", "kvindek tri",
    "kvindek kvar", "kvindek kvin", "kvindek ses", "kvindek sep", "kvindek ok", "kvindek naŭ"
  ];

  const hourWord = hoursWords[time.getHours()];
  const minuteWord = minutesAndSecondsWords[time.getMinutes()];
  const secondWord = minutesAndSecondsWords[time.getSeconds()];

  const containerStyle = {
    fontFamily: "'CustomzzzFont', serif",
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
    opacity: 0.7,
    filter: "saturate(0.4) brightness(2.9) contrast(0.3) sepia(0.2) hue-rotate(-30deg)",
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
    opacity: 0.7,
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
    fontWeight: "normal",
  };

  const numberStyle = { textAlign: "left", flexShrink: 0, fontWeight: "normal" };
  const labelStyle = { textAlign: "right", flexShrink: 0, fontWeight: "normal" };

  const dotsStyle = {
    flexGrow: 1,
    height: "1px",
    backgroundImage: `repeating-linear-gradient(to right, ${textAndOrnamentColor} 0 2px, transparent 2px 6px)`,
    margin: "0 1vw",
    opacity: 0.6,
  };

  const renderRow = (number, label, top) => (
    <div style={{ ...rowStyle, top }}>
      <div style={numberStyle}>La {number}</div>
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
    tint: textAndOrnamentColor,
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @font-face {
            font-family: 'CustomzzzFont';
            src: url(${fontFile251024}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

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
    fontWeight: "normal",
    lineHeight: "1.2",
  }}
>
  Bonvenon al <br />
  via Esperanta Horloĝo!
</div>


      {renderRow(hourWord, "Horo", "40%")}
      {renderRow(minuteWord, "Minutoj", "55%")}
      {renderRow(secondWord, "Sekundoj", "70%")}
    </div>
  );
}

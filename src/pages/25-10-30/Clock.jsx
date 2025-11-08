/** @jsxImportSource react */
import { useEffect, useState } from "react";
import bgImage from "./turq.webp";
import clockFaceImage from "./tur.jpg";
import customFont2025_10_31 from "./turqs.ttf";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());
  const [ready, setReady] = useState(false);

  // Update clock smoothly
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(id);
  }, []);

  // Preload images and font
  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace("CustomFont2025_10_31", `url(${customFont2025_10_31})`);
        await font.load();
        document.fonts.add(font);
      } catch (err) {
        console.warn("Font failed to load:", err);
      }
    };

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });

    Promise.all([loadFont(), loadImage(bgImage), loadImage(clockFaceImage)])
      .then(() => setReady(true))
      .catch(() => setReady(true)); // still show even if some fail
  }, []);

  // Do not render until ready
  if (!ready)
    return (
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          backgroundColor: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#4ff",
          fontFamily: "sans-serif",
          letterSpacing: "0.2em",
        }}
      >
        
      </div>
    );

  // Time math
  const ms = time.getMilliseconds();
  const seconds = time.getSeconds() + ms / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;
  const radius = "min(50vh, 50vw)";
  const clockSize = `calc(2 * ${radius})`;

  // Style definitions
  const METALLIC = {
    background:
      "linear-gradient(135deg, #847979 0%, #C9C6C6 25%, #ffffff 50%, #C8C8C8 75%, #836F6F 100%)",
    boxShadow:
      "0 0.2vh 0.8vh rgba(0,0,0,0.3), inset -0.1vh 0 0.9vh rgba(255,255,255,0.9), inset 0.1vh 0 0.3vh rgba(0,0,0,0.9)",
  };
  const FILIGREE = {
    ...METALLIC,
    filter: "hue-rotate(190deg) saturate(0.5) brightness(1.1)",
  };

  const pageStyle = {
    width: "100vw",
    height: "100dvh",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    fontFamily: "'CustomFont2025_10_31', sans-serif",
    overflow: "hidden",
  };

  const bgStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "hue-rotate(-10deg) saturate(1.5) brightness(0.9) contrast(0.9)",
    zIndex: 0,
  };

  const wrapperStyle = {
    position: "relative",
    width: clockSize,
    height: clockSize,
    borderRadius: "50%",
    overflow: "hidden",
    zIndex: 1,
    backgroundImage: `url(${clockFaceImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(64,224,227,0.7)",
    borderRadius: "50%",
    zIndex: 1,
  };

  const handBase = (widthFrac, lengthFrac, deg, clipPath) => ({
    ...FILIGREE,
    position: "absolute",
    width: `calc(${widthFrac} * ${radius})`,
    height: `calc(${lengthFrac} * ${radius} * 2)`,
    left: "50%",
    top: "50%",
    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
    transformOrigin: "center bottom",
    clipPath,
    zIndex: 3,
  });

  const hourHand = handBase(
    0.1,
    0.28,
    hourDeg,
    "polygon(50% 0%, 75% 15%, 70% 50%, 90% 80%, 75% 100%, 25% 100%, 10% 80%, 30% 50%, 25% 15%)"
  );
  const minuteHand = handBase(
    0.06,
    0.4,
    minuteDeg,
    "polygon(50% 0%, 70% 5%, 60% 40%, 80% 70%, 60% 100%, 40% 100%, 20% 70%, 40% 40%, 30% 5%)"
  );
  const secondHand = {
    ...FILIGREE,
    position: "absolute",
    width: `calc(0.01 * ${radius})`,
    height: `calc(0.4375 * ${radius} * 2)`,
    left: "50%",
    top: "50%",
    transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
    transformOrigin: "center bottom",
    borderRadius: "0 0 0.2vh 0.2vh",
    zIndex: 3,
  };

  const centerCap = {
    ...FILIGREE,
    position: "absolute",
    width: `calc(0.12 * ${radius})`,
    height: `calc(0.12 * ${radius})`,
    borderRadius: "50%",
    top: `calc(50% - 0.06 * ${radius})`,
    left: `calc(50% - 0.06 * ${radius})`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  };

  const svgNumbers = (
    <svg
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 2,
        pointerEvents: "none",
      }}
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="numGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C7A7B" />
          <stop offset="25%" stopColor="#B0B4B4" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="75%" stopColor="#BBBEBE" />
          <stop offset="100%" stopColor="#777A79" />
        </linearGradient>
        <filter id="numShadow">
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.8" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      {Array.from({ length: 12 }, (_, i) => {
        const angle = i * 30 * (Math.PI / 180);
        const radiusPos = 38;
        const x = 50 + radiusPos * Math.sin(angle);
        const y = 50 - radiusPos * Math.cos(angle);
        const label = i === 0 ? "12" : i === 3 ? "3" : i === 6 ? "6" : i === 9 ? "9" : i.toString();

        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fontFamily="'CustomFont2025_10_31', serif"
            fill="url(#numGrad)"
            filter="url(#numShadow)"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );

  return (
    <>
      <div style={pageStyle}>
        <div style={bgStyle} />
        <div style={wrapperStyle}>
          <div style={overlayStyle} />
          {svgNumbers}
          <div style={hourHand} />
          <div style={minuteHand} />
          <div style={secondHand} />
          <div style={centerCap}></div>
        </div>
      </div>
    </>
  );
}

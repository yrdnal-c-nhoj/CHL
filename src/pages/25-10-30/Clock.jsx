/** @jsxImportSource react */
import React, { useEffect, useState } from "react";
import bgImage from "./turq.webp";
import customFont2025_10_31 from "./turqs.ttf";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  // --- Move radius and clockSize definition up! ---
  const radius = "min(40vh, 40vw)";
  const clockSize = `calc(2 * ${radius})`;
  // --------------------------------------------------

  const METALLIC_STYLE = {
    background:
      "linear-gradient(135deg, #8E8B8BFF 0%, #C9C6C6FF 25%, #ffffff 50%, #C8C8C8FF 75%, #9D9B9BFF 100%)",
    boxShadow:
      "0 0.2vh 0.8vh rgba(0,0,0,0.3), inset -0.1vh 0 0.3vh rgba(255,255,255,0.8), inset 0.1vh 0 0.3vh rgba(0,0,0,0.3)",
  };

  const FILIGREE_METALLIC_STYLE = {
    ...METALLIC_STYLE,
    // Add a slight blue tint for a 'Southwestern Silver' feel
    filter: "hue-rotate(190deg) saturate(0.5) brightness(1.1)",
  };

  // This style now correctly references the defined 'radius'
  const CenterJewelStyle = {
    position: "absolute",
    width: `calc(0.004 * ${radius})`,
    height: `calc(0.004 * ${radius})`,
    borderRadius: "50%",
    background: "radial-gradient(circle, #40E0D0 0%, #008B8B 70%)", // Turquoise gem
    boxShadow:
      "0 0 0.5vh rgba(0,255,255,0.4), inset 0 0 0.1vh rgba(255,255,255,0.9)",
    zIndex: 4,
    top: `calc(50% - 0.02 * ${radius})`, // Center it
    left: `calc(50% - 0.02 * ${radius})`,
  };

  const page = {
    width: "100vw",
    height: "100dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    fontFamily: "'CustomFont2025_10_31', sans-serif",
    overflow: "hidden",
  };

  const background = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "hue-rotate(-10deg) saturate(1.5) brightness(0.9) contrast(0.9)",
    zIndex: 0,
  };

  const wrapper = {
    position: "relative",
    width: clockSize,
    height: clockSize,
    borderRadius: "50%",
    overflow: "hidden",
    zIndex: 1, // sits above the background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const overlay = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(64,224,227,0.7)", // turquoise with 0.7 opacity
    borderRadius: "50%",
    zIndex: 1,
  };

  const number = (deg) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    fontSize: `calc(0.5 * ${radius})`,
    fontWeight: "bold",
    background: METALLIC_STYLE.background,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    filter: `drop-shadow(0 0.2vh 0.8vh rgba(0,0,0,0.3))`,
    userSelect: "none",
    transformOrigin: "center center",
    transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-100%) rotate(-${deg}deg)`,
    zIndex: 2, // above overlay
  });
  
  // Base Hand Style
  const ornateHand = (widthFrac, lengthFrac, deg, clipPath) => ({
    ...FILIGREE_METALLIC_STYLE,
    position: "absolute",
    width: `calc(${widthFrac} * ${radius})`,
    height: `calc(${lengthFrac} * ${radius})`,
    left: "50%",
    top: "50%",
    transformOrigin: "center top",
    transform: `translate(-50%, 0%) rotate(${deg}deg)`,
    clipPath: clipPath,
    zIndex: 3, // higher Z-index
  });
  
  // Hour Hand (Shorter, Fatter)
  const hourHandStyle = ornateHand(
    0.1, // widthFrac
    0.28, // lengthFrac
    hourDeg,
    // Ornate clipped shape (an arrowhead/lance)
    "polygon(50% 0%, 75% 15%, 70% 50%, 90% 80%, 75% 100%, 25% 100%, 10% 80%, 30% 50%, 25% 15%)"
  );
  
  // Minute Hand (Longer, Thinner)
  const minuteHandStyle = ornateHand(
    0.06, // widthFrac
    0.4, // lengthFrac
    minuteDeg,
    // Slightly thinner, longer ornate shape
    "polygon(50% 0%, 70% 5%, 60% 40%, 80% 70%, 60% 100%, 40% 100%, 20% 70%, 40% 40%, 30% 5%)"
  );

  // Second Hand (simple rod for legibility, but with the new metallic style)
  const secondHandStyle = {
    ...FILIGREE_METALLIC_STYLE,
    position: "absolute",
    width: `calc(0.01 * ${radius})`,
    height: `calc(0.4375 * ${radius})`,
    left: "50%",
    top: "50%",
    transformOrigin: "center top",
    transform: `translate(-50%, 0%) rotate(${secondDeg}deg)`,
    borderRadius: "0.2vh",
    zIndex: 3,
  };

  // Center Cap/Embellishment
  const centerCapStyle = {
    ...FILIGREE_METALLIC_STYLE,
    position: "absolute",
    width: `calc(0.12 * ${radius})`,
    height: `calc(0.12 * ${radius})`,
    borderRadius: "50%",
    zIndex: 5, // Sits on top of the hands
    top: `calc(50% - 0.06 * ${radius})`,
    left: `calc(50% - 0.06 * ${radius})`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'CustomFont2025_10_31';
            src: url(${customFont2025_10_31}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      <div style={page}>
        {/* Fullscreen filtered background */}
        <div style={background} />

        {/* Clock wrapper */}
        <div style={wrapper}>
          {/* Semi-transparent turquoise overlay on the clock face */}
          <div style={overlay} />

          {/* Numbers */}
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={number(i * 30)}>
              {i === 0 ? 12 : i}
            </div>
          ))}

          {/* Hands with new ornate shapes */}
          <div style={hourHandStyle} />
          <div style={minuteHandStyle} />
          <div style={secondHandStyle} />

          {/* Center Embellishment */}
          <div style={centerCapStyle}>
         
          </div>

        </div>
      </div>
    </>
  );
}
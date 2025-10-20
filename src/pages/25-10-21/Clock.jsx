// AnalogClock.jsx
import React, { useEffect, useRef, useState } from "react";
import venusFont from "./venus.ttf";
import faceImg from "./trees.jpg";

export default function AnalogClock() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const rafRef = useRef(null);

  // Load font and preload image
  useEffect(() => {
    let mounted = true;

    const fontFace = new FontFace("VenusFont", `url(${venusFont})`);
    fontFace.load().then((loaded) => {
      document.fonts.add(loaded);
      if (mounted) setFontLoaded(true);
    });

    const img = new Image();
    img.src = faceImg;

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Animate clock hands
  useEffect(() => {
    if (!fontLoaded) return;

    const update = () => {
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() % 12 + minutes / 60;

      if (hourRef.current)
        hourRef.current.style.transform = `translate(-50%, -100%) rotate(${(hours / 12) * 360}deg)`;
      if (minuteRef.current)
        minuteRef.current.style.transform = `translate(-50%, -100%) rotate(${(minutes / 60) * 360}deg)`;
      if (secondRef.current)
        secondRef.current.style.transform = `translate(-50%, -100%) rotate(${(seconds / 60) * 360}deg)`;

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [fontLoaded]);

  if (!fontLoaded) return null;

  const CLOCK_SIZE = 50; // vh
  const HAND_WIDTH = 1.6; // vh
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  // Number positions
  const numberStyle = (angle) => {
    const radiusPercent = 42;
    const rad = (angle - 90) * (Math.PI / 180);
    const x = 50 + radiusPercent * Math.cos(rad);
    const y = 50 + radiusPercent * Math.sin(rad);
    return {
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
      fontSize: "4vh",
      fontFamily: "VenusFont, sans-serif",
      color: "#fff",
      textShadow: "0 0 0.5rem rgba(0,0,0,0.6)",
      pointerEvents: "none",
      userSelect: "none",
    };
  };

  // Centered hand styles
  const handCommon = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "50% 100%",
    willChange: "transform",
  };

  const hourHandStyle = {
    ...handCommon,
    height: "28%",
    width: `${HAND_WIDTH}vh`,
    background: "#ffffffaa",
    borderRadius: "10px",
    boxShadow: "0 0 1vh #ffffff66",
  };

  const minuteHandStyle = {
    ...handCommon,
    height: "38%",
    width: `${HAND_WIDTH * 0.9}vh`,
    background: "#ffffffcc",
    borderRadius: "8px",
    boxShadow: "0 0 1vh #ffffff66",
  };

  const secondHandStyle = {
    ...handCommon,
    height: "44%",
    width: `${HAND_WIDTH * 0.45}vh`,
    background: "#ff6b6b",
    borderRadius: "4px",
    boxShadow: "0 0 1vh #ff6b6b66",
  };

  const containerStyle = {
    height: `${CLOCK_SIZE}vh`,
    width: `${CLOCK_SIZE}vh`,
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "3vh auto",
    position: "relative",
    boxSizing: "border-box",
  };

  const faceStyle = {
    height: "100%",
    width: "100%",
    borderRadius: "50%",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url(${faceImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#0f172a",
  };

  const centerCapStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "3.6vh",
    height: "3.6vh",
    borderRadius: "50%",
    background: "#111827",
    boxShadow: "0 0 1vh #00000055, inset 0 0 0.6vh #ffffff11",
  };

  const captionStyle = {
    fontFamily: "VenusFont, sans-serif",
    textAlign: "center",
    marginTop: "2vh",
    fontSize: "2.2vh",
    userSelect: "none",
    color: "#fff",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={containerStyle}>
        <div style={faceStyle}>
          {numbers.map((n, idx) => (
            <div key={n} style={numberStyle((idx / 12) * 360)}>
              {n}
            </div>
          ))}

          <div ref={hourRef} style={hourHandStyle} />
          <div ref={minuteRef} style={minuteHandStyle} />
          <div ref={secondRef} style={secondHandStyle} />
          <div style={centerCapStyle} />
        </div>
      </div>

      <div style={captionStyle}>
        Analog — {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}

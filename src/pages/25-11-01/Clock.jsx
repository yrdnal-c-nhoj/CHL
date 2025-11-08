/** @jsxImportSource react */
import React, { useEffect, useState } from "react";
import customFont from "./edgecase.ttf"; // 🟩 Local font

export default function EdgeClockWithHands() {
  const [time, setTime] = useState(new Date());
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [fontsReady, setFontsReady] = useState(false);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Choose a single color for numbers and hands
  const numberAndHandColor = "#EEF3D0FF";

  // Load custom font
  useEffect(() => {
    let didCancel = false;
    const font = new FontFace("CustomClockFont", `url(${customFont})`);
    font
      .load()
      .then((loadedFont) => {
        if (didCancel) return;
        document.fonts.add(loadedFont);
        document.fonts.load('1rem "CustomClockFont"').then(() => {
          if (!didCancel) setFontsReady(true);
        });
      })
      .catch(() => {
        if (!didCancel) setFontsReady(true);
      });
    const t = setTimeout(() => {
      if (!didCancel) setFontsReady(true);
    }, 1500);
    return () => {
      didCancel = true;
      clearTimeout(t);
    };
  }, []);

  // Continuous update for smooth hands
  useEffect(() => {
    const tick = () => {
      setTime(new Date());
      const id = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(id);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  // Track viewport size
  useEffect(() => {
    const updateSize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const centerX = viewport.width / 2;
  const centerY = viewport.height / 2;
  const margin = 1; // in vh units

  // Time calculations
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() % 12 + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  // Hands style with fixed pixel sizes
  const handStyle = (widthPx, lengthPx, color, rotation) => ({
    position: "absolute",
    width: `${widthPx}px`,
    height: `${lengthPx}px`,
    backgroundColor: "#F7F3F3FF",
    transformOrigin: "50% 100%",
    top: `${centerY - lengthPx}px`,
    left: `${centerX - widthPx / 2}px`,
    transform: `rotate(${rotation}deg)`,
    borderRadius: "2px",
    zIndex: 3,
  });

  // Place numbers slightly closer to the center
  const numberStyle = (num) => {
    const angle = (num - 3) * (Math.PI / 6);
    const dx = angle === 0 || angle === Math.PI ? centerX - margin * viewport.height / 100 : centerX / Math.abs(Math.cos(angle));
    const dy = angle === Math.PI / 2 || angle === -Math.PI / 2 ? centerY - margin * viewport.height / 100 : centerY / Math.abs(Math.sin(angle));
    const dist = Math.min(dx, dy) * 0.9;

    const x = centerX + Math.cos(angle) * dist;
    const y = centerY + Math.sin(angle) * dist;

    return {
      position: "absolute",
      left: `${x}px`,
      top: `${y}px`,
      transform: "translate(-50%, -50%)",
      fontSize: "4vh",
      color: numberAndHandColor,
      fontFamily: "CustomClockFont",
      zIndex: 2,
    };
  };

  // Rectangle dimensions: 50px smaller than viewport
  const rectWidth = viewport.width - 130;
  const rectHeight = viewport.height - 130;

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#05322DFF",
        border: "6px solid #72FF06FF", // Component border
        boxSizing: "border-box",
        opacity: fontsReady ? 1 : 0,
        transition: "opacity 0.2s ease-out",
      }}
    >
      {/* Yellow rectangle, 50px smaller than viewport, centered */}
      {viewport.width > 0 && (
        <div
          style={{
            position: "absolute",
            width: `${rectWidth}px`,
            height: `${rectHeight}px`,
            top: `${(viewport.height - rectHeight) / 2}px`, // Center vertically
            left: `${(viewport.width - rectWidth) / 2}px`, // Center horizontally
            border: "11px solid #1A3D02FF", // Yellow border
            boxSizing: "border-box",
            zIndex: 1, // Behind numbers and hands
          }}
        />
      )}

      {viewport.width > 0 &&
        numbers.map((n) => (
          <React.Fragment key={n}>
            <div style={numberStyle(n)}>{n}</div>
          </React.Fragment>
        ))}

      {/* Clock hands with fixed pixel sizes */}
      <div style={handStyle(6, 15, numberAndHandColor, hourDeg)} />
      <div style={handStyle(4, 20, numberAndHandColor, minuteDeg)} />
      <div style={handStyle(2, 25, numberAndHandColor, secondDeg)} />
    </div>
  );
}
/** @jsxImportSource react */
import React, { useEffect, useState } from "react";
import customFont from "./vp.ttf"; // 🟩 Local font

export default function EdgeClockWithHands() {
  const [time, setTime] = useState(new Date());
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Load custom font
  useEffect(() => {
    const font = new FontFace("CustomClockFont", `url(${customFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });
  }, []);

  // Continuous update for smooth hands
  useEffect(() => {
    const tick = () => {
      setTime(new Date());
      requestAnimationFrame(tick);
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
  const lineLength = Math.max(viewport.width, viewport.height) * 0.001;

  // Time calculations
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() % 12 + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  // Hands style
  const handStyle = (widthVh, lengthVh, color, rotation) => ({
    position: "absolute",
    width: `${widthVh}vh`,
    height: `${lengthVh}vh`,
    backgroundColor: color,
    transformOrigin: "50% 100%",
    top: `${centerY - (lengthVh / 100) * viewport.height}px`,
    left: `${centerX - (widthVh / 100) * viewport.height / 2}px`,
    transform: `rotate(${rotation}deg)`,
    borderRadius: "0.2vh",
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
      color: "#2D36BAFF",
      fontFamily: "CustomClockFont",
      zIndex: 2,
    };
  };


  return (
    <div style={{ width: "100vw", height: "100dvh", position: "relative", overflow: "hidden" }}>
      {viewport.width > 0 &&
        numbers.map((n) => (
          <React.Fragment key={n}>
            <div style={numberStyle(n)}>{n}</div>
          </React.Fragment>
        ))}

      {/* Clock hands */}
      <div style={handStyle(0.6, 25, "black", hourDeg)} />
      <div style={handStyle(0.4, 35, "black", minuteDeg)} />
      <div style={handStyle(0.2, 45, "red", secondDeg)} />
    </div>
  );
}

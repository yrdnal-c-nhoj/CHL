/** @jsxImportSource react */
import React, { useEffect, useState } from "react";

export default function EdgeClockWithHands() {
  const [time, setTime] = useState(new Date());
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
    const updateSize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const centerX = viewport.width / 2;
  const centerY = viewport.height / 2;
  const margin = 10; // px from edge
  const lineLength = Math.max(viewport.width, viewport.height) * 1.5;

  // Time calculations
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() % 12 + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  // Hands style
  const handStyle = (width, length, color, rotation) => ({
    position: "absolute",
    width: `${width}px`,
    height: `${length}px`,
    backgroundColor: color,
    transformOrigin: "50% 100%",
    top: `${centerY - length}px`,
    left: `${centerX - width / 2}px`,
    transform: `rotate(${rotation}deg)`,
    borderRadius: "2px",
  });

  // Place numbers slightly closer to the center
  const numberStyle = (num) => {
    const angle = (num - 3) * (Math.PI / 6);

    // distance to viewport edge
    const dx = angle === 0 || angle === Math.PI ? centerX - margin : centerX / Math.abs(Math.cos(angle));
    const dy = angle === Math.PI / 2 || angle === -Math.PI / 2 ? centerY - margin : centerY / Math.abs(Math.sin(angle));
    const dist = Math.min(dx, dy) * 0.85; // <-- scale inward (85% of original distance)

    const x = centerX + Math.cos(angle) * dist;
    const y = centerY + Math.sin(angle) * dist;

    return {
      position: "absolute",
      left: `${x}px`,
      top: `${y}px`,
      transform: "translate(-50%, -50%)",
      fontSize: "3vh",
      fontWeight: "bold",
      color: "black",
      zIndex: 2,
    };
  };

  // Draw lines from center to numbers, extending past viewport
  const lineStyle = (num) => {
    const angle = (num - 3) * (Math.PI / 6);
    const rotation = (angle * 180) / Math.PI;
    return {
      position: "absolute",
      width: `${lineLength}px`,
      height: "2px",
      backgroundColor: "gray",
      top: `${centerY}px`,
      left: `${centerX}px`,
      transformOrigin: "0% 50%",
      transform: `rotate(${rotation}deg)`,
      zIndex: 1,
    };
  };

  return (
    <div style={{ width: "100vw", height: "100dvh", position: "relative", overflow: "hidden" }}>
      {viewport.width > 0 &&
        numbers.map((n) => (
          <React.Fragment key={n}>
            <div style={lineStyle(n)} />
            <div style={numberStyle(n)}>{n}</div>
          </React.Fragment>
        ))}

      {/* Clock hands in the center */}
      <div style={handStyle(6, 50, "black", hourDeg)} />
      <div style={handStyle(4, 70, "black", minuteDeg)} />
      <div style={handStyle(2, 90, "red", secondDeg)} />
    </div>
  );
}

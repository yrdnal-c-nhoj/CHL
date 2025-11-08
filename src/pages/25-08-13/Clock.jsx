import { useEffect, useRef, useState } from "react";
import bgImage from "./bg.webp";
import secondBgImage from "./loop.webp";
import thirdBgImage from "./tiny.gif"; // new background image

export default function AnalogClock() {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Resize listener
  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Draw clock
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawClock = () => {
      const { width, height } = dimensions;
      canvas.width = width;
      canvas.height = height;

      const radius = Math.min(width, height) * 0.02;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(cx, cy);

      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;

      // Clock face
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#F4EEEEFF"; // white
      ctx.fill();
      ctx.closePath();

      // Numbers
      ctx.font = `${radius * 0.25}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000000"; // black
      for (let num = 1; num <= 12; num++) {
        const ang = (num * Math.PI) / 6;
        const x = radius * 0.8 * Math.sin(ang);
        const y = -radius * 0.8 * Math.cos(ang);
        ctx.fillText(num.toString(), x, y);
      }

      // Hands
      const drawHand = (angle, length, width, color) => {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(angle);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-angle);
      };

      drawHand((Math.PI / 6) * hr + (Math.PI / 360) * min, radius * 0.5, radius * 0.06, "#000000"); // black
      drawHand((Math.PI / 30) * min + (Math.PI / 1800) * sec, radius * 0.75, radius * 0.04, "#000000"); // black
      drawHand((Math.PI / 30) * sec, radius * 0.85, radius * 0.02, "#FF0000"); // red

      ctx.restore();
    };

    drawClock();
    const interval = setInterval(drawClock, 1000);
    return () => clearInterval(interval);
  }, [dimensions]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
        backgroundColor: "#DE0E0EFF", // black
      }}
    >
      {/* Background layer 1 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.7,
          zIndex: 1,
        }}
      />

      {/* Background layer 2 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${secondBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "overlay",
          opacity: 0.4,
          zIndex: 4,
        }}
      />

      {/* Background layer 3 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${thirdBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "overlay",
          // opacity: 0.9,
          zIndex: 3,
        }}
      />

      {/* Clock canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "relative",
          zIndex: 2, // always on top
          opacity: 1.0,
        }}
      />
    </div>
  );
}

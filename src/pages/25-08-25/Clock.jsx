import { useEffect, useRef, useState } from "react";
import bgImage from "./bg.webp";
import secondBgImage from "./loop.webp";

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

      const radius = Math.min(width, height) * 0.01;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height); // clear previous frame

      ctx.save();
      ctx.translate(cx, cy);

      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;

      // Draw white clock face circle
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();

      // Numbers
      ctx.font = `${radius * 0.25}px Arial`; // use Arial
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "black"; // numbers on white face
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

      drawHand((Math.PI / 6) * hr + (Math.PI / 360) * min, radius * 0.5, radius * 0.06, "black");
      drawHand((Math.PI / 30) * min + (Math.PI / 1800) * sec, radius * 0.75, radius * 0.04, "black");
      drawHand((Math.PI / 30) * sec, radius * 0.85, radius * 0.02, "red");

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
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial", // Arial for fallback text
        backgroundColor: "black",
      }}
    >
      {/* Background layer 1 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
        }}
      />

      {/* Background layer 2 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${secondBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "overlay",
          opacity: 0.6,
        }}
      />

      {/* Clock canvas on top */}
      <canvas
        ref={canvasRef}
        style={{
          position: "relative",
          zIndex: 2,
          opacity: 1.0,
        }}
      />
    </div>
  );
}

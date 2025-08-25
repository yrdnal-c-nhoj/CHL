import { useEffect, useRef, useState } from "react";
import bgImage from "./bg.webp";
import digitFont from "./sq.ttf";

export default function AnalogClock() {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Resize listener
  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inject custom font
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: "DigitFont";
        src: url(${digitFont}) format("truetype");
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawClock = () => {
      const { width, height } = dimensions;
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      // Make radius scale with viewport (clock fills screen proportionally)
      const radius = Math.min(width, height) * 0.05;
      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      ctx.translate(cx, cy);

      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;

      // Clock face
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fill();
      ctx.lineWidth = radius * 0.03;
      ctx.stroke();

      // Numbers (red + bigger font)
      ctx.font = `${radius * 0.25}px DigitFont`; // bigger numbers
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#0B0A0AFF";
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

      drawHand(
        (Math.PI / 6) * hr + (Math.PI / 360) * min,
        radius * 0.5,
        radius * 0.06,
        "black"
      ); // hour
      drawHand(
        (Math.PI / 30) * min + (Math.PI / 1800) * sec,
        radius * 0.75,
        radius * 0.04,
        "black"
      ); // minute
      drawHand((Math.PI / 30) * sec, radius * 0.85, radius * 0.02, "red"); // second

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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "DigitFont",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

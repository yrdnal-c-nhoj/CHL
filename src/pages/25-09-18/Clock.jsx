import React, { useEffect, useRef } from "react";
import matrixFont from "./matrix.ttf"; // Your Matrix-style font

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Inject font
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: 'MatrixFont';
        src: url(${matrixFont}) format('truetype');
      }
    `;
    document.head.appendChild(style);

    const resizeCanvas = () => {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
    };
    resizeCanvas();

    // Characters to use in the rain (digits + letters + AM/PM)
    const getTimeChars = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const timeStr =
        hours.toString().padStart(2, "0") +
        minutes.toString().padStart(2, "0") +
        ampm;
      return timeStr.split("");
    };

    let fontSize = Math.max(44, canvas.width / 40);
    let columns = Math.floor(canvas.width / fontSize);

    // Initialize drops
    const drops = [];
    const initDrops = () => {
      const chars = getTimeChars();
      for (let i = 0; i < columns; i++) {
        drops[i] = {
          y: Math.random() * canvas.height,
          speed: 1 + Math.random() * 0.5,
          length: Math.random() * 20 + 15,
          chars: Array(30).fill().map(() => chars[Math.floor(Math.random() * chars.length)]),
          timeChar: chars[i % chars.length],
        };
      }
    };
    initDrops();

    let animationId;
    let frameCount = 0;

    const draw = () => {
      frameCount++;

      // Semi-transparent black background to create fading trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'MatrixFont', monospace`;
      ctx.textAlign = "center";

      if (frameCount % 120 === 0) {
        const chars = getTimeChars();
        drops.forEach((drop, i) => {
          drop.timeChar = chars[i % chars.length];
          drop.chars = drop.chars.map(() => chars[Math.floor(Math.random() * chars.length)]);
        });
      }

      drops.forEach((drop, i) => {
        for (let j = 0; j < drop.length; j++) {
          let y = drop.y - j * fontSize;

          // Wrap Y position so the column is always full
          if (y > canvas.height) y -= canvas.height + drop.length * fontSize;
          if (y < -fontSize) y += canvas.height + drop.length * fontSize;

          const char = j === 0 ? drop.timeChar : drop.chars[j % drop.chars.length];
          const alpha = 1 - j / drop.length;

          if (j === 0) {
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#00ff41";
            ctx.shadowBlur = 15;
          } else {
            ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.shadowColor = "#00ff41";
            ctx.shadowBlur = 6;
          }

          ctx.fillText(char, i * fontSize + fontSize / 2, y);
          ctx.shadowBlur = 0;
        }

        drop.y += drop.speed;

        // Recycle characters seamlessly at the top
        if (drop.y > canvas.height + drop.length * fontSize) {
          drop.y -= canvas.height + drop.length * fontSize;
          const chars = getTimeChars();
          drop.chars = drop.chars.map(() => chars[Math.floor(Math.random() * chars.length)]);
          drop.timeChar = chars[i % chars.length];
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resizeCanvas();
      fontSize = Math.max(44, canvas.width / 40);
      columns = Math.floor(canvas.width / fontSize);

      const chars = getTimeChars();
      while (drops.length < columns) {
        const i = drops.length;
        drops.push({
          y: Math.random() * canvas.height,
          speed: 1 + Math.random() * 0.5,
          length: Math.random() * 20 + 15,
          chars: Array(30).fill().map(() => chars[Math.floor(Math.random() * chars.length)]),
          timeChar: chars[i % chars.length],
        });
      }
      if (drops.length > columns) drops.length = columns;
    };

    window.addEventListener("resize", handleResize);
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        background: "#000000",
        width: "100vw",
        height: "100dvh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

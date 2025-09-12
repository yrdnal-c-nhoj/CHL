import React, { useEffect, useRef } from "react";
import dateFont from "./swi.ttf";
import bgImageSrc from "./bg.gif";

const GoldenChordsClock = () => {
  const canvasRef = useRef(null);

  const R = 180; 
  const phi = 1.618;
  const chordLength = Math.min(R * phi, 2 * R);
  const numChords = 12;
  let rotation = 0;
  let bgRotation = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const fontName = `CustomFont_${Date.now()}`;
    const font = new FontFace(fontName, `url(${dateFont})`);
    font.load().then((loadedFont) => document.fonts.add(loadedFont));

    const bgImage = new Image();
    bgImage.src = bgImageSrc;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 400;

      // --- ROTATING BACKGROUND ---
      if (bgImage.complete) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(bgRotation);
        const imgScale = Math.max(canvas.width / bgImage.width, canvas.height / bgImage.height);
        ctx.drawImage(
          bgImage,
          -bgImage.width / 2 * imgScale,
          -bgImage.height / 2 * imgScale,
          bgImage.width * imgScale,
          bgImage.height * imgScale
        );
        ctx.restore();
        bgRotation -= 0.0002;
      }

      // --- GOLDEN CHORDS (transparent on top) ---
      for (let i = 0; i < numChords; i++) {
        const angleOffset = rotation + (i * 2 * Math.PI) / numChords;
        const halfChordAngle = Math.asin(chordLength / (2 * R));
        const x1 = centerX + R * Math.cos(angleOffset - halfChordAngle) * scale;
        const y1 = centerY + R * Math.sin(angleOffset - halfChordAngle) * scale;
        const x2 = centerX + R * Math.cos(angleOffset + halfChordAngle) * scale;
        const y2 = centerY + R * Math.sin(angleOffset + halfChordAngle) * scale;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, "#FFD700");
        grad.addColorStop(0.3, "#FFEA70");
        grad.addColorStop(0.7, "#FFD700");
        grad.addColorStop(1, "#FFFACD");

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5 * scale;
        ctx.shadowColor = "#FFE65C";
        ctx.shadowBlur = 12 * scale;
        ctx.stroke();

        for (let j = 0; j < 3; j++) {
          const t = Math.random() * 0.8 + 0.1;
          const sparkX = x1 + (x2 - x1) * t;
          const sparkY = y1 + (y2 - y1) * t;
          const sparkRadius = Math.random() * 2 + 1;

          ctx.beginPath();
          ctx.arc(sparkX, sparkY, sparkRadius * scale, 0, 2 * Math.PI);
          ctx.fillStyle = "#FFFACD";
          ctx.shadowBlur = 15 * scale;
          ctx.fill();
        }
      }

      rotation += 0.0005;

      // --- CLOCK ---
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() % 12 + minutes / 60;
      const clockRadius = R * 0.6 * scale;

      // Clock numbers
      ctx.fillStyle = "#DA1717FF";
      ctx.font = `${2 * scale}rem ${fontName}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let num = 1; num <= 12; num++) {
        const ang = (num * Math.PI) / 6;
        const x = centerX + Math.sin(ang) * (clockRadius * 0.85);
        const y = centerY - Math.cos(ang) * (clockRadius * 0.85);
        ctx.fillText(num.toString(), x, y);
      }

      const drawHand = (angle, length, width, color) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.sin(angle) * length,
          centerY - Math.cos(angle) * length
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.stroke();
      };

      drawHand((hours * 2 * Math.PI) / 12, clockRadius * 0.5, 4 * scale, "#DA1717FF");
      drawHand((minutes * 2 * Math.PI) / 60, clockRadius * 0.7, 2.5 * scale, "#E4E4DDFF");
      drawHand((seconds * 2 * Math.PI) / 60, clockRadius * 0.9, 1.5 * scale, "#FFAA33FF");

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100vw", height: "100dvh", display: "block" }}
    />
  );
};

export default GoldenChordsClock;

import React, { useEffect, useRef } from "react";
import dateFont from "./swi.ttf";
import bgImageSrc from "./bg.gif";

const GoldenChordsClock = () => {
  const canvasRef = useRef(null);

  const R = 180;
  const chordLength = 1.8 * R;
  const numChords = 12;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load custom font
    const fontName = `CustomFont_${Date.now()}`;
    const font = new FontFace(fontName, `url(${dateFont})`);
    font.load().then((loadedFont) => document.fonts.add(loadedFont));

    // Load rotating background image
    const bgImage = new Image();
    bgImage.src = bgImageSrc;

    bgImage.onload = () => requestAnimationFrame(draw);

    const draw = () => {
      const now = new Date();
      const elapsedSeconds = now.getSeconds() + now.getMilliseconds() / 1000;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 400;

      // --- SHIMMERING GOLD BACKGROUND ---
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(
        0,
        `hsl(${50 + 10 * Math.sin(elapsedSeconds)}, 100%, 50%)`
      );
      gradient.addColorStop(
        0.5,
        `hsl(${50 + 15 * Math.cos(elapsedSeconds)}, 90%, 60%)`
      );
      gradient.addColorStop(
        1,
        `hsl(${50 + 20 * Math.sin(elapsedSeconds * 1.5)}, 100%, 55%)`
      );
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- ROTATING BACKGROUND IMAGE ---
      if (bgImage.complete) {
        const bgRotation = (elapsedSeconds * Math.PI) / 60;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(bgRotation);

        ctx.filter = "contrast(1.0) brightness(0.7) saturate(1.1)";
        const imgScale =
          0.8 *
          Math.max(canvas.width / bgImage.width, canvas.height / bgImage.height);
        ctx.drawImage(
          bgImage,
          (-bgImage.width / 2) * imgScale,
          (-bgImage.height / 2) * imgScale,
          bgImage.width * imgScale,
          bgImage.height * imgScale
        );
        ctx.restore();
        ctx.filter = "none";
      }

      // --- GOLDEN CHORDS ---
      const chordRotation = -(elapsedSeconds * 2 * Math.PI) / 60;
      const halfChordAngle = Math.asin(Math.min(1, chordLength / (2 * R)));

      for (let i = 0; i < numChords; i++) {
        const angleOffset = chordRotation + (i * 2 * Math.PI) / numChords;
        const x1 = centerX + R * Math.cos(angleOffset - halfChordAngle) * scale;
        const y1 = centerY + R * Math.sin(angleOffset - halfChordAngle) * scale;
        const x2 = centerX + R * Math.cos(angleOffset + halfChordAngle) * scale;
        const y2 = centerY + R * Math.sin(angleOffset + halfChordAngle) * scale;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, "#FFD700");
        grad.addColorStop(0.2, "#FFF5B7");
        grad.addColorStop(0.5, "#FFFFFF");
        grad.addColorStop(0.8, "#FFE135");
        grad.addColorStop(1, "#FFD700");

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.5 * scale;
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 30 * scale;
        ctx.stroke();

        // extra sparks
        for (let j = 0; j < 8; j++) {
          const t = Math.random();
          const sparkX = x1 + (x2 - x1) * t;
          const sparkY = y1 + (y2 - y1) * t;
          const sparkRadius = Math.random() * 3 + 1.5;

          ctx.beginPath();
          ctx.arc(sparkX, sparkY, sparkRadius * scale, 0, 2 * Math.PI);
          ctx.fillStyle = "#ECD330FF";
          ctx.shadowColor = "#EBE3B6FF";
          ctx.shadowBlur = 25 * scale;
          ctx.fill();
        }
      }

      // --- CLOCK HANDS ---
      const minutes = now.getMinutes() + elapsedSeconds / 60;
      const hours = now.getHours() % 12 + minutes / 60;
      const clockRadius = R * 0.6 * scale;

      
      const drawHand = (angle, length, width, color) => {
  ctx.save();
  ctx.globalAlpha = 0.6; // lines semi-transparent
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
  ctx.restore();
};



      drawHand((hours * 2 * Math.PI) / 12, clockRadius * 1.0, 8 * scale, "#7E7C7FFF");
      drawHand((minutes * 2 * Math.PI) / 60, clockRadius * 1.5, 4.5 * scale, "#7E7C7FFF");

      requestAnimationFrame(draw);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100vw", height: "100dvh", display: "block" }} />;
};

export default GoldenChordsClock;

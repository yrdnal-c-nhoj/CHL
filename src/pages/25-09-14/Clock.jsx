import React, { useEffect, useRef } from "react";
import dateFont from "./swi.ttf";
import bgImageSrc from "./bg.gif";

const GoldenChordsClock = () => {
  const canvasRef = useRef(null);

  const R = 180;
  const chordLength = 1.9 * R;
  const numChords = 12;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load custom font
    const fontName = `CustomFont_${Date.now()}`;
    const font = new FontFace(fontName, `url(${dateFont})`);
    font.load().then((loadedFont) => document.fonts.add(loadedFont));

    // Load background image
    const bgImage = new Image();
    bgImage.src = bgImageSrc;

    const draw = () => {
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() % 12 + minutes / 60;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 400;

      // --- STATIC GOLD BACKGROUND ---
      ctx.fillStyle = "hsl(50, 100%, 40%)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- ROTATING BACKGROUND IMAGE ---
      if (bgImage.complete) {
        const bgRotation = ((seconds % 60) / 60) * 2 * Math.PI;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(bgRotation);
        ctx.filter = "contrast(1.1) brightness(1.2) saturate(1.6)";
        const imgScale =
          0.8 * Math.max(canvas.width / bgImage.width, canvas.height / bgImage.height);
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

      // --- CLOCK HANDS ---
      const clockRadius = R * 0.6 * scale;
      const drawHand = (angle, length, width, color) => {
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.shadowColor = "rgba(24, 28, 26, 0.8)";
        ctx.shadowBlur = 4 * scale;
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

      drawHand((hours * 2 * Math.PI) / 12, clockRadius * 1.0, 8 * scale, "#F1EB6BFF");
      drawHand((minutes * 2 * Math.PI) / 60, clockRadius * 1.5, 4.5 * scale, "#F1EB6BFF");

      // --- GOLDEN CHORDS PULLED TOWARD CENTER ---
      const chordRotation = -(seconds * 2 * Math.PI) / 60;
      const halfChordAngle = Math.asin(Math.min(1, chordLength / (2 * R)));
      const extension = Math.max(canvas.width, canvas.height) * 1.5;

      // offsetFactor: 0 = exact center, 1 = original starting point (further out)
      const offsetFactor = 0.28; // smaller = closer to center

      for (let i = 0; i < numChords; i++) {
        const angleOffset = chordRotation + (i * 2 * Math.PI) / numChords;

        const startX = centerX + Math.cos(angleOffset - halfChordAngle) * extension * offsetFactor;
        const startY = centerY + Math.sin(angleOffset - halfChordAngle) * extension * offsetFactor;
        const endX = centerX + Math.cos(angleOffset + halfChordAngle) * extension;
        const endY = centerY + Math.sin(angleOffset + halfChordAngle) * extension;

        const grad = ctx.createLinearGradient(startX, startY, endX, endY);
        grad.addColorStop(0, "rgba(255, 215, 0, 1)");
        grad.addColorStop(0.25, "rgba(255, 224, 102, 0.9)");
        grad.addColorStop(0.5, "rgba(255, 248, 176, 0.7)");
        grad.addColorStop(0.75, "rgba(255, 224, 10, 0.9)");
        grad.addColorStop(1, "rgba(255, 215, 0, 1)");

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 4 * scale;
        ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
        ctx.shadowBlur = 60 * scale;
        ctx.stroke();
        ctx.restore();

        // Reflection
        const reflectionGrad = ctx.createLinearGradient(startX, startY, endX, endY);
        reflectionGrad.addColorStop(0, "rgba(255,255,255,0.6)");
        reflectionGrad.addColorStop(0.5, "rgba(255,255,255,0.2)");
        reflectionGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = reflectionGrad;
        ctx.lineWidth = 1.5 * scale;
        ctx.stroke();
        ctx.restore();
      }

      requestAnimationFrame(draw);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    requestAnimationFrame(draw);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100vw", height: "100dvh", display: "block" }} />;
};

export default GoldenChordsClock;

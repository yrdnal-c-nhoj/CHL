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

    let startTime = performance.now();

    const draw = (time) => {
      const elapsed = (time - startTime) / 1000;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 400;

      // --- SHIMMERING GOLD BACKGROUND ---
      const shimmer = 5 * Math.sin(elapsed * 5);
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${50 + shimmer}, 100%, 50%)`);
      gradient.addColorStop(0.5, `hsl(${50 + shimmer * 1.2}, 90%, 60%)`);
      gradient.addColorStop(1, `hsl(${50 + shimmer * 1.5}, 100%, 55%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- ROTATING BACKGROUND IMAGE (1 rev per 60s) ---
      if (bgImage.complete) {
        const bgRotation = ((elapsed % 60) / 60) * 2 * Math.PI;
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

      // --- CLOCK HANDS ---
      const minutes = new Date().getMinutes() + (elapsed % 60) / 60;
      const hours = new Date().getHours() % 12 + minutes / 60;
      const clockRadius = R * 0.6 * scale;

      const drawHand = (angle, length, width, color) => {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.shadowColor = "rgba(24, 28, 26)";
        ctx.shadowBlur = 3 * scale;
        ctx.shadowOffsetX = 0.1 * scale;
        ctx.shadowOffsetY = 0.1 * scale;

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

      drawHand(
        (hours * 2 * Math.PI) / 12,
        clockRadius * 1.0,
        8 * scale,
        "#F1EB6BFF"
      );
      drawHand(
        (minutes * 2 * Math.PI) / 60,
        clockRadius * 1.5,
        4.5 * scale,
        "#F1EB6BFF"
      );

      // --- GOLDEN CHORDS (drawn ABOVE hands, transparent) ---
      const chordRotation = -(elapsed * 2 * Math.PI) / 60;
      const halfChordAngle = Math.asin(Math.min(1, chordLength / (2 * R)));

      for (let i = 0; i < numChords; i++) {
        const angleOffset = chordRotation + (i * 2 * Math.PI) / numChords;
        const x1 = centerX + R * Math.cos(angleOffset - halfChordAngle) * scale;
        const y1 = centerY + R * Math.sin(angleOffset - halfChordAngle) * scale;
        const x2 = centerX + R * Math.cos(angleOffset + halfChordAngle) * scale;
        const y2 = centerY + R * Math.sin(angleOffset + halfChordAngle) * scale;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, "rgba(255, 215, 0)");
        grad.addColorStop(0.25, "rgba(255, 224, 102)");
        grad.addColorStop(0.5, "rgba(255, 248, 176)");
        grad.addColorStop(0.75, "rgba(255, 224, 10)");
        grad.addColorStop(1, "rgba(255, 215, 0)");

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 4 * scale;
        ctx.shadowColor = "rgba(255, 215, 0)";
        ctx.shadowBlur = 50 * scale;
        ctx.stroke();
        ctx.restore();

        const reflectionGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        reflectionGrad.addColorStop(0, "rgba(255,255,255)");
        reflectionGrad.addColorStop(0.5, "rgba(255,255,255)");
        reflectionGrad.addColorStop(1, "rgba(255,255,255)");

        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
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

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100vw", height: "100dvh", display: "block" }}
    />
  );
};

export default GoldenChordsClock;

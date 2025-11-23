// AnalogClock.jsx
import React, { useRef, useEffect, useState } from "react";
import videoFile from "./sput.mp4";        // Your looping background video
import myFont from "./day.ttf";             // Your custom font
import sputnikPng from "./sputnik.png";     // Your Sputnik second hand image

const FONT_FAMILY = "MyClockFont_20251123";
const fontUrl = new URL(myFont, import.meta.url).href;

export default function AnalogClock() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);
  const sputnikImg = useRef(null);        // Preloaded image
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load custom font exactly like your PixelInverseClock
  useEffect(() => {
    const font = new FontFace(FONT_FAMILY, `url(${fontUrl})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
      setFontLoaded(true);
    });
  }, []);

  // Preload the Sputnik image once
  useEffect(() => {
    const img = new Image();
    img.src = sputnikPng;
    img.onload = () => {
      sputnikImg.current = img;
    };
  }, []);

  useEffect(() => {
    if (!fontLoaded || !sputnikImg.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.imageSmoothingEnabled = false; // Crisp pixels

    const video = videoRef.current;

    // Resize canvas to full window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const clockRadius = Math.min(w, h) * 0.35; // ~70% of smallest dimension

      // Draw full-screen video background
      ctx.drawImage(video, 0, 0, w, h);

      // Optional subtle dark overlay for contrast
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, 0, w, h);

      const now = new Date();
      const sec = now.getSeconds() + now.getMilliseconds() / 1000;
      const min = now.getMinutes() + sec / 60;
      const hr = (now.getHours() % 12) + min / 60;

      // === NUMBERS ===
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${clockRadius * 0.16}px "${FONT_FAMILY}", sans-serif`;

      for (let i = 1; i <= 12; i++) {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * clockRadius * 0.82;
        const y = cy + Math.sin(angle) * clockRadius * 0.82;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(i === 12 ? "12" : i.toString(), 0, 0);
        ctx.restore();
      }

      // === HOUR HAND ===
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = clockRadius * 0.06;
      ctx.lineCap = "round";
      const hourAngle = (hr * 30) * Math.PI / 180 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(hourAngle) * clockRadius * 0.5,
        cy + Math.sin(hourAngle) * clockRadius * 0.5
      );
      ctx.stroke();

      // === MINUTE HAND ===
      ctx.strokeStyle = "#dddddd";
      ctx.lineWidth = clockRadius * 0.04;
      const minuteAngle = (min * 6) * Math.PI / 180 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(minuteAngle) * clockRadius * 0.8,
        cy + Math.sin(minuteAngle) * clockRadius * 0.8
      );
      ctx.stroke();

      // === SPUTNIK SECOND HAND (PNG) ===
      const secondAngle = (sec * 6) * Math.PI / 180 - Math.PI / 2;
      const handLength = clockRadius * 1.7;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(secondAngle);
      ctx.drawImage(
        sputnikImg.current,
        -handLength * 0.5,          // center the image horizontally
        -sputnikImg.current.height / 2,
        handLength,
        sputnikImg.current.height * (handLength / sputnikImg.current.width)
      );
      ctx.restore();

      // === CENTER DOT ===
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, clockRadius * 0.05, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    video.play().catch(() => {});
    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
    };
  }, [fontLoaded]);

  return (
    <>
      {/* Full-screen canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          display: "block",
          zIndex: 1,
          touchAction: "none",
        }}
      />

      {/* Hidden video source */}
      <video
        ref={videoRef}
        src={videoFile}
        muted
        loop
        playsInline
        preload="auto"
        style={{ display: "none" }}
      />
    </>
  );
}
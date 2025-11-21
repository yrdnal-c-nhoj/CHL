// PixelInverseClock.jsx
import React, { useRef, useEffect, useState } from "react";
import videoFile from "./day.mp4";
import myFont from "./day.ttf";

const FONT_FAMILY = "MyClockFont_20251120";
const fontUrl = new URL(myFont, import.meta.url).href;

export default function PixelInverseClock() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load the custom font
  useEffect(() => {
    const font = new FontFace(FONT_FAMILY, `url(${fontUrl})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
      setFontLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!fontLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    // ❗ ABSOLUTE CRITICAL — NO BLUR
    ctx.imageSmoothingEnabled = false;

    const video = videoRef.current;

    // Resize canvas ONLY on resize, never per-frame
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    const CLOCK_SCALE = 0.5;

    const getPixel = (x, y, w, data) => {
      const i = (Math.floor(y) * w + Math.floor(x)) * 4;
      return { r: data[i], g: data[i + 1], b: data[i + 2] };
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // STRETCH VIDEO EXACTLY (no crop, no bars)
      // Draw the video mirrored horizontally, but keep subsequent
      // drawing (numbers/hands) in normal orientation.
      ctx.save();
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, w, h);
      ctx.restore();

      // Get background pixels for inverse sampling
      const image = ctx.getImageData(0, 0, w, h);
      const data = image.data;

      const now = new Date();
      const sec = now.getSeconds() + now.getMilliseconds() / 1000;
      const min = now.getMinutes() + sec / 60;
      const hr = (now.getHours() % 12) + min / 60;

      const radius = Math.min(w, h) * CLOCK_SCALE * 0.5;

      // TEXT SETTINGS
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${radius * 0.3}px "${FONT_FAMILY}", sans-serif`;

      // ===== NUMBERS =====
      const offset = radius * 0.85;
      for (let n = 1; n <= 12; n++) {
        const angle = (n / 12) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * offset;
        const y = cy + Math.sin(angle) * offset;

        const p = getPixel(x, y, w, data);
        ctx.fillStyle = `rgb(${255 - p.r},${255 - p.g},${255 - p.b})`;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(n.toString().padStart(2, "0"), 0, 0);
        ctx.restore();
      }

      // ===== HANDS =====
      const drawHand = (len, thick, ang) => {
        const x = cx + Math.cos(ang) * len;
        const y = cy + Math.sin(ang) * len;

        const p = getPixel(x, y, w, data);
        ctx.strokeStyle = `rgb(${255 - p.r},${255 - p.g},${255 - p.b})`;
        ctx.lineWidth = Math.max(1, radius * thick);
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();
      };

      // Subtract Math.PI/2 so 0 points to 12 o'clock (top of dial)
      drawHand(radius * 0.46, 0.04, (hr * Math.PI) / 6 - Math.PI / 2);       // Hour
      drawHand(radius * 1.0, 0.025, (min * Math.PI) / 30 - Math.PI / 2);     // Minute
      drawHand(radius * 1.4, 0.012, (sec * Math.PI) / 30 - Math.PI / 2);     // Second

      // CENTER DOT
      const center = getPixel(cx, cy, w, data);
      ctx.fillStyle = `rgb(${255 - center.r},${255 - center.g},${255 - center.b})`;

      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.06, 0, Math.PI * 2);
      ctx.fill();

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
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          display: "block",
          zIndex: 1,
          filter: "saturate(3) contrast(1.5) brightness(0.8)",
          touchAction: "none",
        }}
      />

      <video
        ref={videoRef}
        src={videoFile}
        muted
        loop
        playsInline
        style={{
          display: "none",
          imageRendering: "pixelated",   // <-- critical for crispness
        }}
      />
    </>
  );
}

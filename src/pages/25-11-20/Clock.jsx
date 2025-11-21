// PixelInverseClock.jsx
import React, { useRef, useEffect, useState } from "react";
import videoFile from "./day.mp4";
import myFont from "./day.ttf";

const FONT_FAMILY = "MyClockFont_20251120";
const fontUrl = new URL(myFont, import.meta.url).href;

export default function PixelInverseClock() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load custom font
  useEffect(() => {
    const font = new FontFace(FONT_FAMILY, `url(${fontUrl})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!fontLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = videoRef.current;
    let animationFrame;

    const drawClock = () => {
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.36;

      // Draw video frame
      ctx.drawImage(video, 0, 0, w, h);

      // Grab pixel data for inversion
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const getPixel = (x, y) => {
        const i = (Math.floor(y) * w + Math.floor(x)) * 4;
        return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
      };

      // Draw radially aligned numbers with pixel inversion
      const numberOffset = radius * 0.85;
      ctx.font = `${radius * 0.3}px "${FONT_FAMILY}", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let n = 1; n <= 12; n++) {
        const angle = (n / 12) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * numberOffset;
        const y = cy + Math.sin(angle) * numberOffset;

        const pixel = getPixel(x, y);
        const invColor = `rgb(${255 - pixel.r}, ${255 - pixel.g}, ${255 - pixel.b})`;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2); // rotate so digit is radial
        ctx.fillStyle = invColor;
        ctx.fillText(n.toString().padStart(2, "0"), 0, 0);
        ctx.restore();
      }

      // Draw clock hands pixel-inverted
      const drawHand = (length, width, angleRad) => {
        const x = cx + Math.cos(angleRad) * length;
        const y = cy + Math.sin(angleRad) * length;

        const pixel = getPixel(x, y);
        const invColor = `rgb(${255 - pixel.r}, ${255 - pixel.g}, ${255 - pixel.b})`;

        ctx.strokeStyle = invColor;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();
      };

      drawHand(radius * 0.5, radius * 0.03, hours * Math.PI / 6);
      drawHand(radius * 1.1, radius * 0.02, minutes * Math.PI / 30);
      drawHand(radius * 1.4, radius * 0.01, seconds * Math.PI / 30);

      // Draw center dot pixel-inverted
      const centerPixel = getPixel(cx, cy);
      const centerColor = `rgb(${255 - centerPixel.r}, ${255 - centerPixel.g}, ${255 - centerPixel.b})`;
      ctx.fillStyle = centerColor;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.05, 0, Math.PI * 2);
      ctx.fill();

      animationFrame = requestAnimationFrame(drawClock);
    };

    video.play().catch(() => {});
    drawClock();

    return () => cancelAnimationFrame(animationFrame);
  }, [fontLoaded]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100vw", height: "100vh" }}
      />
      <video
        ref={videoRef}
        src={videoFile}
        style={{ display: "none" }}
        muted
        loop
        autoPlay
        playsInline
      />
    </>
  );
}

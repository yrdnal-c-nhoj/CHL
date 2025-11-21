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

    // ensure canvas fills the actual viewport (and updates on resize/orientation)
    const resizeCanvas = () => {
      const w = Math.floor(window.innerWidth);
      const h = Math.floor(window.innerHeight);
      // set CSS size to exact viewport pixels to avoid layout rounding/offsets
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      // set internal pixel buffer to match CSS pixels (no DPR upscale here)
      canvas.width = w;
      canvas.height = h;
    };

    const getPixel = (x, y, w, data) => {
      const i = (Math.floor(y) * w + Math.floor(x)) * 4;
      return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
    };

    const drawClock = () => {
      resizeCanvas(); // keep in sync each frame (cheap)
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.36;

      // draw current video frame stretched to cover the canvas
      ctx.drawImage(video, 0, 0, w, h);

      // grab pixel data (device pixels)
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // numbers
      const numberOffset = radius * 0.85;
      ctx.font = `${radius * 0.3}px "${FONT_FAMILY}", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let n = 1; n <= 12; n++) {
        const angle = (n / 12) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * numberOffset;
        const y = cy + Math.sin(angle) * numberOffset;

        const pixel = getPixel(x, y, w, data);
        const invColor = `rgb(${255 - pixel.r}, ${255 - pixel.g}, ${255 - pixel.b})`;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2); // rotate so digit is radial
        ctx.fillStyle = invColor;
        ctx.fillText(n.toString().padStart(2, "0"), 0, 0);
        ctx.restore();
      }

      const drawHand = (length, widthPx, angleRad) => {
        const x = cx + Math.cos(angleRad) * length;
        const y = cy + Math.sin(angleRad) * length;

        const px = getPixel(x, y, w, data);
        const invColor = `rgb(${255 - px.r}, ${255 - px.g}, ${255 - px.b})`;

        ctx.strokeStyle = invColor;
        ctx.lineWidth = widthPx;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();
      };

      drawHand(radius * 0.5, Math.max(1, Math.floor(radius * 0.03)), (hours * Math.PI) / 6);
      drawHand(radius * 1.1, Math.max(1, Math.floor(radius * 0.02)), (minutes * Math.PI) / 30);
      drawHand(radius * 1.4, Math.max(1, Math.floor(radius * 0.01)), (seconds * Math.PI) / 30);

      // center dot
      const centerPixel = getPixel(cx, cy, w, data);
      const centerColor = `rgb(${255 - centerPixel.r}, ${255 - centerPixel.g}, ${255 - centerPixel.b})`;
      ctx.fillStyle = centerColor;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.05, 0, Math.PI * 2);
      ctx.fill();

      animationFrame = requestAnimationFrame(drawClock);
    };

    // start
    const onResize = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    // ensure video plays (silent autoplay)
    video.play().catch(() => {});

    // initial resize then start loop
    resizeCanvas();
    drawClock();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
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

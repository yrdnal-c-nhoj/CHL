import React, { useRef, useEffect, useState, useCallback } from 'react';
import videoFile from '../../../assets/images/26-02-15/caldera.mp4';
import fontFile from '../../../assets/fonts/26-02-15-fire.ttf';

const FONT_FAMILY = 'MyClockFont_20251120';

export default function PixelInverseClock() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load custom font
  useEffect(() => {
    const font = new FontFace(FONT_FAMILY, `url(${fontFile})`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontLoaded(true);
      })
      .catch((err) => console.error('Custom font failed to load:', err));

    return () => {
      // Optional: try to remove font on unmount (not always necessary)
      document.fonts.delete(font);
    };
  }, []);

  const getInvertedColor = useCallback((ctx, x, y) => {
    if (x < 0 || x >= ctx.canvas.width || y < 0 || y >= ctx.canvas.height) {
      return '#ffffff';
    }
    try {
      const [r, g, b] = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      return `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
    } catch (err) {
      console.warn('getImageData failed at', x, y);
      return '#ffffff';
    }
  }, []);

  const drawClock = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // 1. Draw video background (cover + centered)
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      const vidAspect = video.videoWidth / video.videoHeight;
      const screenAspect = w / h;

      let drawW = w;
      let drawH = h;

      if (screenAspect > vidAspect) {
        drawH = h;
        drawW = h * vidAspect;
      } else {
        drawW = w;
        drawH = w / vidAspect;
      }

      const x = (w - drawW) / 2;
      const y = (h - drawH) / 2;

      ctx.drawImage(video, x, y, drawW, drawH);
    }

    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    const baseSize = Math.min(w, h);
    const radiusX = w * 0.45;
    const radiusY = h * 0.08;

    // 2. Draw numbers (1–12)
    ctx.font = `${baseSize * 0.08}px "${FONT_FAMILY}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let n = 1; n <= 12; n++) {
      const angle = (n / 12) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radiusX;
      const y = cy + Math.sin(angle) * radiusY;

      ctx.fillStyle = getInvertedColor(ctx, x, y);
      ctx.fillText(String(n), x, y);
    }

    // 3. Draw clock hands
    const drawHand = (
      lengthRatio,
      thickness,
      angleRad
    ) => {
      const length = baseSize * lengthRatio;
      const targetX = cx + Math.cos(angleRad) * length;
      const targetY = cy + Math.sin(angleRad) * length;

      ctx.strokeStyle = getInvertedColor(ctx, targetX, targetY);
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
    };

    // Hour hand
    drawHand(0.08, 8, (hours * Math.PI) / 6 - Math.PI / 2);
    // Minute hand
    drawHand(0.16, 6, (minutes * Math.PI) / 30 - Math.PI / 2);
    // Second hand
    drawHand(0.20, 2, (seconds * Math.PI) / 30 - Math.PI / 2);

    animationFrameRef.current = requestAnimationFrame(drawClock);
  }, [fontLoaded, getInvertedColor]);

  // Canvas setup + animation loop
  useEffect(() => {
    if (!fontLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.imageSmoothingEnabled = false;
    };

    resize();
    window.addEventListener('resize', resize);

    // Start video
    const video = videoRef.current;
    if (video) {
      video.play().catch((e) => console.log('Autoplay prevented:', e));
    }

    // Start drawing
    drawClock();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, [fontLoaded, drawClock]);

  return (
    <div
      style={{
        backgroundColor: '#000',
        width: '100vw',
        height: '100vh',
        margin: 0,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          filter: 'saturate(3.5) contrast(1.5)',
          imageRendering: 'pixelated', // optional – may help crispness
        }}
      />
      <video
        ref={videoRef}
        src={videoFile}
        loop
        muted
        playsInline
        style={{ display: 'none' }}
      />
    </div>
  );
}
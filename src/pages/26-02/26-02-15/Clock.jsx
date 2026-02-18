import React, { useRef, useEffect, useState, useCallback } from 'react';
import videoFile from '../../../assets/images/26-02/26-02-15/caldera.mp4';
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
      document.fonts.delete(font);
    };
  }, []);

  const getInvertedColor = useCallback((ctx, x, y) => {
    if (x < 0 || x >= ctx.canvas.width || y < 0 || y >= ctx.canvas.height) {
      return '#ffffff';
    }
    try {
      // Sample a single pixel at the target coordinate
      const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      return `rgb(${255 - pixel[0]}, ${255 - pixel[1]}, ${255 - pixel[2]})`;
    } catch (err) {
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

    // --- 1. CENTERED VERTICAL TILING ---
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      const vidAspect = video.videoWidth / video.videoHeight;
      const screenAspect = w / h;

      // Fit to width to ensure no horizontal gaps
      let drawW = w;
      let drawH = w / vidAspect;

      const x = (w - drawW) / 2;
      const centerY = (h - drawH) / 2;

      // Calculate number of tiles needed to cover top and bottom
      const tilesNeeded = Math.ceil(h / drawH);

      // Save context state for normal orientation
      ctx.save();
      
      // No rotation - normal orientation
      // ctx.translate(w / 2, h / 2);
      // ctx.rotate(0);
      // ctx.translate(-w / 2, -h / 2);

      for (let i = -tilesNeeded; i <= tilesNeeded; i++) {
        const yPos = centerY + i * drawH;
        // Optimization: Only draw if tile is within viewport
        if (yPos + drawH > 0 && yPos < h) {
          ctx.drawImage(video, x, yPos, drawW, drawH);
        }
      }

      // Restore context state
      ctx.restore();
    }

    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    const baseSize = Math.min(w, h);
    // Clock geometry
    const radiusX = w * 0.45;
    const radiusY = h * 0.08;

    // --- 2. DRAW NUMBERS ---
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

    // --- 3. DRAW HANDS ---
    const drawHand = (lengthRatio, thickness, angleRad) => {
      const length = baseSize * lengthRatio;
      const targetX = cx + Math.cos(angleRad) * length;
      const targetY = cy + Math.sin(angleRad) * length;

      // Set stroke based on background at the tip of the hand
      ctx.strokeStyle = getInvertedColor(ctx, targetX, targetY);
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
    };

    drawHand(0.08, 8, (hours * Math.PI) / 6 - Math.PI / 2);     // Hour
    drawHand(0.16, 6, (minutes * Math.PI) / 30 - Math.PI / 2); // Minute
    drawHand(0.20, 2, (seconds * Math.PI) / 30 - Math.PI / 2); // Second

    animationFrameRef.current = requestAnimationFrame(drawClock);
  }, [getInvertedColor]);

  useEffect(() => {
    if (!fontLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const video = videoRef.current;
    if (video) {
      video.play().catch((e) => console.log('Autoplay blocked:', e));
    }

    drawClock();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [fontLoaded, drawClock]);

  return (
    <div style={{ backgroundColor: '#A34303', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          filter: 'saturate(3.5) contrast(1.5)',
          imageRendering: 'pixelated',
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
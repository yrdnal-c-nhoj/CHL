import React, { useRef, useEffect, useState } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';
import backgroundImage from '../../../assets/images/26-02/26-02-15/caldera.webp';
import fontFile from '../../../assets/fonts/26-02-15-fire.ttf';

const FONT_FAMILY = 'MyClockFont_20251120';

export default function PixelInverseClock() {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false);
  const imageRef = useRef(new Image());

  // 1. Assets Loading
  useEffect(() => {
    const font = new FontFace(FONT_FAMILY, `url(${fontFile})`);

    const loadAssets = async () => {
      try {
        const loadedFont = await font.load();
        document.fonts.add(loadedFont);

        // Load animated WebP with proper settings
        await new Promise((resolve, reject) => {
          imageRef.current.src = backgroundImage;
          imageRef.current.crossOrigin = 'anonymous'; // Add this for animated WebP
          imageRef.current.onload = () => {
            // Force the WebP to start animating
            imageRef.current.style.display = 'none';
            document.body.appendChild(imageRef.current);
            setTimeout(() => {
              document.body.removeChild(imageRef.current);
              resolve();
            }, 100);
          };
          imageRef.current.onerror = reject;
        });

        setAssetsLoaded(true);
      } catch (err) {
        console.error('Failed to load clock assets:', err);
      }
    };

    loadAssets();
    return () => {
      document.fonts.delete(font);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Main Render Loop
  const render = (ctx) => {
    const { width: w, height: h } = ctx.canvas;
    const now = new Date();

    // Clear canvas (background is handled by CSS)
    ctx.clearRect(0, 0, w, h);

    // Prepare to draw Inverse Elements
    // We use "difference" blending so anything drawn white (#fff)
    // will perfectly invert the pixels underneath it.
    ctx.save();
    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';

    drawClockUI(ctx, w, h, now);

    ctx.restore();
    requestRef.current = requestAnimationFrame(() => render(ctx));
  };

  const drawClockUI = (ctx, w, h, now) => {
    const cx = w / 2;
    const cy = h / 2;
    const baseSize = Math.min(w, h);

    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    // Numbers
    ctx.font = `${baseSize * 0.08}px "${FONT_FAMILY}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const radiusX = w * 0.45;
    const radiusY = h * 0.1;

    for (let n = 1; n <= 12; n++) {
      const angle = (n / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.fillText(
        n.toString(),
        cx + Math.cos(angle) * radiusX,
        cy + Math.sin(angle) * radiusY,
      );
    }

    // Hands
    const drawHand = (angle, length, width) => {
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length);
      ctx.stroke();
    };

    drawHand((hours * Math.PI) / 6 - Math.PI / 2, baseSize * 0.3, 8); // Hour
    drawHand((minutes * Math.PI) / 30 - Math.PI / 2, baseSize * 0.5, 5); // Minute
    drawHand((seconds * Math.PI) / 30 - Math.PI / 2, baseSize * 2.9, 2); // Second
  };

  // 3. Canvas Setup & Resize
  useEffect(() => {
    if (!assetsLoaded) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleResize: React.FC = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    requestRef.current = requestAnimationFrame(() => render(ctx));

    return () => window.removeEventListener('resize', handleResize);
  }, [assetsLoaded]);

  return (
    <div
      style={{
        backgroundColor: '#000',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          filter: 'saturate(3.5) contrast(1.5)',
          imageRendering: 'pixelated',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          mixBlendMode: 'difference',
          zIndex: 3,
        }}
      />
    </div>
  );
}

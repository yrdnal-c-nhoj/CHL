import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/useSmoothClock';
import backgroundImage from '@/assets/images/2026/26-02/26-02-15/caldera.webp';
import fontFile from '@/assets/fonts/2026/26-02-15-fire.ttf';

const FONT_FAMILY = 'FireFont';

export default function PixelInverseClock() {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false);
  const imageRef = useRef(new Image());

  const fontConfigs = useMemo(() => [
    {
      fontFamily: FONT_FAMILY,
      fontUrl: fontFile,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);
  
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await new Promise((resolve, reject) => {
          if (!imageRef.current) {
            reject(new Error('Image ref is null'));
            return;
          }
          imageRef.current.src = backgroundImage;
          imageRef.current.crossOrigin = 'anonymous';
          imageRef.current.onload = () => {
            if (!imageRef.current) return;
            imageRef.current.style.display = 'none';
            document.body.appendChild(imageRef.current);
            setTimeout(() => {
              if (imageRef.current && document.body.contains(imageRef.current)) {
                document.body.removeChild(imageRef.current);
              }
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
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    if (!assetsLoaded) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    requestRef.current = requestAnimationFrame(() => render(ctx));

    return () => window.removeEventListener('resize', handleResize);
  }, [assetsLoaded]);

  const time = useSecondClock();

  const render = (ctx) => {
    const { width: w, height: h } = ctx.canvas;

    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';

    drawClockUI(ctx, w, h, time);

    ctx.restore();
    requestRef.current = requestAnimationFrame(() => render(ctx));
  };

  const drawClockUI = (ctx, w, h, time) => {
    const cx = w / 2;
    const cy = h / 2;
    const baseSize = Math.min(w, h);

    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

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

    const drawHand = (angle, length, width) => {
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length);
      ctx.stroke();
    };

    drawHand((hours * Math.PI) / 6 - Math.PI / 2, baseSize * 0.3, 8);
    drawHand((minutes * Math.PI) / 30 - Math.PI / 2, baseSize * 0.5, 5);
    drawHand((seconds * Math.PI) / 30 - Math.PI / 2, baseSize * 2.9, 2);
  };

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

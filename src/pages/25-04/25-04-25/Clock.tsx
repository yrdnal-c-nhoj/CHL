import React, { useEffect, useRef, useState } from 'react';
import { useMultiAssetLoader } from '../../../utils/assetLoader';
import { useFontLoader } from '../../../utils/fontLoader';
import backgroundImage from '../../../assets/images/25-04/25-04-25/bad.webp';
import boldFont from '../../../assets/fonts/25-04-25-Oswald-Bold.ttf';
import hourHandImage from '../../../assets/images/25-04/25-04-25/ban.webp';
import minuteHandImage from '../../../assets/images/25-04/25-04-25/ba.gif';
import secondHandImage from '../../../assets/images/25-04/25-04-25/band.gif';

interface ClockImages {
  hourImg: HTMLImageElement;
  minuteImg: HTMLImageElement;
  secondImg: HTMLImageElement;
}

const MyClock: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  const componentId = useRef(`oswald-clock-${Date.now()}`);
  const fontName = `OswaldClockFont-${componentId.current}`;
  const imagesRef = useRef<ClockImages | null>(null);

  // Simple scoped font loading without leaks
  useEffect(() => {
    const loadFont = async () => {
      try {
        console.log('Loading font:', boldFont);
        const fontFace = new FontFace(fontName, `url(${boldFont})`);
        await fontFace.load();
        document.fonts.add(fontFace);
        console.log('Font loaded successfully');
        setFontLoaded(true);
      } catch (error) {
        console.warn('Font failed to load, using fallback:', error);
        setFontLoaded(false);
      }
    };

    loadFont();

    // Cleanup font on unmount
    return () => {
      for (const font of document.fonts) {
        if (font.family === fontName) {
          document.fonts.delete(font);
          break;
        }
      }
    };
  }, [fontName]);

  // Load images once
  useEffect(() => {
    const loadImages = async () => {
      const hourImg = new Image();
      const minuteImg = new Image();
      const secondImg = new Image();
      
      const loadPromises = [
        new Promise(resolve => { hourImg.onload = resolve; hourImg.src = hourHandImage; }),
        new Promise(resolve => { minuteImg.onload = resolve; minuteImg.src = minuteHandImage; }),
        new Promise(resolve => { secondImg.onload = resolve; secondImg.src = secondHandImage; })
      ];
      
      await Promise.all(loadPromises);
      imagesRef.current = { hourImg, minuteImg, secondImg };
    };
    
    loadImages();
  }, [hourHandImage, minuteHandImage, secondHandImage]);

  useEffect(() => {
    if (!fontLoaded || !imagesRef.current) return; // Don't start rendering until font is loaded
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const update = () => {
      const now = new Date();
      const w = (canvas.width = window.innerWidth);
      const h = (canvas.height = window.innerHeight);
      const r = Math.min(w, h) / 3;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);

      // Draw clock numbers
      ctx.fillStyle = '#FA0820FF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontToUse = fontLoaded ? fontName : 'Arial';
      ctx.font = `${r * 0.5}px ${fontToUse}`;

      for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(0, -r * 0.85);
        ctx.fillText(i.toString(), 0, 0);
        ctx.restore();
      }

      const hour = now.getHours() % 12;
      const minute = now.getMinutes();
      const second = now.getSeconds();

      // Updated drawImageHand function
      const drawImageHand = (img, angle, widthScale = 1, heightScale = 1) => {
        const imgW = r * 0.1 * widthScale;
        const imgH = r * heightScale;

        ctx.save();
        ctx.rotate(angle);
        ctx.drawImage(img, -imgW / 2, -imgH * 0.9, imgW, imgH); // base of hand at center
        ctx.restore();
      };

      // Use preloaded images
      const images = imagesRef.current;
      if (!images) return;
      const { hourImg, minuteImg, secondImg } = images;

      // Customize image hand sizes here:
      drawImageHand(
        hourImg,
        (Math.PI / 6) * hour + (Math.PI / 360) * minute,
        1.9,
        0.5,
      );
      drawImageHand(
        minuteImg,
        (Math.PI / 30) * minute + (Math.PI / 1800) * second,
        1.6,
        0.8,
      );
      drawImageHand(secondImg, (Math.PI / 30) * second, 1.2, 1.0);

      ctx.restore();
      requestAnimationFrame(update);
    };

    update();
  }, [fontLoaded]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: `url(${backgroundImage}) center/cover no-repeat`, // Background image
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

export default MyClock;

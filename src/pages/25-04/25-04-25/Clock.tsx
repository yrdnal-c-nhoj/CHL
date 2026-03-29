import React, { useEffect, useRef, useState } from 'react';
import { useMillisecondClock } from '../../../utils/useSmoothClock';
import type { CSSProperties } from 'react';
import backgroundImage from '../../../assets/images/25-04/25-04-25/bad.webp';
import boldFont from '../../../assets/fonts/25-04-25-Oswald-Bold.ttf?url';
import hourHandImage from '../../../assets/images/25-04/25-04-25/ban.webp';
import minuteHandImage from '../../../assets/images/25-04/25-04-25/ba.gif';
import secondHandImage from '../../../assets/images/25-04/25-04-25/band.gif';

interface ClockImages {
  hourImg: HTMLImageElement;
  minuteImg: HTMLImageElement;
  secondImg: HTMLImageElement;
}

// Component Props interface
interface MyClockProps {
  // No props required for this component
}

const MyClock: React.FC<MyClockProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<ClockImages | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load local font file
  useEffect(() => {
    const font = new FontFace('OswaldBold', `url(${boldFont})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
      setFontLoaded(true);
    }).catch(() => {
      setFontLoaded(true); // fallback
    });
  }, []);

  // Use the standardized hook for smooth millisecond clock updates
  const currentTime = useMillisecondClock();

  useEffect(() => {
    if (!imagesRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const update = (): void => {
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
      ctx.font = `${r * 0.5}px OswaldBold`;

      for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(0, -r * 0.85);
        ctx.fillText(i.toString(), 0, 0);
        ctx.restore();
      }

      const hour = currentTime.getHours() % 12;
      const minute = currentTime.getMinutes();
      const second = currentTime.getSeconds();

      // Updated drawImageHand function
      const drawImageHand = (img: HTMLImageElement, angle: number, widthScale = 1, heightScale = 1): void => {
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
  }, [currentTime, fontLoaded]);

  // Load images once
  useEffect(() => {
    const loadImages = async (): Promise<void> => {
      const hourImg = new Image();
      const minuteImg = new Image();
      const secondImg = new Image();
      
      const loadPromises = [
        new Promise<void>(resolve => { hourImg.onload = () => resolve(); hourImg.src = hourHandImage; }),
        new Promise<void>(resolve => { minuteImg.onload = () => resolve(); minuteImg.src = minuteHandImage; }),
        new Promise<void>(resolve => { secondImg.onload = () => resolve(); secondImg.src = secondHandImage; })
      ];
      
      await Promise.all(loadPromises);
      imagesRef.current = { hourImg, minuteImg, secondImg };
    };
    
    loadImages();
  }, [hourHandImage, minuteHandImage, secondHandImage]);


  return (
      <div
        style={{
          height: '100dvh',
          background: `url(${backgroundImage}) center/cover no-repeat`,
          overflow: 'hidden',
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>
  );
};

export default MyClock;

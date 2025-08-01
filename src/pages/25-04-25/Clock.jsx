import React, { useEffect, useRef } from 'react';
import backgroundImage from './bad.png';
import boldFont from './Oswald-Bold.ttf';
import hourHandImage from './ban.webp';
import minuteHandImage from './ba.gif';
import secondHandImage from './band.gif';

const MyClock = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const font = new FontFace('MyFont', `url(${boldFont})`);
    font.load().then(() => {
      document.fonts.add(font);
      loadImages();
    });

    const loadImages = () => {
      const hourImg = new Image();
      const minuteImg = new Image();
      const secondImg = new Image();

      let loadedCount = 0;
      const checkLoaded = () => {
        loadedCount++;
        if (loadedCount === 3) drawClock(hourImg, minuteImg, secondImg);
      };

      hourImg.onload = checkLoaded;
      minuteImg.onload = checkLoaded;
      secondImg.onload = checkLoaded;

      hourImg.src = hourHandImage;
      minuteImg.src = minuteHandImage;
      secondImg.src = secondHandImage;
    };

    const drawClock = (hourImg, minuteImg, secondImg) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const update = () => {
        const now = new Date();
        const w = canvas.width = window.innerWidth;
        const h = canvas.height = window.innerHeight;
        const r = Math.min(w, h) / 3;

        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.translate(w / 2, h / 2);

        // Draw clock numbers
        ctx.fillStyle = '#FA0820FF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${r * 0.6}px MyFont`;

        for (let i = 1; i <= 12; i++) {
          const angle = (i * Math.PI) / 6;
          ctx.save();
          ctx.rotate(angle);
          ctx.translate(0, -r * 0.85);
          ctx.fillText(i, 0, 0);
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

        // Customize image hand sizes here:
        drawImageHand(hourImg, (Math.PI / 6) * hour + (Math.PI / 360) * minute, 1.9, 0.5);
        drawImageHand(minuteImg, (Math.PI / 30) * minute + (Math.PI / 1800) * second, 1.6, 0.8);
        drawImageHand(secondImg, (Math.PI / 30) * second, 1.2, 1.0);

        ctx.restore();
        requestAnimationFrame(update);
      };

      update();
    };
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: `url(${backgroundImage}) center/cover no-repeat`,
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

export default MyClock;

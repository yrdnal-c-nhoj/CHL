import React, { useEffect, useRef } from 'react';
import myFontUrl from './rope.ttf';
import backgroundImageUrl from './wes.webp';
import hourHandImageUrl from './gunn.gif';
import minuteHandImageUrl from './gun.gif';
import secondHandImageUrl from './ggg.gif';

const AnalogClock = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Load images
    const hourHandImage = new Image();
    hourHandImage.src = hourHandImageUrl;
    const minuteHandImage = new Image();
    minuteHandImage.src = minuteHandImageUrl;
    const secondHandImage = new Image();
    secondHandImage.src = secondHandImageUrl;

    // Load custom font
    const font = new FontFace('MyClockFont', `url(${myFontUrl})`);
    const loadResources = Promise.all([
      font.load(),
      new Promise((resolve) => { hourHandImage.onload = resolve; }),
      new Promise((resolve) => { minuteHandImage.onload = resolve; }),
      new Promise((resolve) => { secondHandImage.onload = resolve; }),
    ]);

    const pivots = { hour: 1, minute: 1, second: 1 };
    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawClock();
    };

    const drawHandImage = (img, scale, pivotYNormalized) => {
      const imgAspect = img.width / img.height || 1;
      const targetHeight = scale;
      const targetWidth = targetHeight * imgAspect;
      const pivotY = pivotYNormalized * targetHeight;
      ctx.drawImage(img, -targetWidth / 2, -pivotY, targetWidth, targetHeight);
    };

    const drawClock = () => {
      if (!canvas) return;
      const now = new Date();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const radius = Math.min(width, height) / 3.5;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Vignette overlay ---
      const vignette = ctx.createRadialGradient(
        centerX, centerY, radius * 1.1,
        centerX, centerY, Math.max(width, height) * 0.7
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.75)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(centerX, centerY);

      // --- Numbers with tilt + flicker ---
      ctx.font = `${radius * 0.7}px MyClockFont`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const flicker = Math.sin(Date.now() / 150) * 0.15 + 0.85;

      for (let num = 1; num <= 12; num++) {
        const angle = (num * Math.PI) / 6;
        const x = Math.cos(angle - Math.PI / 2) * (radius * 0.85);
        const y = Math.sin(angle - Math.PI / 2) * (radius * 0.85);

        ctx.save();
        ctx.translate(x, y);
        const tilt = ((num % 2 === 0 ? -1 : 1) * Math.PI) / 18;
        ctx.rotate(tilt);

        // Outer flickering glow
        ctx.shadowColor = `rgba(255, 220, 180, ${0.3 * flicker})`;
        ctx.shadowBlur = 20;
        ctx.fillStyle = `rgba(${255 * flicker}, ${249 * flicker}, ${230 * flicker}, 1)`;
        ctx.fillText(num.toString(), 0, 0);

        // Middle glow
        ctx.shadowColor = '#d4a253';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#e6d4a2';
        ctx.fillText(num.toString(), 0, 0);

        // Dark base shadow
        ctx.shadowColor = '#4D311AFF';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#F4CEB1FF';
        ctx.fillText(num.toString(), 0, 0);

        ctx.restore();
      }

      // --- Hands with wobble + flicker ---
      const hour = now.getHours() % 12;
      const minute = now.getMinutes();
      const second = now.getSeconds();

      const hourAngle = (Math.PI / 6) * hour + (Math.PI / 360) * minute;
      const minuteAngle = (Math.PI / 30) * minute + (Math.PI / 1800) * second;
      const secondAngle = (Math.PI / 30) * second;

      const hourLength = radius * 0.5;
      const minuteLength = radius * 0.7;
      const secondLength = radius * 0.9;

      const wobble = Math.sin(Date.now() / 300) * (Math.PI / 180) * 0.5; // ±0.5° wobble

      // HOUR hand
      ctx.save();
      ctx.rotate(hourAngle + wobble);
      ctx.shadowColor = '#2c1c0f';
      ctx.shadowBlur = 12 * flicker;
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = `brightness(${0.8 * flicker}) contrast(2) sepia(0.6)`;
      drawHandImage(hourHandImage, hourLength, pivots.hour);
      ctx.restore();

      // MINUTE hand
      ctx.save();
      ctx.rotate(minuteAngle - wobble * 1.5);
      ctx.shadowColor = '#0B0A07FF';
      ctx.shadowBlur = 16 * flicker;
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = `brightness(${1.1 * flicker}) contrast(1.2) sepia(0.4)`;
      drawHandImage(minuteHandImage, minuteLength, pivots.minute);
      ctx.restore();

      // SECOND hand
      ctx.save();
      ctx.rotate(secondAngle + wobble * 2);
      ctx.shadowColor = '#ff6347';
      ctx.shadowBlur = 20 * flicker;
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = `brightness(${1.4 * flicker}) contrast(1.5) sepia(0.5)`;
      drawHandImage(secondHandImage, secondLength, pivots.second);
      ctx.restore();

      ctx.restore();
    };

    loadResources.then(([loadedFont]) => {
      document.fonts.add(loadedFont);
      resizeCanvas();
    });

    window.addEventListener('resize', resizeCanvas);
    const interval = setInterval(drawClock, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ display: 'block', isolation: 'isolate' }}
      />
    </div>
  );
};

export default AnalogClock;

import { useEffect, useRef } from 'react';
import squFontUrl from './squ.ttf';

const SquigglingClock = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const font = new FontFace('squ', `url(${squFontUrl})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
      canvas.width = size;
      canvas.height = size;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let distortionPhase = 0;
    const distortionSpeed = 0.03;

    const drawClock = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width * 0.46;
      const now = new Date();
      const hours = now.getHours() % 12 + now.getMinutes() / 60;
      const minutes = now.getMinutes() + now.getSeconds() / 60;
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;
      const offCtx = offCanvas.getContext('2d');

      offCtx.fillStyle = '#9D949DFF';
      offCtx.beginPath();
      offCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      offCtx.fill();

      // Numbers
      offCtx.fillStyle = '#F5DA6DFF';
      offCtx.font = `${canvas.width * 0.16}px squ`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      offCtx.shadowColor = '#060301FC';
      offCtx.shadowBlur = 0;
      offCtx.shadowOffsetX = 2;
      offCtx.shadowOffsetY = 2;

      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const numberX = centerX + (radius - canvas.width * 0.08) * Math.cos(angle);
        const numberY = centerY + (radius - canvas.width * 0.08) * Math.sin(angle);
        offCtx.fillText(i === 0 ? 12 : i, numberX, numberY);
      }

      // Hour hand
      offCtx.save();
      offCtx.translate(centerX, centerY);
      offCtx.fillStyle = '#AFF3ACFF';
      offCtx.rotate(hours * 30 * Math.PI / 180);
      offCtx.fillRect(-canvas.width * 0.01, -radius * 0.5, canvas.width * 0.02, radius * 0.7);
      offCtx.restore();

      // Minute hand
      offCtx.save();
      offCtx.translate(centerX, centerY);
      offCtx.fillStyle = '#BEB2EAFF';
      offCtx.rotate(minutes * 6 * Math.PI / 180);
      offCtx.fillRect(-canvas.width * 0.006, -radius * 0.7, canvas.width * 0.012, radius * 0.9);
      offCtx.restore();

      // Second hand
      offCtx.save();
      offCtx.translate(centerX, centerY);
      offCtx.fillStyle = '#EF1444FF';
      offCtx.rotate(seconds * 6 * Math.PI / 180);
      offCtx.fillRect(-canvas.width * 0.004, -radius * 0.9, canvas.width * 0.008, radius * 1.1);
      offCtx.restore();

      // Distortion effect
      const amplitude = 20;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
      const distortedData = ctx.createImageData(canvas.width, canvas.height);

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const offset = Math.sin(y / 20 + distortionPhase) * amplitude;
          const srcX = Math.floor(x + offset);
          if (srcX >= 0 && srcX < canvas.width) {
            const srcIdx = (y * canvas.width + srcX) * 4;
            const dstIdx = (y * canvas.width + x) * 4;
            for (let i = 0; i < 4; i++) {
              distortedData.data[dstIdx + i] = imageData.data[srcIdx + i];
            }
          }
        }
      }

      ctx.putImageData(distortedData, 0, 0);
      distortionPhase += distortionSpeed;
    };

    const animate = () => {
      drawClock();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div style={{
      margin: 0,
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: '#486d48',
      position: 'relative',
      fontFamily: 'sans-serif'
    }}>
    
      <canvas
        ref={canvasRef}
        style={{
          width: '90vmin',
          height: '90vmin',
          maxWidth: '90vw',
          maxHeight: '90vh',
        }}
      />

    </div>
  );
};

export default SquigglingClock;

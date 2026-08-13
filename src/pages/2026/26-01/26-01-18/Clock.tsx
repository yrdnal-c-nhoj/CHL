import { GLYPH_MAP } from '@/utils/glyphMap'; // Import the extracted data
import { IsoEngine } from '@/utils/isoEngine'; // Import the extracted class
import React, { useEffect, useRef } from 'react';

const OrtogonalClock =  () => {
  const canvasRef = useRef(null);
  const clockColor = { r: 255, g: 140, b: 0 };

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new IsoEngine(canvas);
    let raf;

    const tick = (time) => {
      const width = window.innerWidth;

      // Responsive Scales
      if (width < 480) {
        engine.scale = width / 38;
      } else if (width < 1024) {
        engine.scale = 35;
      } else {
        engine.scale = 50;
      }

      engine.angle = time / 3000;
      engine.clear();

      const now = new Date();
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      const hStr = String(hours).padStart(2, '0');
      const mStr = String(now.getMinutes()).padStart(2, '0');
      const sStr = String(now.getSeconds()).padStart(2, '0');
      const fullStr = `${hStr}:${mStr}:${sStr} ${ampm}`;

      let totalWidth = 0;
      for (const char of fullStr) {
        if (char === ':') totalWidth += 2;
        else if (char === ' ') totalWidth += 1.5;
        else if (char === 'M') totalWidth += 6;
        else totalWidth += 4;
      }

      let currentX = -(totalWidth / 2);

      for (let i = 0; i < fullStr.length; i++) {
        const char = fullStr[i];
        if (char === ':') {
          engine.drawPrism(currentX, 0, 1, 1, 1, 1, clockColor);
          engine.drawPrism(currentX, 0, 3, 1, 1, 1, clockColor);
          currentX += 2;
        } else if (char === ' ') {
          currentX += 1.5;
        } else {
          const shapes = GLYPH_MAP[char];
          if (shapes) {
            shapes.forEach((f) =>
              engine.drawPrism(
                f[0] + currentX,
                f[1],
                f[2],
                f[3],
                f[4],
                f[5],
                clockColor,
              ),
            );
          }
          currentX += char === 'M' ? 6 : 4;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: 'linear-gradient(180deg, #185591 0%, #835CD7 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth * 2}
        height={window.innerHeight * 2}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

export default OrtogonalClock;

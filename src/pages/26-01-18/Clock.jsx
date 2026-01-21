import React, { useEffect, useRef } from 'react';


class IsoEngine {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.scale = 20; 
    this.angle = Math.PI / 6;
  }

  project(x, y, z) {
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);
    const originX = this.canvas.width / 2;
    const originY = this.canvas.height / 2;

    const px = originX + (x * this.scale * cosA) + (y * this.scale * Math.cos(Math.PI - this.angle));
    const py = originY - (x * this.scale * sinA) - (y * this.scale * Math.sin(Math.PI - this.angle)) - (z * this.scale);
    return { x: px, y: py };
  }

  drawPrism(x, y, z, w, l, h, color) {
    const points = [
      [x, y, z], [x + w, y, z], [x + w, y + l, z], [x, y + l, z],
      [x, y, z + h], [x + w, y, z + h], [x + w, y + l, z + h], [x, y + l, z + h]
    ];
    const faces = [[0, 1, 5, 4], [1, 2, 6, 5], [4, 5, 6, 7]];
    const shades = [0.8, 0.6, 1.0]; 

    faces.forEach((indices, i) => {
      this.ctx.beginPath();
      const p0 = this.project(...points[indices[0]]);
      this.ctx.moveTo(p0.x, p0.y);
      indices.slice(1).forEach(idx => {
        const p = this.project(...points[idx]);
        this.ctx.lineTo(p.x, p.y);
      });
      this.ctx.closePath();
      this.ctx.fillStyle = `rgb(${color.r * shades[i]}, ${color.g * shades[i]}, ${color.b * shades[i]})`;
      this.ctx.fill();
    });
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

const GLYPH_MAP = {
  '0': [[0,0,0,3,1,1],[0,0,4,3,1,1],[0,0,1,1,1,3],[2,0,1,1,1,3]],
  '1': [[1,0,0,1,1,5]],
  '2': [[0,0,0,3,1,1],[0,0,2,3,1,1],[0,0,4,3,1,1],[2,0,3,1,1,1],[0,0,1,1,1,1]],
  '3': [[0,0,0,3,1,1],[0,0,2,3,1,1],[0,0,4,3,1,1],[2,0,1,1,1,3]],
  '4': [[2,0,0,1,1,5],[0,0,2,1,1,3],[1,0,2,1,1,1]],
  '5': [[0,0,0,3,1,1],[0,0,2,3,1,1],[0,0,4,3,1,1],[0,0,3,1,1,1],[2,0,1,1,1,1]],
  '6': [[0,0,0,3,1,1],[0,0,2,3,1,1],[0,0,4,3,1,1],[0,0,1,1,1,3],[2,0,1,1,1,1]],
  '7': [[2,0,0,1,1,5],[0,0,4,3,1,1]],
  '8': [[0,0,0,3,1,1],[0,0,2,3,1,1],[0,0,4,3,1,1],[0,0,1,1,1,3],[2,0,1,1,1,3]],
  '9': [[0,0,0,3,1,1],[0,0,2,3,1,1],[0,0,4,3,1,1],[0,0,3,1,1,1],[2,0,1,1,1,3]],
  'A': [[0,0,0,1,1,4],[2,0,0,1,1,4],[0,0,4,3,1,1],[0,0,2,3,1,1]],
  'P': [[0,0,0,1,1,5],[1,0,4,2,1,1],[1,0,2,2,1,1],[2,0,3,1,1,1]],
  'M': [[0,0,0,1,1,5],[4,0,0,1,1,5],[1,0,3,1,1,1],[2,0,2,1,1,1],[3,0,3,1,1,1]],
};

const OrtogonalClock = () => {
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
      
      engine.angle = (time / 3000); 
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
      for (let char of fullStr) {
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
            shapes.forEach(f => engine.drawPrism(f[0] + currentX, f[1], f[2], f[3], f[4], f[5], clockColor));
          }
          currentX += (char === 'M') ? 6 : 4; 
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100dvh',
      background: 'linear-gradient(180deg, #185591 0%, #835CD7 100%)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      overflow: 'hidden'
    }}>
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
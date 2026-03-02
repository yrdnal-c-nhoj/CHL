import React, { useState, useEffect, useMemo, useRef } from 'react';
// Import video and GIF assets
import westVideo from '../../../assets/images/26-03/26-03-01/west.mp4';
import cloudGif from '../../../assets/images/26-03/26-03-01/cloud.webp';

const TILE_SIZE = 200;

/**
 * AnalogClock Component
 * Uses percentage-based dimensions to ensure perfect centering 
 * regardless of the container size.
 */
const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // 0 degrees starts at 12 o'clock in CSS rotation when transform-origin is bottom
  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  const handStyle = (width, height, color, angle, z) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width,
    height,
    backgroundColor: color,
    borderRadius: '10px',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    boxShadow: `0 0 10px ${color}`,
    zIndex: z,
  });

  return (
    <div style={{
      width: '45vw',
      height: '45vw',
      borderRadius: '50%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // border: '3px solid #C0C0C0',
      // backgroundColor: 'rgba(192, 192, 192, 0.1)',
      // boxShadow: '0 0 20px rgba(192, 192, 192, 0.3)'
    }}>
      
    

      {/* Hands */}
      <div style={handStyle('6px', '25%', '#9EAEF6', hourAngle, 3)} />
      <div style={handStyle('4px', '35%', '#9EAEF6', minuteAngle, 4)} />
      <div style={handStyle('2px', '40%', '#9EAEF6', secondAngle, 5)} />

    
    </div>
  );
};

/**
 * Main Clock Component
 */
const Clock = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Neon Rain Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const drops = [];
    const maxDrops = 30;

    class Drop {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * w;
        this.y = 0;
        this.color = 'hsl(220, 100%, 60%)';
        this.w = 2;
        this.h = 1;
        this.vy = Math.random() * 1 + 4;
        this.vw = 3;
        this.vh = 1;
        this.hit = Math.random() * (h * 0.7) + h * 0.2;
        this.a = 1;
        this.va = 0.96;
      }
      draw() {
        if (this.y > this.hit) {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.h / 2);
          ctx.bezierCurveTo(this.x + this.w / 2, this.y - this.h / 2, this.x + this.w / 2, this.y + this.h / 2, this.x, this.y + this.h / 2);
          ctx.bezierCurveTo(this.x - this.w / 2, this.y + this.h / 2, this.x - this.w / 2, this.y - this.h / 2, this.x, this.y - this.h / 2);
          ctx.strokeStyle = `rgba(100, 150, 255, ${this.a})`;
          ctx.stroke();
          ctx.closePath();
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, 2, 10);
        }
        this.update();
      }
      update() {
        if (this.y < this.hit) {
          this.y += this.vy;
        } else {
          if (this.a > 0.03) {
            this.w += this.vw;
            this.h += this.vh;
            if (this.w > 100) {
              this.a *= this.va;
              this.vw *= 0.98;
              this.vh *= 0.98;
            }
          } else {
            this.init();
          }
        }
      }
    }

    const setup = () => {
      for (let i = 0; i < maxDrops; i++) {
        setTimeout(() => drops.push(new Drop()), i * 200);
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, w, h);
      drops.forEach(drop => drop.draw());
      requestAnimationFrame(animate);
    };

    setup();
    animate();

    return () => {
      drops.length = 0;
    };
  }, []);

  // Memoized Grid
  const tileCoords = useMemo(() => {
    const coords = [];
    const cols = Math.ceil(dimensions.width / TILE_SIZE);
    const rows = Math.ceil(dimensions.height / TILE_SIZE);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        coords.push({ x: col * TILE_SIZE, y: row * TILE_SIZE, id: `${row}-${col}` });
      }
    }
    return coords;
  }, [dimensions]);

  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      backgroundColor: '#000',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Background Video */}
      <video
        autoPlay loop muted playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          filter: 'hue-rotate(230deg) saturate(1.3) brightness(1.0) contrast(0.6)',
        }}
      >
        <source src={westVideo} type="video/mp4" />
      </video>

      {/* Tiled GIF Overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        {tileCoords.map((tile) => (
          <img 
            key={tile.id} 
            src={cloudGif} 
            alt=""
            style={{ 
              position: 'absolute',
              left: tile.x, 
              top: tile.y,
              width: TILE_SIZE,
              height: TILE_SIZE,
              opacity: 0.15,
              transform: 'scaleX(-1)'
            }} 
          />
        ))}
      </div>

      {/* Rain Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          mixBlendMode: 'screen'
        }}
      />

      {/* Clock UI Layer */}
      <section style={{ zIndex: 10 }}>
        <AnalogClock />
      </section>
    </main>
  );
};

export default Clock;
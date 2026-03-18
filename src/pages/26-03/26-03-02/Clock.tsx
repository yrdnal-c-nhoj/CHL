import React, { useEffect, useRef, useState } from 'react';

const RainCanvas: React.FC = () => {
  const canvasRef = useRef(null);
  const [time, setTime] = useState(new Date());

  // Start with 3 drops
  const dropCountRef = useRef(3);
  const dropsRef = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Progression Logic: 3 -> 9 -> 18 -> 110
  useEffect(() => {
    const stage1 = setTimeout(() => {
      dropCountRef.current = 9;
    }, 2000);
    const stage2 = setTimeout(() => {
      dropCountRef.current = 18;
    }, 4000);
    const stage3 = setTimeout(() => {
      dropCountRef.current = 110;
    }, 7000);

    return () => {
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(stage3);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let ripples = [];
    const themeColor = '10, 5, 15';

    class Drop {
      constructor() {
        this.init();
      }
      init() {
        this.z = Math.random() * 0.8 + 0.2;
        this.x = Math.random() * canvas.width;
        // Start them high enough so they don't all appear instantly
        this.y = Math.random() * -canvas.height;
        this.speed = this.z * 6 + 3;
        this.length = this.z * 15 + 10;
        this.targetY = canvas.height * 0.52 + this.z * canvas.height * 0.45;
      }
      update() {
        this.y += this.speed;
        if (this.y > this.targetY) {
          ripples.push(new Ripple(this.x, this.targetY, this.z));
          this.init();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${themeColor}, ${this.z * 0.4})`;
        ctx.lineWidth = this.z * 1.2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
      }
    }

    class Ripple {
      constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = 2;
        this.opacity = 0.85;
        this.growth = z * 0.08 + 0.04;
        this.decay = 0.0012;
      }
      update() {
        this.r += this.growth;
        this.opacity -= this.decay;
      }
      draw() {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${themeColor}, ${this.opacity})`;
        ctx.lineWidth = this.z * 3.5 + 0.5;
        ctx.ellipse(
          this.x,
          this.y,
          this.r * 4,
          this.r * 0.8,
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
    }

    const resize: React.FC = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-populate drops on resize based on current stage
      dropsRef.current = Array.from(
        { length: dropCountRef.current },
        () => new Drop(),
      );
    };

    window.addEventListener('resize', resize);
    resize();

    const render: React.FC = () => {
      ctx.fillStyle = '#DBCC99';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Check if we need to add more drops to reach the new target count
      if (dropsRef.current.length < dropCountRef.current) {
        const diff = dropCountRef.current - dropsRef.current.length;
        for (let i = 0; i < diff; i++) {
          dropsRef.current.push(new Drop());
        }
      }

      ripples = ripples.filter((r) => r.opacity > 0);
      ripples.forEach((r) => {
        r.update();
        r.draw();
      });
      dropsRef.current.forEach((d) => {
        d.update();
        d.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const format = (v) => String(v).padStart(2, '0');
  const h = format(time.getHours());
  const m = format(time.getMinutes());
  const s = format(time.getSeconds());

  const sharedDigitStyle = {
    fontSize: '12vw',
    fontWeight: 200,
    fontFamily: 'sans-serif',
    letterSpacing: '-0.05em',
    display: 'inline-block',
    minWidth: '0.65em',
    textAlign: 'center',
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#DBCC99',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />

      <div
        style={{
          position: 'absolute',
          top: '75%',
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          perspective: '1000px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            transform: 'rotateX(75deg)',
            transformOrigin: '50% 0%',
            display: 'flex',
            alignItems: 'center',
            color: 'rgb(109, 103, 106)',
            textShadow: '0 0 20px rgba(10, 5, 15, 0.1)',
          }}
        >
          <span style={sharedDigitStyle}>
            {h}:{m}:{s}
          </span>
        </div>

        <div
          style={{
            marginTop: '-2vh',
            transform: 'rotateX(75deg) scaleY(-1)',
            transformOrigin: '50% 0%',
            display: 'flex',
            alignItems: 'center',
            color: 'rgba(10, 5, 15, 0.15)',
            filter: 'blur(8px)',
            opacity: 0.6,
          }}
        >
          <span style={sharedDigitStyle}>
            {h}:{m}:{s}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RainCanvas;

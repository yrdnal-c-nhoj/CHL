import React, { useEffect, useRef, useState } from 'react';
import { useSecondClock } from '@/utils/useSmoothClock';
import styles from './Clock.module.css';

const RainCanvas: React.FC = () => {
  const canvasRef = useRef(null);
  const time = useSecondClock();

  const dropCountRef = useRef(3);
  const dropsRef = useRef([]);

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

    const resize = () => {
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

    const render = () => {
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

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.timeWrapper}>
        <div className={styles.mainTime}>
          <span className={styles.digit}>
            {h}:{m}:{s}
          </span>
        </div>

        <div className={styles.reflection}>
          <span className={styles.digit}>
            {h}:{m}:{s}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RainCanvas;

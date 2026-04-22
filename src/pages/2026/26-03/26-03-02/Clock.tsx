import React, { useEffect, useRef, useState } from 'react';
import { useSecondClock } from '@/utils/useSmoothClock';
import styles from './Clock.module.css';

const RainCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const time = useSecondClock();

  const dropCountRef = useRef<number>(3);
  const dropsRef = useRef<DropType[]>([]);

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

  // Define interfaces for Drop and Ripple properties for strict typing
  interface DropProperties {
    z: number;
    x: number;
    y: number;
    speed: number;
    length: number;
    targetY: number;
  }

  interface RippleProperties {
    x: number;
    y: number;
    z: number;
    r: number;
    opacity: number;
    growth: number;
    decay: number;
  }

  // Types for classes defined inside useEffect
  type DropType = {
    z: number; x: number; y: number; speed: number; length: number; targetY: number;
    init(canvas: HTMLCanvasElement): void;
    update(canvas: HTMLCanvasElement, currentRipples: RippleType[]): void;
    draw(ctx: CanvasRenderingContext2D, themeColor: string): void;
  };

  type RippleType = {
    x: number; y: number; z: number; r: number; opacity: number; growth: number; decay: number;
    update(): void;
    draw(ctx: CanvasRenderingContext2D, themeColor: string): void;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let ripples: Ripple[] = [];
    const themeColor = '10, 5, 15';

    class Drop implements DropProperties {
      z!: number;
      x!: number;
      y!: number;
      speed!: number;
      length!: number;
      targetY!: number;

      constructor(canvas: HTMLCanvasElement) {
        this.init(canvas);
      }

      init(canvas: HTMLCanvasElement) {
        this.z = Math.random() * 0.8 + 0.2;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.speed = this.z * 6 + 3;
        this.length = this.z * 15 + 10;
        this.targetY = canvas.height * 0.52 + this.z * canvas.height * 0.45;
      }

      update(canvas: HTMLCanvasElement, currentRipples: Ripple[]) {
        this.y += this.speed;
        if (this.y > this.targetY) {
          currentRipples.push(new Ripple(this.x, this.targetY, this.z));
          this.init(canvas);
        }
      }

      draw(ctx: CanvasRenderingContext2D, themeColor: string) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${themeColor}, ${this.z * 0.4})`;
        ctx.lineWidth = this.z * 1.2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
      }
    }

    class Ripple implements RippleProperties {
      x!: number;
      y!: number;
      z!: number;
      r!: number;
      opacity!: number;
      growth!: number;
      decay!: number;

      constructor(x: number, y: number, z: number) {
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

      draw(ctx: CanvasRenderingContext2D, themeColor: string) {
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
      dropsRef.current = Array.from({ length: dropCountRef.current }, () => new Drop(canvas));
    };

    window.addEventListener('resize', resize);
    resize();

    dropsRef.current = Array.from({ length: dropCountRef.current }, () => new Drop(canvas));

    const render = () => {
      ctx.fillStyle = '#DBCC99';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (dropsRef.current.length < dropCountRef.current) {
        const diff = dropCountRef.current - dropsRef.current.length;
        for (let i = 0; i < diff; i++) {
          dropsRef.current.push(new Drop(canvas));
        }
      }

      ripples = ripples.filter((r) => r.opacity > 0);
      ripples.forEach((r) => {
        r.update();
        r.draw(ctx, themeColor);
      });
      dropsRef.current.forEach((d) => {
        d.update(canvas, ripples);
        d.draw(ctx, themeColor);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const format = (v: number) => String(v).padStart(2, '0');
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

import React, { useRef, useEffect, useMemo } from "react";
import font_25_10_09 from "./rain.ttf";

export default function DigitRain() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeDigitsRef = useRef([]);

  // Constants
  const GRAVITY = 0.15;
  const WIND = 0.01;
  const SPAWN_CHANCE = 0.4;
  const INITIAL_PARTICLES = 8;
  const SPLASH_COUNT_RANGE = [25, 50];
  const BACKGROUND_COLOR = "#BDE4F0FF";

  // Memoized canvas context
  const ctxRef = useRef(null);

  // Update time digits every minute
  useEffect(() => {
    const updateTimeDigits = () => {
      const now = new Date();
      let hours = now.getHours() % 12 || 12;
      let minutes = now.getMinutes();
      timeDigitsRef.current = `${hours}${minutes.toString().padStart(2, "0")}`.split("");
    };

    updateTimeDigits();
    const interval = setInterval(updateTimeDigits, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d", { alpha: false }); // Optimize for opaque background

    // Load custom font
    const fontFace = new FontFace("DigitFont_25_10_09", `url(${font_25_10_09})`);
    fontFace.load().then((loaded) => document.fonts.add(loaded));

    // Vector utility
    class Vector {
      constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }
      add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
      }
    }

    // Falling digit
    class DigitParticle {
      constructor(value, width) {
        this.value = value;
        this.pos = new Vector(Math.random() * width, -10);
        this.vel = new Vector(0, Math.random() * 1 + 0.5);
        this.fontSize = Math.random() * 2 + 2.5; // in rem
        this.alpha = 1;
      }
      update() {
        this.vel.y += GRAVITY * 0.2;
        this.vel.x += WIND;
        this.pos.add(this.vel);
      }
      draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = "#0A0A0A";
        ctx.font = `${this.fontSize}rem "DigitFont_25_10_09"`;
        ctx.fillText(this.value, this.pos.x, this.pos.y);
      }
    }

    // Splash digits
    class Splash {
      constructor(x, y, val) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 6;
        this.pos = new Vector(x, y);
        this.vel = new Vector(Math.cos(angle) * speed, Math.sin(angle) * speed);
        this.val = val;
        this.alpha = 1;
        this.size = Math.random() * 0.8 + 0.5;
        this.rotation = Math.random() * 2 * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
      }
      update() {
        this.vel.y += GRAVITY * 0.3;
        this.vel.x *= 0.93;
        this.vel.y *= 0.93;
        this.pos.add(this.vel);
        this.rotation += this.rotationSpeed;
        this.alpha -= 0.02;
      }
      draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = "#000";
        ctx.font = `${this.size}rem "DigitFont_25_10_09"`;
        ctx.fillText(this.val, 0, 0);
        ctx.restore();
      }
    }

    // Canvas scaling
    const resizeCanvasToDisplaySize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        ctxRef.current.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    // Animation loop
    const digits = [];
    const splashes = [];
    const update = () => {
      const ctx = ctxRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // Clear canvas once
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, width, height);

      // Batch draw operations
      ctx.save();
      ctx.textAlign = "center";
      for (let i = digits.length - 1; i >= 0; i--) {
        const d = digits[i];
        d.update();
        if (d.pos.y >= height) {
          const n = Math.floor(Math.random() * (SPLASH_COUNT_RANGE[1] - SPLASH_COUNT_RANGE[0] + 1)) + SPLASH_COUNT_RANGE[0];
          for (let j = 0; j < n; j++) {
            const randomDigit = timeDigitsRef.current[Math.floor(Math.random() * timeDigitsRef.current.length)];
            splashes.push(new Splash(d.pos.x, height, randomDigit));
          }
          digits.splice(i, 1);
        } else {
          d.draw(ctx);
        }
      }

      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.update();
        s.draw(ctx);
        if (s.alpha <= 0) splashes.splice(i, 1);
      }
      ctx.restore();

      // Spawn new digit
      if (Math.random() < SPAWN_CHANCE) {
        const randomDigit = timeDigitsRef.current[Math.floor(Math.random() * timeDigitsRef.current.length)];
        digits.push(new DigitParticle(randomDigit, width));
      }

      rafRef.current = requestAnimationFrame(update);
    };

    // Initialize
    resizeCanvasToDisplaySize();
    for (let i = 0; i < INITIAL_PARTICLES; i++) {
      const randomDigit = timeDigitsRef.current[Math.floor(Math.random() * timeDigitsRef.current.length)];
      digits.push(new DigitParticle(randomDigit, canvas.clientWidth));
    }
    rafRef.current = requestAnimationFrame(update);

    // Event listeners
    window.addEventListener("resize", resizeCanvasToDisplaySize);
    window.addEventListener("orientationchange", resizeCanvasToDisplaySize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvasToDisplaySize);
      window.removeEventListener("orientationchange", resizeCanvasToDisplaySize);
    };
  }, []);

  const inlineCanvasStyle = useMemo(() => ({
    display: "block",
    width: "100vw",
    height: "100dvh",
    margin: "0",
    background: BACKGROUND_COLOR,
  }), []);

  return (
    <canvas
      ref={canvasRef}
      style={inlineCanvasStyle}
      aria-label="Digit rain animation using custom font"
    />
  );
}
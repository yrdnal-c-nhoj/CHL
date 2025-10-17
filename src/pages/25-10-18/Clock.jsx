// DigitRain.jsx
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

  const ctxRef = useRef(null);

  // Update time digits every second (includes seconds)
  useEffect(() => {
    const updateTimeDigits = () => {
      const now = new Date();
      let hours = now.getHours() % 12 || 12;
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      const timeString = `${hours}${minutes.toString().padStart(2, "0")}${seconds
        .toString()
        .padStart(2, "0")}`;
      timeDigitsRef.current = timeString.split("");
    };

    updateTimeDigits();
    const interval = setInterval(updateTimeDigits, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d", { alpha: false });

    // Load custom font
    const fontFace = new FontFace("DigitFont_25_10_09", `url(${font_25_10_09})`);
    fontFace.load().then((loaded) => document.fonts.add(loaded));

    // Vector class
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

    // Splash class
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

    // Resize function
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

      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.textAlign = "center";

      // Falling digits
      for (let i = digits.length - 1; i >= 0; i--) {
        const d = digits[i];
        d.update();
        if (d.pos.y >= height) {
          const n =
            Math.floor(
              Math.random() *
                (SPLASH_COUNT_RANGE[1] - SPLASH_COUNT_RANGE[0] + 1)
            ) + SPLASH_COUNT_RANGE[0];
          for (let j = 0; j < n; j++) {
            const randomDigit =
              timeDigitsRef.current[
                Math.floor(Math.random() * timeDigitsRef.current.length)
              ];
            splashes.push(new Splash(d.pos.x, height, randomDigit));
          }
          digits.splice(i, 1);
        } else {
          d.draw(ctx);
        }
      }

      // Splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.update();
        s.draw(ctx);
        if (s.alpha <= 0) splashes.splice(i, 1);
      }

      ctx.restore();

      // Spawn new digits
      if (Math.random() < SPAWN_CHANCE) {
        const randomDigit =
          timeDigitsRef.current[
            Math.floor(Math.random() * timeDigitsRef.current.length)
          ];
        digits.push(new DigitParticle(randomDigit, width));
      }

      rafRef.current = requestAnimationFrame(update);
    };

    resizeCanvasToDisplaySize();

    for (let i = 0; i < INITIAL_PARTICLES; i++) {
      const randomDigit =
        timeDigitsRef.current[
          Math.floor(Math.random() * timeDigitsRef.current.length)
        ];
      digits.push(new DigitParticle(randomDigit, canvas.clientWidth));
    }

    rafRef.current = requestAnimationFrame(update);

    window.addEventListener("resize", resizeCanvasToDisplaySize);
    window.addEventListener("orientationchange", resizeCanvasToDisplaySize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvasToDisplaySize);
      window.removeEventListener("orientationchange", resizeCanvasToDisplaySize);
    };
  }, []);

  const inlineCanvasStyle = useMemo(
    () => ({
      display: "block",
      width: "100vw",
      height: "100dvh",
      margin: "0",
      background: BACKGROUND_COLOR,
    }),
    []
  );

  return (
    <canvas
      ref={canvasRef}
      style={inlineCanvasStyle}
      aria-label="Digit rain animation using custom font including seconds"
    />
  );
}

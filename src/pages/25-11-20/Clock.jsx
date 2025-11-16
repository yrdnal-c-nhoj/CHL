import React, { useRef, useEffect, useMemo } from "react";
import font_25_10_09 from "./rainn.ttf";

export default function DigitRain() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeDigitsRef = useRef([]);

  // Constants
  const GRAVITY = 0.25;
  const WIND = 0.001;
  const SPAWN_CHANCE = 0.1;
  const INITIAL_PARTICLES = 12;
  const BACKGROUND_COLOR = "#BDE4F0FF";

  // Bounce & deformation constants
  const FLOOR_Y_OFFSET = 2;
  const BOUNCE_DAMPING = 0.55;

  const ctxRef = useRef(null);

  // Update time digits every second
  useEffect(() => {
    const updateTimeDigits = () => {
      const now = new Date();
      let hours = now.getHours() % 12 || 12;
      let minutes = now.getMinutes();

      // Only HOURS + MINUTES
      const timeString = `${hours}${minutes.toString().padStart(2, "0")}`;

      timeDigitsRef.current = timeString.split("");
    };

    updateTimeDigits();
    const interval = setInterval(updateTimeDigits, 1000);
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

    // Falling digit particle class (with bounce + squash/stretch)
    class DigitParticle {
      constructor(value, width) {
        this.value = value;
        this.pos = new Vector(Math.random() * width, -10);
        this.vel = new Vector(0, Math.random() * 1 + 0.5);
        this.fontSize = Math.random() * 2 + 2.5;
        this.alpha = 1;

        // squash/stretch + rotation
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.rotationSpeed = 0;
      }

      update() {
        this.vel.y += GRAVITY * 0.2;
        this.vel.x += WIND;
        this.pos.add(this.vel);

        this.scaleX += (1 - this.scaleX) * 0.15;
        this.scaleY += (1 - this.scaleY) * 0.15;

        this.rotation += this.rotationSpeed;
        this.rotationSpeed *= 0.92;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = "#0A0A0A";
        ctx.font = `${this.fontSize}rem "DigitFont_25_10_09"`;
        ctx.fillText(this.value, 0, 0);
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

    const digits = [];

    const update = () => {
      const ctx = ctxRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.textAlign = "center";

      for (let i = digits.length - 1; i >= 0; i--) {
        const d = digits[i];
        d.update();

        // bounce + squash + rotation
        if (d.pos.y >= height - FLOOR_Y_OFFSET) {
          d.pos.y = height - FLOOR_Y_OFFSET;

          d.vel.y = -d.vel.y * BOUNCE_DAMPING;
          d.vel.x *= 0.95;

          const impact = Math.min(Math.abs(d.vel.y), 8);

          d.scaleX = 1 + impact * 0.07;
          d.scaleY = 1 - impact * 0.05;

          if (Math.abs(d.vel.y) > 1) {
            d.rotationSpeed = (Math.random() - 0.5) * 0.2 * impact;
          }

          if (Math.abs(d.vel.y) < 0.3) {
            digits.splice(i, 1);
            continue;
          }

          d.draw(ctx);
        } else {
          d.draw(ctx);
        }
      }

      ctx.restore();

      // spawn new digits
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

    // initial particles
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
      aria-label="Digit rain animation"
    />
  );
}

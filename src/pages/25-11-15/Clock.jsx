import React, { useRef, useEffect, useMemo } from "react";
import font_25_10_09 from "./rain.otf";
import bgImage from "./fall.webp"; // local background image

export default function DigitRain() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeDigitsRef = useRef([]);
  const bgRef = useRef(null);

  const GRAVITY = 0.005;
  const WIND_BASE = 0.0005;
  const SPAWN_CHANCE = 0.15;
  const INITIAL_PARTICLES = 30;
  const MAX_FALL_SPEED = 0.5;
  const DRAG = 0.99;
  const HORIZONTAL_SWAY_STRENGTH = 0.05;

  // Update digits every second
  useEffect(() => {
    const updateTimeDigits = () => {
      const now = new Date();
      let hours = now.getHours() % 12 || 12;
      let minutes = now.getMinutes();
      timeDigitsRef.current = `${hours}${minutes.toString().padStart(2, "0")}`.split("");
    };
    updateTimeDigits();
    const interval = setInterval(updateTimeDigits, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });

    // Load font
    const fontFace = new FontFace("DigitFont_25_10_09", `url(${font_25_10_09})`);
    fontFace.load().then((loaded) => document.fonts.add(loaded));

    // Load background image
    const bg = new Image();
    bg.src = bgImage;
    bg.onload = () => {
      bgRef.current = bg;
    };

    class Vector {
      constructor(x = 0, y = 0) { this.x = x; this.y = y; }
      add(v) { this.x += v.x; this.y += v.y; return this; }
    }

    const AUTUMN_COLORS = ["#EE4305FF", "#FFCD04F2", "#DA0505FF", "#FCD80FFF", "#CB2904FF", "#FFD27F"];

    class DigitParticle {
      constructor(value, width, height) {
        this.value = value;
        this.pos = new Vector(Math.random() * width, Math.random() * -height);
        this.vel = new Vector((Math.random() - 0.5) * 0.05, Math.random() * 0.1);
        this.fontSize = Math.random() * 2 + 2.5;
        this.alpha = 1;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.color = AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)];
      }

      update(width, height) {
        this.vel.y += GRAVITY;
        this.vel.x = Math.sin(this.pos.y * 0.005) * HORIZONTAL_SWAY_STRENGTH + ((Math.random() - 0.5) * WIND_BASE);
        this.vel.x *= DRAG;
        this.vel.y = Math.min(this.vel.y * DRAG, MAX_FALL_SPEED);
        this.pos.add(this.vel);

        this.rotation += this.rotationSpeed;
        this.scaleX = 0.9 + Math.sin(Date.now() * 0.002 + this.pos.y) * 0.15;
        this.scaleY = 0.9 + Math.cos(Date.now() * 0.002 + this.pos.x) * 0.15;

        if (this.pos.y > height + 10) this.pos.y = -10;
        if (this.pos.x > width + 10) this.pos.x = -10;
        if (this.pos.x < -10) this.pos.x = width + 10;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize}rem "DigitFont_25_10_09"`;
        ctx.textAlign = "center";
        ctx.fillText(this.value, 0, 0);
        ctx.restore();
      }
    }

    const resizeCanvas = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const width = canvas.clientWidth * dpr;
      const height = canvas.clientHeight * dpr;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const digits = Array.from({ length: INITIAL_PARTICLES }, () => {
      const randomDigit = timeDigitsRef.current[Math.floor(Math.random() * timeDigitsRef.current.length)];
      return new DigitParticle(randomDigit, canvas.clientWidth, canvas.clientHeight);
    });

    const update = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // Draw background flush left at natural size
      if (bgRef.current) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(bgRef.current, 0, 0); // top-left corner
      } else {
        ctx.fillStyle = "#BDE4F0FF";
        ctx.fillRect(0, 0, width, height);
      }

      for (let d of digits) {
        d.update(width, height);
        d.draw(ctx);
      }

      if (digits.length < 100 && Math.random() < SPAWN_CHANCE) {
        const randomDigit = timeDigitsRef.current[Math.floor(Math.random() * timeDigitsRef.current.length)];
        digits.push(new DigitParticle(randomDigit, width, height));
      }

      rafRef.current = requestAnimationFrame(update);
    };

    resizeCanvas();
    rafRef.current = requestAnimationFrame(update);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
    };
  }, []);

  const canvasStyle = useMemo(
    () => ({
      display: "block",
      width: "100vw",
      height: "100dvh",
      margin: 0,
    }),
    []
  );

  return <canvas ref={canvasRef} style={canvasStyle} aria-label="Digit leaf animation" />;
}

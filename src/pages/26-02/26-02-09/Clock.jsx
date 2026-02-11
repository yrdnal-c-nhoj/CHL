import { useEffect, useMemo, useRef, useState } from "react";
import customFont from "../../../assets/fonts/26-02-09-spin.otf?url";

const COLORS = {
  hour: "#FFFFFF",
  minute: "#FFFFFF",
  period: "#FFFFFF",
};

const CONFIG = {
  SPAWN_INTERVAL_MS: 1800,
  CENTER_LIGHT_RADIUS: 12000,
  SHADOW_LENGTH: 2000,
  MIN_Z: 0.4,
  MAX_Z: 1.5,
  BASE_FONT_SIZE_FACTOR: 0.12,
  MIN_FONT_SIZE: 70,
};

export default function CenteredLightClock() {
  const canvasRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  const canvasStyle = useMemo(
    () => ({
      width: "100vw",
      height: "100dvh",
      display: "block",
      backgroundColor: "#4F5B6D",
      overflow: "hidden",
      margin: 0,
    }),
    []
  );

  useEffect(() => {
    // ── Font loading ───────────────────────────────────────────────
    const loadFont = async () => {
      try {
        const fontFace = new FontFace("CustomOswald", `url(${customFont})`);
        await fontFace.load();
        document.fonts.add(fontFace);
        setFontLoaded(true);
      } catch (err) {
        console.error("Custom font failed to load:", err);
        setFontLoaded(true); // continue anyway
      }
    };

    loadFont();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let lastTime = performance.now();
    let spawnAccumulator = 0;

    /** @type {Array<import('react').MutableRefObject<any>>} */
    const glyphs = [];

    // ── Helpers ────────────────────────────────────────────────────
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const getTimeParts = () => {
      const now = new Date();
      let h = now.getHours();
      const period = h >= 12 ? "pm" : "am";
      h = h % 12 || 12;
      return {
        hour: h.toString(),
        minute: now.getMinutes().toString().padStart(2, "0"),
        period,
      };
    };

    const createGlyph = (type, forcedX = null) => {
      const z = CONFIG.MIN_Z + Math.random() * (CONFIG.MAX_Z - CONFIG.MIN_Z);

      return {
        type,
        z,
        x: forcedX ?? canvas.width + 200,
        baseY: canvas.height * (0.1 + Math.random() * 0.8),
        speed: (0.04 + Math.random() * 0.05) * z,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: (0.001 + Math.random() * 0.008) * (Math.random() > 0.5 ? 1 : -1),
        wobbleAmp: (8 + Math.random() * 15) * z,
        wobbleFreq: 0.0008 + Math.random() * 0.001,
        wobblePhase: Math.random() * Math.PI * 2,
        drift: (Math.random() * 0.03 - 0.015) * z,
      };
    };

    const spawnGlyph = (type, forcedX = null) => {
      glyphs.push(createGlyph(type, forcedX));
    };

    const drawProjectedShadow = (x, y, fontSize, rotation, lightX, lightY, z) => {
      const halfW = fontSize * 0.3;
      const halfH = fontSize * 0.25;

      const localCorners = [
        { x: -halfW, y: -halfH },
        { x: +halfW, y: -halfH },
        { x: +halfW, y: +halfH },
        { x: -halfW, y: +halfH },
      ];

      const rotatedCorners = localCorners.map(({ x: lx, y: ly }) => {
        const rx = lx * Math.cos(rotation) - ly * Math.sin(rotation);
        const ry = lx * Math.sin(rotation) + ly * Math.cos(rotation);
        return { x: x + rx, y: y + ry };
      });

      const lightAngle = Math.atan2(lightY - y, lightX - x);
      const shadowAlpha = (0.2 + (z - CONFIG.MIN_Z) * 0.5).toFixed(2);

      ctx.fillStyle = `rgba(255,255,255,${shadowAlpha})`;

      for (let i = 0; i < 4; i++) {
        const a = rotatedCorners[i];
        const b = rotatedCorners[(i + 1) % 4];

        const dx = Math.sin(-lightAngle - Math.PI / 2);
        const dy = Math.cos(-lightAngle - Math.PI / 2);

        const aEnd = { x: a.x + CONFIG.SHADOW_LENGTH * dx, y: a.y + CONFIG.SHADOW_LENGTH * dy };
        const bEnd = { x: b.x + CONFIG.SHADOW_LENGTH * dx, y: b.y + CONFIG.SHADOW_LENGTH * dy };

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(bEnd.x, bEnd.y);
        ctx.lineTo(aEnd.x, aEnd.y);
        ctx.closePath();
        ctx.fill();
      }
    };

    // ── Main render loop ───────────────────────────────────────────
    const drawScene = (timestamp) => {
      const dt = timestamp - lastTime;
      lastTime = timestamp;
      spawnAccumulator += dt;

      // Steady spawning
      while (spawnAccumulator >= CONFIG.SPAWN_INTERVAL_MS) {
        spawnAccumulator -= CONFIG.SPAWN_INTERVAL_MS;
        const types = ["hour", "minute", "period"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        spawnGlyph(randomType);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Background gradient
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, CONFIG.CENTER_LIGHT_RADIUS);
      grad.addColorStop(0, "#828A99");
      grad.addColorStop(1, "#4A628E");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const timeParts = getTimeParts();
      const baseFontSize = Math.max(CONFIG.MIN_FONT_SIZE, Math.min(canvas.width, canvas.height) * CONFIG.BASE_FONT_SIZE_FACTOR);

      // Sort by depth (far → near)
      glyphs.sort((a, b) => a.z - b.z);

      for (let i = glyphs.length - 1; i >= 0; i--) {
        const g = glyphs[i];

        g.x -= g.speed * dt;
        g.spin += g.spinSpeed * dt;

        const wobble = Math.sin(timestamp * g.wobbleFreq + g.wobblePhase) * g.wobbleAmp;
        const y = g.baseY + wobble + g.drift * timestamp * 0.05;

        const fontSize = (
          g.type === "hour" ? baseFontSize :
          g.type === "minute" ? baseFontSize * 0.8 :
          baseFontSize * 0.6
        ) * g.z;

        // Shadow
        drawProjectedShadow(g.x, y, fontSize, g.spin, cx, cy, g.z);

        // Glyph itself
        ctx.save();
        ctx.translate(g.x, y);
        ctx.rotate(g.spin);

        ctx.font = `600 ${fontSize}px ${fontLoaded ? '"CustomOswald"' : "sans-serif"}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = COLORS[g.type];
        ctx.fillText(timeParts[g.type], 0, 0);

        ctx.restore();

        // Remove if completely off-screen left
        if (g.x < -canvas.width * 0.5) {
          glyphs.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(drawScene);
    };

    // ── Initialization ─────────────────────────────────────────────
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Pre-populate screen
    const types = ["hour", "minute", "period"];
    for (let i = 0; i < 15; i++) {
      spawnGlyph(types[i % 3], Math.random() * canvas.width * 1.3);
    }

    // Start animation
    animationFrameId = requestAnimationFrame(drawScene);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [fontLoaded]);

  return <canvas ref={canvasRef} style={canvasStyle} />;
}
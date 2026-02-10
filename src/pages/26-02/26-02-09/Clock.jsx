import { useEffect, useMemo, useRef, useState } from "react";
import customFont from '../../../assets/fonts/26-02-09-spin.otf?url';

const COLORS = {
  hour: "#FFFFFF",
  minute: "#FFFFFF",
  period: "#FFFFFF",
};

// Refined constants for the "Steady Stream" and Parallax
const SPAWN_INTERVAL_MS = 1800; // New glyph every 1.8 seconds
const CENTER_LIGHT_RADIUS = 12000;
const SHADOW_LENGTH = 2000;

export default function CenteredLightClock() {
  const canvasRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  const style = useMemo(() => ({
    width: "100vw",
    height: "100dvh",
    display: "block",
    backgroundColor: "#4F5B6D",
    overflow: "hidden",
    margin: 0,
  }), []);

  useEffect(() => {
    const loadFont = async () => {
      try {
        const fontFace = new FontFace('CustomOswald', `url(${customFont})`);
        await fontFace.load();
        document.fonts.add(fontFace);
        setFontLoaded(true);
      } catch (e) {
        console.error('Font failed', e);
        setFontLoaded(true);
      }
    };
    loadFont();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationIntervalId;
    let lastTime = performance.now();
    let spawnAccumulator = 0;
    const glyphs = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const getCurrentTimeParts = () => {
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

    const spawnGlyph = (type, forceX = null) => {
      const z = 0.4 + Math.random() * 1.1; // Depth factor (0.4 far, 1.5 near)
      const y = canvas.height * (0.1 + Math.random() * 0.8);

      glyphs.push({
        type,
        z,
        // If forceX is provided, use it (for initial fill), else start off-screen
        x: forceX !== null ? forceX : canvas.width + 200,
        baseY: y,
        speed: (0.04 + Math.random() * 0.05) * z, // Farther = Slower
        spin: Math.random() * Math.PI * 2,
        spinSpeed: (0.001 + Math.random() * 0.008) * (Math.random() > 0.5 ? 1 : -1),
        wobbleAmp: (8 + Math.random() * 15) * z,
        wobbleFreq: 0.0008 + Math.random() * 0.001,
        wobblePhase: Math.random() * Math.PI * 2,
        drift: (Math.random() * 0.03 - 0.015) * z,
      });
    };

    const drawProjectedShadow = (x, y, fontSize, rotation, lightX, lightY, z) => {
      const halfW = (fontSize * 0.6) / 2;
      const halfH = fontSize / 4;
      const localCorners = [
        { x: -halfW, y: -halfH }, { x: +halfW, y: -halfH },
        { x: +halfW, y: +halfH }, { x: -halfW, y: +halfH },
      ];

      const rotatedCorners = localCorners.map(({ x: lx, y: ly }) => {
        const rx = lx * Math.cos(rotation) - ly * Math.sin(rotation);
        const ry = lx * Math.sin(rotation) + ly * Math.cos(rotation);
        return { x: x + rx, y: y + ry };
      });

      const lightAngle = Math.atan2(lightY - y, lightX - x);
      // Shadow gets more transparent the "farther" (smaller z) it is
      const shadowAlpha = (0.2 + (z - 0.4) * 0.5).toFixed(2);
      ctx.fillStyle = `rgba(255, 255, 255, ${shadowAlpha})`;

      for (let i = 0; i < 4; i++) {
        const a = rotatedCorners[i];
        const b = rotatedCorners[(i + 1) % 4];
        const dx = Math.sin(-lightAngle - Math.PI / 2);
        const dy = Math.cos(-lightAngle - Math.PI / 2);
        const aEnd = { x: a.x + SHADOW_LENGTH * dx, y: a.y + SHADOW_LENGTH * dy };
        const bEnd = { x: b.x + SHADOW_LENGTH * dx, y: b.y + SHADOW_LENGTH * dy };

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(bEnd.x, bEnd.y);
        ctx.lineTo(aEnd.x, aEnd.y);
        ctx.closePath();
        ctx.fill();
      }
    };

    const drawScene = () => {
      const timestamp = performance.now();
      const dt = timestamp - lastTime;
      lastTime = timestamp;
      spawnAccumulator += dt;

      // Steady stream spawning
      while (spawnAccumulator >= SPAWN_INTERVAL_MS) {
        spawnAccumulator -= SPAWN_INTERVAL_MS;
        const types = ["hour", "minute", "period"];
        spawnGlyph(types[Math.floor(Math.random() * types.length)]);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Background
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, CENTER_LIGHT_RADIUS);
      grad.addColorStop(0, "#828A99");
      grad.addColorStop(1, "#4A628E");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const timeParts = getCurrentTimeParts();
      const baseFontSize = Math.max(70, Math.min(canvas.width, canvas.height) * 0.12);

      // --- PARALLAX SORTING ---
      // Sort by z-index so larger/closer objects are drawn last (on top)
      glyphs.sort((a, b) => a.z - b.z);

      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        g.x -= g.speed * dt;
        g.spin += g.spinSpeed * dt;
        
        const wobble = Math.sin(timestamp * g.wobbleFreq + g.wobblePhase) * g.wobbleAmp;
        const y = g.baseY + wobble + g.drift * (timestamp * 0.05);

        const fontSize = (
          g.type === "hour" ? baseFontSize :
          g.type === "minute" ? baseFontSize * 0.8 :
          baseFontSize * 0.6
        ) * g.z;

        // Apply Depth of Field (Blur far away objects)
        // const blurAmount = Math.max(0, (1.2 - g.z) * 3);
        // ctx.filter = `blur(${blurAmount}px)`;

        drawProjectedShadow(g.x, y, fontSize, g.spin, cx, cy, g.z);

        ctx.save();
        ctx.translate(g.x, y);
        ctx.rotate(g.spin);
        ctx.font = `600 ${fontSize}px ${fontLoaded ? '"CustomOswald"' : 'sans-serif'}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = COLORS[g.type];
        ctx.fillText(timeParts[g.type], 0, 0);
        ctx.restore();
        
        // Reset filter for next glyph
        ctx.filter = "none";

        if (g.x < -canvas.width) glyphs.splice(i, 1);
      }
    };

    resizeCanvas();
    // Pre-populate the screen so it's not empty on load
    for (let i = 0; i < 12; i++) {
      const types = ["hour", "minute", "period"];
      spawnGlyph(types[i % 3], Math.random() * canvas.width * 1.2);
    }

    animationIntervalId = setInterval(drawScene, 16); // ~60fps equivalent
    window.addEventListener("resize", resizeCanvas);

    return () => {
      clearInterval(animationIntervalId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [fontLoaded]);

  return <canvas ref={canvasRef} style={style} />;
}
import { useEffect, useRef } from "react";
import backgroundImage from "./rootsu.gif";
import customFont from "./root.ttf";

export default function TwelfthRootsOfUnityWithClock() {
  const canvasRef = useRef(null);
  const clockRef = useRef(null);

  useEffect(() => {
    const font = new FontFace("CustomFont", `url(${customFont})`);
    font.load().then((loaded) => document.fonts.add(loaded));

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const clock = clockRef.current;
    const cctx = clock.getContext("2d");

    const n = 12;
    let step = 1;
    let alpha = 1;
    const buildSpeed = 5;
    const fadeSpeed = 0.01;
    let frameCount = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      clock.width = window.innerWidth;
      clock.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const drawDodecagon = (cx, cy, r) => {
      ctx.beginPath();
      for (let k = 0; k <= n; k++) {
        const angle = ((2 * Math.PI * k) / n) - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const drawBackgroundPattern = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Radial gradient
      const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/2);
      gradient.addColorStop(0, "#ff9ff3");
      gradient.addColorStop(0.5, "#EE6EBFFF");
      gradient.addColorStop(1, "#670505FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      

      // Dodecagon grid
      const radius = 50;
      const centerX = w / 2;
      const centerY = h / 2;
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;

      const spacingX = radius * 1.8;
      const spacingY = radius * 1.8;

      const cols = Math.ceil(w / spacingX) + 2;
      const rows = Math.ceil(h / spacingY) + 2;

      for (let i = -cols; i < cols; i++) {
        for (let j = -rows; j < rows; j++) {
          const xOffset = i * spacingX;
          const yOffset = j * spacingY;
          drawDodecagon(centerX + xOffset, centerY + yOffset, radius);
        }
      }
    };

    const drawRoots = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.65;
      const center = window.innerWidth / 2;
      const radius = size * 0.35;
      const pointRadius = size * 0.02;
      const textOffset = size * 0.04;

      const roots = [];
      for (let k = 0; k < n; k++) {
        const angle = Math.PI + (2 * Math.PI * k) / n;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        roots.push({ x, y });
      }

      drawBackgroundPattern();

      // Outer circle
      ctx.beginPath();
      ctx.arc(center, window.innerHeight/2, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "#F00927FF";
      ctx.lineWidth = size * 0.009;
      ctx.stroke();

      // Points & labels
      ctx.fillStyle = "#84700FFF";
      ctx.font = `${size * 0.08}px CustomFont`;
      roots.forEach((root, k) => {
        ctx.beginPath();
        ctx.arc(root.x, root.y, pointRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(`ω^${k}`, root.x + textOffset, root.y - textOffset);
      });

      // Connecting lines
      ctx.strokeStyle = `rgba(0,255,255,${alpha})`;
      ctx.lineWidth = size * 0.01;
      ctx.beginPath();
      for (let k = 0; k < step - 1; k++) {
        const start = roots[k];
        const end = roots[k + 1];
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
      }
      if (step === n) {
        const start = roots[n - 1];
        const end = roots[0];
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
      }
      ctx.stroke();

      frameCount++;
      if (frameCount % buildSpeed === 0) {
        step++;
        if (step > n) step = n;
      }
      if (step === n) {
        alpha -= fadeSpeed;
        if (alpha <= 0) {
          alpha = 1;
          step = 1;
        }
      }
    };

    const drawClock = () => {
      const size = clock.width;
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.45;
      cctx.clearRect(0, 0, size, size);

      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;

      const hourAngle = ((hr + min / 60) * 2 * Math.PI) / 12 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(centerX, centerY);
      cctx.lineTo(centerX + radius * 0.5 * Math.cos(hourAngle), centerY + radius * 0.5 * Math.sin(hourAngle));
      cctx.strokeStyle = "#000";
      cctx.lineWidth = 4;
      cctx.stroke();

      const minAngle = ((min + sec / 60) * 2 * Math.PI) / 60 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(centerX, centerY);
      cctx.lineTo(centerX + radius * 0.8 * Math.cos(minAngle), centerY + radius * 0.8 * Math.sin(minAngle));
      cctx.strokeStyle = "#000";
      cctx.lineWidth = 3;
      cctx.stroke();

      const secAngle = (sec * 2 * Math.PI) / 60 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(centerX, centerY);
      cctx.lineTo(centerX + radius * 0.9 * Math.cos(secAngle), centerY + radius * 0.9 * Math.sin(secAngle));
      cctx.strokeStyle = "red";
      cctx.lineWidth = 1;
      cctx.stroke();
    };

    const animate = () => {
      drawRoots();
      drawClock();
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <img
        src={backgroundImage}
        alt="Background"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "60%",
          objectFit: "contain",
          zIndex: 2,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "102%",
          zIndex: 1,

        }}
      />
      <canvas
        ref={clockRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          height: "50%",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
    </div>
  );
}

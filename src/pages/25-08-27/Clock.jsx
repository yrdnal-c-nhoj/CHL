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
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.6; // square
      canvas.width = size;
      canvas.height = size;
      clock.width = size;
      clock.height = size;
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
      const w = window.innerWidth;
      const h = window.innerHeight;

      // radial gradient with pink tones
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, "rgba(255,182,153,0.7)"); // soft pink
      gradient.addColorStop(0.5, "rgba(255,205,130,0.8)"); // hot pink
      gradient.addColorStop(1, "rgba(219,212,147,0.6)");   // pale violet red
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      const radius = canvas.width * 0.08;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // pinkish dodecagons
      ctx.strokeStyle = "#9A3232FF";
      
      ctx.lineWidth = 2;

      const spacingX = radius * 1.8;
      const spacingY = radius * 1.8;

      const cols = Math.ceil(window.innerWidth / spacingX) + 2;
      const rows = Math.ceil(window.innerHeight / spacingY) + 2;

      for (let i = -cols; i < cols; i++) {
        for (let j = -rows; j < rows; j++) {
          const xOffset = i * spacingX;
          const yOffset = j * spacingY;
          drawDodecagon(centerX + xOffset, centerY + yOffset, radius);
        }
      }
    };

    const drawRoots = () => {
      const size = canvas.width;
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.35;
      const pointRadius = size * 0.02;
      const textOffset = size * 0.04;

      const roots = [];
      for (let k = 0; k < n; k++) {
        const angle = Math.PI + (2 * Math.PI * k) / n;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        roots.push({ x, y });
      }

      drawBackgroundPattern();

      // Outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(255,0,0,0.8)"; // hot pink
      ctx.lineWidth = size * 0.009;
      ctx.stroke();


      // Roots points
      ctx.fillStyle = "#212321FF"; // soft pink
      ctx.font = `${size * 0.08}px CustomFont`;
      roots.forEach((root, k) => {
        ctx.beginPath();
        ctx.arc(root.x, root.y, pointRadius, 0, 2 * Math.PI);
        ctx.fill();

        // ω^k labels
        ctx.fillStyle = "#03341FFF"; // hot pink
        ctx.fillText(`ω^${k}`, root.x + textOffset, root.y - textOffset);
      });

      // Connecting lines
      ctx.strokeStyle = `rgba(255,255,0,${alpha})`; // soft pink, dynamic alpha
      ctx.lineWidth = size * 0.01;
      ctx.beginPath();
      for (let k = 0; k < step - 1; k++) {
        ctx.moveTo(roots[k].x, roots[k].y);
        ctx.lineTo(roots[k + 1].x, roots[k + 1].y);
      }
      if (step === n) {
        ctx.moveTo(roots[n - 1].x, roots[n - 1].y);
        ctx.lineTo(roots[0].x, roots[0].y);
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

      // hour
      const hourAngle = ((hr + min / 60) * 2 * Math.PI) / 12 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(centerX, centerY);
      cctx.lineTo(
        centerX + radius * 0.5 * Math.cos(hourAngle),
        centerY + radius * 0.5 * Math.sin(hourAngle)
      );
      cctx.strokeStyle = "#312E2EFF"; // pink hour hand
      cctx.lineWidth = 4;
      cctx.stroke();

      // minute
      const minAngle = ((min + sec / 60) * 2 * Math.PI) / 60 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(centerX, centerY);
      cctx.lineTo(
        centerX + radius * 0.8 * Math.cos(minAngle),
        centerY + radius * 0.8 * Math.sin(minAngle)
      );
      cctx.strokeStyle = "#312E2EFF"; // pink minute hand
      cctx.lineWidth = 3;
      cctx.stroke();

      // second
      const secAngle = (sec * 2 * Math.PI) / 60 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(centerX, centerY);
      cctx.lineTo(
        centerX + radius * 0.9 * Math.cos(secAngle),
        centerY + radius * 0.9 * Math.sin(secAngle)
      );
      cctx.strokeStyle = "#312E2EFF"; // pink second hand
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
        backgroundColor: "#964444FF", // outer pink background
      }}
    >
      <div
        style={{
          position: "relative",
          width: "60vmin",
          height: "60vmin",
        }}
      >
        <img
          src={backgroundImage}
          alt="Background"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
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
            height: "100%",
            zIndex: 1,
          }}
        />
        <canvas
          ref={clockRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      </div>
    </div>
  );
}

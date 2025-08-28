import { useEffect, useRef } from "react";
import backgroundImage from "./rootsu.gif"; // Image in same folder, imported as module
import customFont from "./root.ttf"; // Font in same folder, imported as module

export default function TwelfthRootsOfUnityWithClock() {
  const canvasRef = useRef(null);
  const clockRef = useRef(null);
  const fontRef = useRef(null); // Store font loading state

  useEffect(() => {
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

    // Load font once at component mount
    const font = new FontFace("CustomFont", `url(${customFont})`);
    font.load()
      .then((loadedFont) => {
        fontRef.current = loadedFont;
      })
      .catch((error) => {
        console.error("Font loading failed:", error);
        fontRef.current = "sans-serif";
      });

    const resize = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.6;
      canvas.width = size;
      canvas.height = size;
      clock.width = size;
      clock.height = size;
    };

    resize();
    window.addEventListener("resize", resize);

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

      ctx.clearRect(0, 0, size, size);

      // Outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(255,0,0,0.3)";
      ctx.lineWidth = size * 0.009;
      ctx.stroke();

      // Set font (use loaded font or fallback)
      ctx.font = `${size * 0.08}px ${
        fontRef.current === "sans-serif" ? "sans-serif" : "CustomFont"
      }`;

      // Roots + labels
      roots.forEach((root, k) => {
        ctx.beginPath();
        ctx.arc(root.x, root.y, pointRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#212321FF";
        ctx.fill();

        ctx.fillStyle = "#03341FFF";
        ctx.fillText(`ω^${k}`, root.x + textOffset, root.y - textOffset);
      });

      // Connecting lines
      ctx.strokeStyle = `rgba(255,255,0,${alpha})`;
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

      // Hour
      const hourAngle = ((hr + min / 60) * 2 * Math.PI) / 12 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(centerX, centerY);
      cctx.lineTo(
        centerX + radius * 0.5 * Math.cos(hourAngle),
        centerY + radius * 0.5 * Math.sin(hourAngle)
      );
      cctx.strokeStyle = "#312E2EFF";
      cctx.lineWidth = 0.3 * (size / 100);
      cctx.stroke();

      // Minute
      const minAngle = ((min + sec / 60) * 2 * Math.PI) / 60 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(centerX, centerY);
      cctx.lineTo(
        centerX + radius * 0.8 * Math.cos(minAngle),
        centerY + radius * 0.8 * Math.sin(minAngle)
      );
      cctx.strokeStyle = "#312E2EFF";
      cctx.lineWidth = 0.3 * (size / 100);
      cctx.stroke();

      // Second
      const secAngle = (sec * 2 * Math.PI) / 60 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(centerX, centerY);
      cctx.lineTo(
        centerX + radius * 0.9 * Math.cos(secAngle),
        centerY + radius * 0.9 * Math.sin(secAngle)
      );
      cctx.strokeStyle = "#1A1C1AFF";
      cctx.lineWidth = 0.3 * (size / 100);
      cctx.stroke();
    };

    const animate = () => {
      drawRoots();
      drawClock();
      requestAnimationFrame(animate);
    };

    font.load()
      .then(() => animate())
      .catch(() => animate());

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
        backgroundColor: "rgba(219,212,147,0.9)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "80vmin",
          height: "80vmin",
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
            height: "95%",
            objectFit: "contain",
            zIndex: 2,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />
        <canvas
          ref={clockRef}
          style={{
            position: "absolute",
            inset: 0,
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

import { useEffect, useRef } from "react";
import backgroundImage from "./rootsu.gif";
import customFont from "./root.ttf";

export default function TwelfthRootsOfUnityWithClock() {
  const canvasRef = useRef(null);
  const clockRef = useRef(null);
  const fontRef = useRef("sans-serif");

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

    const font = new FontFace("CustomFont", `url(${customFont})`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        fontRef.current = "CustomFont";
      })
      .catch(() => (fontRef.current = "sans-serif"))
      .finally(() => animate());

    const resize = () => {
      const containerSize = Math.min(window.innerWidth, window.innerHeight) * 0.8; // slightly bigger
      const dpr = window.devicePixelRatio || 1;

      canvas.width = containerSize * dpr;
      canvas.height = containerSize * dpr;
      clock.width = containerSize * dpr;
      clock.height = containerSize * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      canvas.style.width = `${containerSize}px`;
      canvas.style.height = `${containerSize}px`;
      clock.style.width = `${containerSize}px`;
      clock.style.height = `${containerSize}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    const drawRoots = () => {
      const size = canvas.width / (window.devicePixelRatio || 1);
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

      ctx.font = `${size * 0.08}px ${fontRef.current}`;
      ctx.fillStyle = "#03341F";

      roots.forEach((root, k) => {
        ctx.beginPath();
        ctx.arc(root.x, root.y, pointRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#212321";
        ctx.fill();

        let tx = root.x;
        let ty = root.y;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw labels directly next to points
        const angle = Math.atan2(root.y - centerY, root.x - centerX);
        const labelDist = radius * 0.15;
        tx = centerX + (radius + labelDist) * Math.cos(angle);
        ty = centerY + (radius + labelDist) * Math.sin(angle);

        ctx.fillText(`ω^${k}`, tx, ty);
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
      const size = clock.width / (window.devicePixelRatio || 1);
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.45;
      cctx.clearRect(0, 0, size, size);

      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;

      const hourAngle = ((hr + min / 60) * 2 * Math.PI) / 12 - Math.PI / 2;
      const minAngle = ((min + sec / 60) * 2 * Math.PI) / 60 - Math.PI / 2;
      const secAngle = (sec * 2 * Math.PI) / 60 - Math.PI / 2;

      const drawHand = (angle, length, color, width) => {
        cctx.beginPath();
        cctx.moveTo(centerX, centerY);
        cctx.lineTo(centerX + length * Math.cos(angle), centerY + length * Math.sin(angle));
        cctx.strokeStyle = color;
        cctx.lineWidth = width;
        cctx.stroke();
      };

      drawHand(hourAngle, radius * 0.5, "#312E2E", 0.3 * (size / 100));
      drawHand(minAngle, radius * 0.8, "#312E2E", 0.3 * (size / 100));
      drawHand(secAngle, radius * 0.9, "#1A1C1A", 0.3 * (size / 100));
    };

    let animationId;
    const animate = () => {
      drawRoots();
      drawClock();
      animationId = requestAnimationFrame(animate);
    };

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle, #F9C7B4 0%, #D8CFCF 90%)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "80vmin",
          height: "80vmin",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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

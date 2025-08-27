import { useEffect, useRef } from "react";
import backgroundImage from "./rootsu.gif";
import customFont from "./root.ttf";

export default function TwelfthRootsOfUnityWithClock() {
  const canvasRef = useRef(null);
  const clockRef = useRef(null);

  useEffect(() => {
    // Load custom font
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
      const size = Math.min(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
      canvas.width = size;
      canvas.height = size;

      clock.width = 500;
      clock.height = 500;
    };

    resize();
    window.addEventListener("resize", resize);

    const drawRoots = () => {
      const size = canvas.width;
      const center = size / 2;
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

      ctx.clearRect(0, 0, size, size);

      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "#F00927FF";
      ctx.lineWidth = size * 0.009;
      ctx.stroke();

      ctx.fillStyle = "#84700FFF";
      ctx.font = `${size * 0.08}px CustomFont`;
      roots.forEach((root, k) => {
        ctx.beginPath();
        ctx.arc(root.x, root.y, pointRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(`ω^${k}`, root.x + textOffset, root.y - textOffset);
      });

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
      const center = size / 2;
      const radius = size * 0.45;
      cctx.clearRect(0, 0, size, size);

      // Clock face
      cctx.beginPath();
      cctx.arc(center, center, radius, 0, 2 * Math.PI);
      cctx.fillStyle = "transparent";
      cctx.fill();


      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;

      // Hour hand
      const hourAngle = ((hr + min / 60) * 2 * Math.PI) / 12 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(center, center);
      cctx.lineTo(center + radius * 0.5 * Math.cos(hourAngle), center + radius * 0.5 * Math.sin(hourAngle));
      cctx.strokeStyle = "#000";
      cctx.lineWidth = 4;
      cctx.stroke();

      // Minute hand
      const minAngle = ((min + sec / 60) * 2 * Math.PI) / 60 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(center, center);
      cctx.lineTo(center + radius * 0.8 * Math.cos(minAngle), center + radius * 0.8 * Math.sin(minAngle));
      cctx.strokeStyle = "#000";
      cctx.lineWidth = 3;
      cctx.stroke();

      // Second hand
      const secAngle = (sec * 2 * Math.PI) / 60 - Math.PI / 2;
      cctx.beginPath();
      cctx.moveTo(center, center);
      cctx.lineTo(center + radius * 0.9 * Math.cos(secAngle), center + radius * 0.9 * Math.sin(secAngle));
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
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          width: "65vw",
          height: "65vw",
          position: "relative",
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
            zIndex: 1,
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
            zIndex: 5,
          }}
        />
        <canvas
          ref={clockRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "200px",
            height: "200px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}

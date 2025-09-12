import React, { useEffect, useRef } from "react";

const StarsParallax = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate stars once
    const generateStars = (count, sizeMin, sizeMax, speed) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (sizeMax - sizeMin) + sizeMin,
        speed,
      }));

    const near = generateStars(50, 0.8, 2.7, 0.5);
    const mid = generateStars(100, 0.5, 2.5, 0.);
    const far = generateStars(250, 0.5, 2.0, 0.2);

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawLayer = (stars, color, opacity) => {
        ctx.fillStyle = color;
        stars.forEach((star) => {
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();

          // move star
          star.y -= star.speed;
          if (star.y < 0) {
            star.y = canvas.height;
            star.x = Math.random() * canvas.width;
          }
        });
        ctx.globalAlpha = 1.0;
      };

      drawLayer(far, "#E5EAF8", 0.4);
      drawLayer(mid, "#F9E7E7", 0.6);
      drawLayer(near, "#F4F3E1", 0.8);

      requestAnimationFrame(drawStars);
    };

    drawStars();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100dvh",
        position: "absolute",
        top: 0,
        left: 0,
        background: "#000",
        zIndex: 0,
      }}
    />
  );
};

const Clock = () => {
  const faceRef = useRef(null);
  const sheenRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    const dpr = window.devicePixelRatio || 1;

    const createCanvasContext = (ref) => {
      const canvas = ref.current;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    };

    const faceCtx = createCanvasContext(faceRef);
    const sheenCtx = createCanvasContext(sheenRef);
    const hourCtx = createCanvasContext(hourRef);
    const minuteCtx = createCanvasContext(minuteRef);
    const secondCtx = createCanvasContext(secondRef);

    const radius = size / 2;
    const hourNumbers = ["🌕", "🌔", "🌓", "🌒", "🌙", "🌜", "🌚", "🌛", "🌙", "🌘", "🌗", "🌖"];

    // ✅ safer filter support check
    const supportsFilter = typeof faceCtx.filter !== "undefined";

    const drawClockFace = () => {
      faceCtx.save();
      faceCtx.translate(radius, radius);
      faceCtx.imageSmoothingEnabled = false;

      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 * Math.PI) / 180;
        faceCtx.save();
        faceCtx.rotate(angle);
        faceCtx.translate(0, -radius * 0.65);
        faceCtx.rotate(-angle);

        faceCtx.font = "3rem Times New Roman";
        faceCtx.textAlign = "center";
        faceCtx.textBaseline = "middle";

        faceCtx.shadowColor = "rgba(220, 235, 255, 0.9)";
        faceCtx.shadowBlur = 10;
        faceCtx.shadowOffsetX = 1;
        faceCtx.shadowOffsetY = 1;

        if (supportsFilter) {
          faceCtx.filter = "brightness(110%) contrast(80%)";
          faceCtx.fillStyle = "#e0e0e0";
        } else {
          faceCtx.filter = "none";
          faceCtx.fillStyle = "#b0c4de";
        }

        faceCtx.fillText(hourNumbers[i], 0, 0);
        faceCtx.restore();
      }

      faceCtx.beginPath();
      faceCtx.arc(0, 0, radius * 0.01, 0, 2 * Math.PI);
      faceCtx.fillStyle = "white";
      faceCtx.fill();
      faceCtx.restore();
    };

    const drawHand = (ctx, value, max, length, width) => {
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate((value / max) * 2 * Math.PI);

      const grad = ctx.createLinearGradient(0, 0, 0, -radius * length);
      grad.addColorStop(0, "#CFCCCC80");
      grad.addColorStop(0.5, "#79787880");
      grad.addColorStop(1, "#B2B0B080");

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -radius * length);
      ctx.lineWidth = width;
      ctx.strokeStyle = grad;
      ctx.lineCap = "round";

      ctx.shadowColor = "rgba(200, 220, 255, 0.8)";
      ctx.shadowBlur = 12;

      ctx.stroke();
      ctx.restore();
    };

    let sheenAngle = 0;
    const drawSheen = () => {
      sheenCtx.clearRect(0, 0, size, size);
      sheenCtx.save();
      sheenCtx.translate(radius, radius);
      sheenCtx.rotate(sheenAngle);

      const grad = sheenCtx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
      grad.addColorStop(0, "rgba(255,255,255,0.1)");
      grad.addColorStop(0.4, "rgba(200,200,200,0.05)");
      grad.addColorStop(1, "rgba(255,255,255,0)");

      sheenCtx.fillStyle = grad;
      sheenCtx.beginPath();
      sheenCtx.arc(0, 0, radius, 0, 2 * Math.PI);
      sheenCtx.fill();
      sheenCtx.restore();

      sheenAngle += 0.002;
      requestAnimationFrame(drawSheen);
    };

    const startClock = () => {
      drawClockFace();
      drawSheen();

      const updateClock = () => {
        const now = new Date();
        const hours = (now.getHours() % 12) + now.getMinutes() / 60 + now.getSeconds() / 3600;
        const minutes = now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000;
        const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

        drawHand(hourCtx, hours, 12, 0.5, 8);
        drawHand(minuteCtx, minutes, 60, 0.7, 5);
        drawHand(secondCtx, seconds, 60, 0.8, 3);

        requestAnimationFrame(updateClock);
      };

      updateClock();
    };

    startClock();
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        height: "100dvh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
        background: "transparent",
      }}
    >
      <canvas ref={faceRef} style={{ position: "absolute", borderRadius: "50%", zIndex: 2 }} />
      <canvas ref={sheenRef} style={{ position: "absolute", borderRadius: "50%", zIndex: 3, pointerEvents: "none" }} />
      <canvas ref={hourRef} style={{ position: "absolute", borderRadius: "50%", zIndex: 3 }} />
      <canvas ref={minuteRef} style={{ position: "absolute", borderRadius: "50%", zIndex: 4 }} />
      <canvas ref={secondRef} style={{ position: "absolute", borderRadius: "50%", zIndex: 5 }} />
    </div>
  );
};

const App = () => {
  return (
    <div style={{ width: "100vw", height: "100dvh", position: "relative", overflow: "hidden" }}>
      <StarsParallax />
      <Clock />
    </div>
  );
};

export default App;

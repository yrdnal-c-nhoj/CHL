import React, { useEffect, useState, useRef } from "react";

const StarsParallax = () => {
  const [stars, setStars] = useState({ near: [], mid: [], far: [] });

  useEffect(() => {
    const generateStars = (count, sizeMin, sizeMax, speed) => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (sizeMax - sizeMin) + sizeMin,
        speed: speed
      }));
    };

    setStars({
      near: generateStars(50, 0.1, 0.27, 0.5),
      mid: generateStars(100, 0.05, 0.25, 0.4),
      far: generateStars(250, 0.1, 0.2, 0.3)
    });

    const animateStars = () => {
      setStars((prev) => ({
        near: prev.near.map(star => ({
          ...star,
          y: star.y - star.speed < 0 ? 100 : star.y - star.speed
        })),
        mid: prev.mid.map(star => ({
          ...star,
          y: star.y - star.speed < 0 ? 100 : star.y - star.speed
        })),
        far: prev.far.map(star => ({
          ...star,
          y: star.y - star.speed < 0 ? 100 : star.y - star.speed
        }))
      }));
    };

    const interval = setInterval(animateStars, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        background: "#000",
        position: "absolute", // sits behind everything else
        overflow: "hidden",
        zIndex: 0
      }}
    >
      {stars.far.map((star, index) => (
        <div
          key={`far-${index}`}
          style={{
            position: "absolute",
            left: `${star.x}vw`,
            top: `${star.y}dvh`,
            width: `${star.size}rem`,
            height: `${star.size}rem`,
            background: "#E5EAF8FF",
            borderRadius: "50%",
            opacity: 0.4
          }}
        />
      ))}
      {stars.mid.map((star, index) => (
        <div
          key={`mid-${index}`}
          style={{
            position: "absolute",
            left: `${star.x}vw`,
            top: `${star.y}dvh`,
            width: `${star.size}rem`,
            height: `${star.size}rem`,
            background: "#F9E7E7FF",
            borderRadius: "50%",
            opacity: 0.6
          }}
        />
      ))}
      {stars.near.map((star, index) => (
        <div
          key={`near-${index}`}
          style={{
            position: "absolute",
            left: `${star.x}vw`,
            top: `${star.y}dvh`,
            width: `${star.size}rem`,
            height: `${star.size}rem`,
            background: "#F4F3E1FF",
            borderRadius: "50%",
            opacity: 0.8
          }}
        />
      ))}
    </div>
  );
};

const Clock = () => {
  const faceRef = useRef(null);
  const sheenRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.8; // shrink to fit
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
    const hourNumbers = ["🌕", "🌔", "🌓", "🌒", "🌙", "🌜", "🌚", "🌜", "🌙", "🌘", "🌗", "🌖"];

    // Check for filter support
    let supportsFilter = false;
    try {
      faceCtx.filter = "none";
      supportsFilter = true;
      faceCtx.filter = "";
    } catch (e) {
      supportsFilter = false;
    }

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
          faceCtx.filter = "hue-rotate(170deg) saturate(40%) brightness(90%) contrast(80%)";
          faceCtx.fillStyle = "#e0e0e0";
        } else {
          faceCtx.filter = "none";
          faceCtx.fillStyle = "#c0d4e8";
        }

        if ((i === 2 || i === 7 || i === 8) && hourNumbers[i] === "🌙") {
          faceCtx.save();
          faceCtx.scale(-1, 1);
          faceCtx.fillText(hourNumbers[i], 0, 0);
          faceCtx.restore();
        } else {
          faceCtx.fillText(hourNumbers[i], 0, 0);
        }

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
        zIndex: 2, // always on top
        background: "transparent"
      }}
    >
      <canvas ref={faceRef} style={{ position: "absolute", borderRadius: "50%", zIndex: 2 }} />
      <canvas ref={sheenRef} style={{ position: "absolute", borderRadius: "50%", zIndex: 3, pointerEvents: "none" }} />
      <canvas ref={hourRef} style={{ position: "absolute", borderRadius: "50%", zIndex: 5 }} />
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

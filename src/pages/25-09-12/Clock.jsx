import React, { useEffect, useRef } from "react";

const StarsParallax = () => {
  const canvasRef = useRef(null);

  const STAR_LAYERS = [
    { count: 250, sizeMin: 0.5, sizeMax: 2.0, speed: 0.15, color: "#E5EAF8", opacity: 0.4 },
    { count: 100, sizeMin: 0.5, sizeMax: 2.5, speed: 0.2, color: "#F9E7E7", opacity: 0.6 },
    { count: 50, sizeMin: 0.8, sizeMax: 2.7, speed: 0.25, color: "#F4F3E1", opacity: 0.8 },
  ];

  const BACKGROUND_GRADIENT = [
    { stop: 0, color: "#383803FF" },
    { stop: 1, color: "#15023CFF" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const generateStars = (count, sizeMin, sizeMax, speed) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (sizeMax - sizeMin) + sizeMin,
        speed,
      }));

    const stars = STAR_LAYERS.map((layer) => generateStars(layer.count, layer.sizeMin, layer.sizeMax, layer.speed));

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      BACKGROUND_GRADIENT.forEach(({ stop, color }) => gradient.addColorStop(stop, color));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((layer, index) => {
        ctx.fillStyle = STAR_LAYERS[index].color;
        layer.forEach((star) => {
          ctx.globalAlpha = STAR_LAYERS[index].opacity;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();

          star.y -= star.speed;
          if (star.y < 0) {
            star.y = canvas.height;
            star.x = Math.random() * canvas.width;
          }
        });
        ctx.globalAlpha = 1.0;
      });

      requestAnimationFrame(drawStars);
    };

    drawStars();

    return () => window.removeEventListener("resize", resizeCanvas);
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

  const CONFIG = {
    HOUR_NUMBERS: ["🌕", "🌔", "🌓", "🌒", "🌙", "🌛", "🌚", "🌜", "🌙", "🌘", "🌗", "🌖"],
    EMOJI_COLOR: "#C0C0C0", // Silver (maintained for consistency, though canvas emojis may ignore)
    CENTER_DOT_COLOR: "white",
    SHADOW_COLOR: "rgba(220, 215, 255)",
    SHADOW_BLUR: 40,
    HAND_SHADOW_COLOR: "rgba(200, 220, 255, 0.8)",
    HAND_SHADOW_BLUR: 12,
    SHEEN_GRADIENT: [
      { stop: 0, color: "rgba(255,255,255,0.1)" },
      { stop: 0.4, color: "rgba(200,200,200,0.05)" },
      { stop: 1, color: "rgba(255,255,255,0)" },
    ],
    HAND_GRADIENT: [
      { stop: 0, color: "#CFCCCC80" },
      { stop: 0.5, color: "#79787880" },
      { stop: 1, color: "#B2B0B080" },
    ],
    HAND_CONFIG: [
      { type: "hour", max: 12, length: 0.3, width: 20 },
      { type: "minute", max: 60, length: 0.45, width: 13 },
      { type: "second", max: 60, length: 0.5, width: 8 },
    ],
    SIZE_MULTIPLIER: 1.1,
    FONT_SIZES: { laptop: "5rem", phone: "3.3rem" },
    BREAKPOINT: 768,
  };

  useEffect(() => {
    const createCanvasContext = (ref, size, dpr) => {
      const canvas = ref.current;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    };

    const drawClockFace = (ctx, radius, fontSize, supportsFilter) => {
      ctx.save();
      ctx.translate(radius, radius);
      ctx.imageSmoothingEnabled = false;

      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 * Math.PI) / 180;
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(0, -radius * 0.65);
        ctx.rotate(-angle);

        ctx.font = `${fontSize} Times New Roman`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = CONFIG.SHADOW_COLOR;
        ctx.shadowBlur = CONFIG.SHADOW_BLUR;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = CONFIG.EMOJI_COLOR;

        if (i === 8) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.fillText(CONFIG.HOUR_NUMBERS[i], 0, 0);
          ctx.restore();
        } else {
          ctx.fillText(CONFIG.HOUR_NUMBERS[i], 0, 0);
        }

        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.01, 0, 2 * Math.PI);
      ctx.fillStyle = CONFIG.CENTER_DOT_COLOR;
      ctx.fill();
      ctx.restore();
    };

    const drawHand = (ctx, value, max, length, width, radius) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate((value / max) * 2 * Math.PI);

      const grad = ctx.createLinearGradient(0, 0, 0, -radius * length);
      CONFIG.HAND_GRADIENT.forEach(({ stop, color }) => grad.addColorStop(stop, color));

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -radius * length);
      ctx.lineWidth = width;
      ctx.strokeStyle = grad;
      ctx.lineCap = "round";
      ctx.shadowColor = CONFIG.HAND_SHADOW_COLOR;
      ctx.shadowBlur = CONFIG.HAND_SHADOW_BLUR;
      ctx.stroke();
      ctx.restore();
    };

    const drawSheen = (ctx, radius, sheenAngle) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(sheenAngle);

      const grad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
      CONFIG.SHEEN_GRADIENT.forEach(({ stop, color }) => grad.addColorStop(stop, color));

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    };

    const handleResize = () => {
      const isLaptop = window.innerWidth >= CONFIG.BREAKPOINT;
      const size = Math.min(window.innerWidth, window.innerHeight) * CONFIG.SIZE_MULTIPLIER;
      const fontSize = isLaptop ? CONFIG.FONT_SIZES.laptop : CONFIG.FONT_SIZES.phone;
      const dpr = window.devicePixelRatio || 1;

      const contexts = {
        face: createCanvasContext(faceRef, size, dpr),
        sheen: createCanvasContext(sheenRef, size, dpr),
        hour: createCanvasContext(hourRef, size, dpr),
        minute: createCanvasContext(minuteRef, size, dpr),
        second: createCanvasContext(secondRef, size, dpr),
      };

      const radius = size / 2;
      const supportsFilter = typeof contexts.face.filter !== "undefined";

      const startClock = () => {
        drawClockFace(contexts.face, radius, fontSize, supportsFilter);

        let sheenAngle = 0;
        const animateSheen = () => {
          drawSheen(contexts.sheen, radius, sheenAngle);
          sheenAngle += 0.002;
          requestAnimationFrame(animateSheen);
        };

        const updateClock = () => {
          const now = new Date();
          const hours = (now.getHours() % 12) + now.getMinutes() / 60 + now.getSeconds() / 3600;
          const minutes = now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000;
          const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

          drawHand(contexts.hour, hours, CONFIG.HAND_CONFIG[0].max, CONFIG.HAND_CONFIG[0].length, CONFIG.HAND_CONFIG[0].width, radius);
          drawHand(contexts.minute, minutes, CONFIG.HAND_CONFIG[1].max, CONFIG.HAND_CONFIG[1].length, CONFIG.HAND_CONFIG[1].width, radius);
          drawHand(contexts.second, seconds, CONFIG.HAND_CONFIG[2].max, CONFIG.HAND_CONFIG[2].length, CONFIG.HAND_CONFIG[2].width, radius);

          requestAnimationFrame(updateClock);
        };

        animateSheen();
        updateClock();
      };

      startClock();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
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
      <canvas
        ref={faceRef}
        style={{
          position: "absolute",
          borderRadius: "50%",
          zIndex: 2,
          filter: "grayscale(100%) brightness(120%) contrast(110%)", // Silver effect for emojis
        }}
      />
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
import React, { useEffect, useRef } from "react";

const App = () => {
  const starCanvasRef = useRef(null);
  const faceRef = useRef(null);
  const sheenRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const offscreenStarRef = useRef(null);

  const STAR_LAYERS = [
    { count: 190, sizeMin: 0.5, sizeMax: 2.0, speed: 0.15, color: "#E5EAF8", opacity: 0.4 },
    { count: 120, sizeMin: 0.5, sizeMax: 2.5, speed: 0.2, color: "#F9E7E7", opacity: 0.6 },
    { count: 70, sizeMin: 0.8, sizeMax: 2.7, speed: 0.25, color: "#F4F3E1", opacity: 0.8 },
  ];

  const CONFIG = {
    HOUR_NUMBERS: ["🌕", "🌔", "🌓", "🌒", "🌙", "🌛", "🌚", "🌜", "🌙", "🌘", "🌗", "🌖"],
    CENTER_DOT_COLOR: "white",
    SHADOW_COLOR: "rgba(220, 215, 255, 0.5)",
    SHADOW_BLUR: 20,
    HAND_SHADOW_COLOR: "rgba(200, 220, 255, 0.5)",
    HAND_SHADOW_BLUR: 15,
    SHEEN_GRADIENT: [
      { stop: 0, color: "rgba(255,255,255,0.1)" },
      { stop: 0.4, color: "rgba(200,200,200,0.05)" },
      { stop: 1, color: "rgba(255,255,255,0)" },
    ],
    HAND_GRADIENT: [
      { stop: 0, color: "#0E0E0E80" },
      { stop: 0.5, color: "#9F9FA980" },
      { stop: 1, color: "#F4F3F380" },
    ],
    HAND_CONFIG: [
      { type: "hour", max: 12, length: 0.3, width: 20 },
      { type: "minute", max: 60, length: 0.45, width: 13 },
      { type: "second", max: 60, length: 0.5, width: 8 },
    ],
    SIZE_MULTIPLIER: 1.1,
    FONT_SIZES: { laptop: "5rem", phone: "3rem" },
    BREAKPOINT: 768,
    DEBOUNCE_MS: 200,
  };

  useEffect(() => {
    const starCanvas = starCanvasRef.current;
    const faceCanvas = faceRef.current;
    const sheenCanvas = sheenRef.current;
    const hourCanvas = hourRef.current;
    const minuteCanvas = minuteRef.current;
    const secondCanvas = secondRef.current;
    offscreenStarRef.current = document.createElement("canvas");

    const starCtx = starCanvas?.getContext("2d");
    const faceCtx = faceCanvas?.getContext("2d");
    const sheenCtx = sheenCanvas?.getContext("2d");
    const hourCtx = hourCanvas?.getContext("2d");
    const minuteCtx = minuteCanvas?.getContext("2d");
    const secondCtx = secondCanvas?.getContext("2d");

    if (!starCtx || !faceCtx || !sheenCtx || !hourCtx || !minuteCtx || !secondCtx) {
      console.error("Failed to get canvas context");
      return;
    }

    let stars;
    let radius;
    let fontSize;
    let sheenAngle = 0;
    let resizeTimeout;

    const generateStars = (count, sizeMin, sizeMax, speed) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        size: Math.random() * (sizeMax - sizeMin) + sizeMin,
        speed,
        twinklePhase: Math.random() * Math.PI * 2,
      }));

    const createCanvasContext = (canvas, size, dpr) => {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    };

    const drawStarBackground = (ctx, width, height) => {
      const verticalGradient = ctx.createLinearGradient(0, 0, 0, height);
      verticalGradient.addColorStop(0, "#0E0133FF");
      verticalGradient.addColorStop(1, "#072702FF");
      ctx.fillStyle = verticalGradient;
      ctx.fillRect(0, 0, width, height);
    };

    const drawClockFace = (ctx, radius, fontSize) => {
      ctx.save();
      ctx.translate(radius, radius);
      ctx.imageSmoothingEnabled = false;

      // Draw central dot
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, 2 * Math.PI);
      ctx.fillStyle = CONFIG.CENTER_DOT_COLOR;
      ctx.fill();

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
      ctx.restore();
    };

    const drawHand = (ctx, value, max, length, width, radius) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.globalAlpha = 0.4;
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

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const size = Math.min(window.innerWidth, window.innerHeight) * CONFIG.SIZE_MULTIPLIER;
      fontSize = window.innerWidth >= CONFIG.BREAKPOINT ? CONFIG.FONT_SIZES.laptop : CONFIG.FONT_SIZES.phone;
      radius = size / 2;

      // Star canvas
      starCanvas.width = window.innerWidth * dpr;
      starCanvas.height = window.innerHeight * dpr;
      starCanvas.style.width = `${window.innerWidth}px`;
      starCanvas.style.height = `${window.innerHeight}px`;
      starCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Offscreen star background
      offscreenStarRef.current.width = starCanvas.width;
      offscreenStarRef.current.height = starCanvas.height;
      const offscreenStarCtx = offscreenStarRef.current.getContext("2d");
      offscreenStarCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStarBackground(offscreenStarCtx, window.innerWidth, window.innerHeight);

      // Clock canvases
      createCanvasContext(faceCanvas, size, dpr);
      createCanvasContext(sheenCanvas, size, dpr);
      createCanvasContext(hourCanvas, size, dpr);
      createCanvasContext(minuteCanvas, size, dpr);
      createCanvasContext(secondCanvas, size, dpr);

      stars = STAR_LAYERS.map((layer) =>
        generateStars(layer.count, layer.sizeMin, layer.sizeMax, layer.speed)
      );

      drawClockFace(faceCtx, radius, fontSize);
    };

    const animate = () => {
      starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      starCtx.drawImage(offscreenStarRef.current, 0, 0);

      stars.forEach((layer, index) => {
        layer.forEach((star) => {
          const twinkle = 0.5 + 0.5 * Math.sin(Date.now() * 0.002 + star.twinklePhase);
          starCtx.globalAlpha = STAR_LAYERS[index].opacity * twinkle;
          starCtx.fillStyle = STAR_LAYERS[index].color;
          starCtx.beginPath();
          starCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          starCtx.fill();

          star.y -= star.speed;
          if (star.y < 0) {
            star.y = starCanvas.height;
            star.x = Math.random() * starCanvas.width;
          }
        });
      });
      starCtx.globalAlpha = 1.0;

      const now = new Date();
      const hours = (now.getHours() % 12) + now.getMinutes() / 60 + now.getSeconds() / 3600;
      const minutes = now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000;
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

      drawHand(hourCtx, hours, CONFIG.HAND_CONFIG[0].max, CONFIG.HAND_CONFIG[0].length, CONFIG.HAND_CONFIG[0].width, radius);
      drawHand(minuteCtx, minutes, CONFIG.HAND_CONFIG[1].max, CONFIG.HAND_CONFIG[1].length, CONFIG.HAND_CONFIG[1].width, radius);
      drawHand(secondCtx, seconds, CONFIG.HAND_CONFIG[2].max, CONFIG.HAND_CONFIG[2].length, CONFIG.HAND_CONFIG[2].width, radius);

      drawSheen(sheenCtx, radius, sheenAngle);
      sheenAngle += 0.002;

      requestAnimationFrame(animate);
    };

    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, CONFIG.DEBOUNCE_MS);
    };

    try {
      resize();
      requestAnimationFrame(animate);
      window.addEventListener("resize", debouncedResize);
    } catch (error) {
      console.error("Animation setup failed:", error);
    }

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100dvh", position: "relative", overflow: "hidden" }}>
      <canvas
        ref={starCanvasRef}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <canvas ref={faceRef} style={{ position: "absolute", borderRadius: "50%", filter: "grayscale(90%)" }} />
        <canvas ref={sheenRef} style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none" }} />
        <canvas ref={hourRef} style={{ position: "absolute", borderRadius: "50%" }} />
        <canvas ref={minuteRef} style={{ position: "absolute", borderRadius: "50%" }} />
        <canvas ref={secondRef} style={{ position: "absolute", borderRadius: "50%" }} />
      </div>
    </div>
  );
};

export default App;
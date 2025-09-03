import React, { useEffect, useRef } from "react";
import confFont from "./conf.ttf";
import confettiBg from "./conf2.gif";

const TOTAL_DIGITS = 160;

const ConfettiClock = () => {
  const containerRef = useRef(null);
  const digitsRef = useRef([]);

  useEffect(() => {
    const font = new FontFace("conf", `url(${confFont})`);
    font.load().then(() => {
      document.fonts.add(font);
    });
  }, []);

  const getCurrentTimeDigits = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0").split("");
    const minutes = now.getMinutes().toString().padStart(2, "0").split("");
    return [...hours, ...minutes];
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    digitsRef.current = [];

    for (let i = 0; i < TOTAL_DIGITS; i++) {
      const div = document.createElement("div");
      div.className = "falling-digit";
      container.appendChild(div);
      digitsRef.current.push(div);
    }
  }, []);

  useEffect(() => {
    if (digitsRef.current.length === 0) return;

    const colors = ["#ff1493", "#800080", "#ffa500"];
    const easingOptions = [
      "ease-in",
      "ease-out",
      "ease-in-out",
      "cubic-bezier(0.25, 1, 0.5, 1)",
      "cubic-bezier(0.42, 0, 0.58, 1)",
      "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
    ];

    digitsRef.current.forEach((el, i) => {
      const fontSize = Math.random() * 12 + 4; // 4vh to 16vh
      el.style.fontSize = `${fontSize}vh`;
      el.style.fontFamily = "'conf', sans-serif";
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
      el.style.position = "absolute";
      el.style.opacity = "0.95";
      el.style.pointerEvents = "none";
      el.style.willChange = "transform";
      el.style.zIndex = "2";

      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = "0";

      const duration = Math.random() * 8 + 3;
      const delay = (i / TOTAL_DIGITS) * duration;

      const rotateX = Math.random() * 1080 - 540;
      const rotateY = Math.random() * 1080 - 540;
      const rotateZ = Math.random() * 1080 - 540;
      const translateX = Math.random() * 40 - 20;
      const translateY = 120;

      const easing = easingOptions[Math.floor(Math.random() * easingOptions.length)];
      const animationName = Math.random() > 0.5 ? "leafFall" : "fall3d";

      el.style.animation = `${animationName} ${duration}s ${easing} infinite`;
      el.style.animationDelay = `-${delay}s`;

      el.style.setProperty("--rotateX", `${rotateX}deg`);
      el.style.setProperty("--rotateY", `${rotateY}deg`);
      el.style.setProperty("--rotateZ", `${rotateZ}deg`);
      el.style.setProperty("--translateX", `${translateX}vw`);
      el.style.setProperty("--translateY", `${translateY}vh`);
    });

    const updateInterval = setInterval(() => {
      const timeDigits = getCurrentTimeDigits();
      digitsRef.current.forEach((el, i) => {
        el.textContent = timeDigits[i % timeDigits.length];
      });
    }, 10000);

    const timeDigits = getCurrentTimeDigits();
    digitsRef.current.forEach((el, i) => {
      el.textContent = timeDigits[i % timeDigits.length];
    });

    return () => clearInterval(updateInterval);
  }, []);

  return (
    <>
      {/* Gradient Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          background: "linear-gradient(to top, #ff0000, #ffff00)", // red to yellow gradient
          zIndex: 0,
        }}
      />

      {/* Confetti GIF overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          backgroundImage: `url(${confettiBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Falling digits */}
      <div
        ref={containerRef}
        style={{
          margin: 0,
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 2,
        }}
      />

      <style>{`
        @keyframes fall3d {
          0% {
            transform: translateY(-20vh) translateX(0vw)
                       rotateX(0) rotateY(0) rotateZ(0);
            opacity: 1;
          }
          100% {
            transform:
              translateY(120vh) translateX(var(--translateX))
              rotateX(var(--rotateX))
              rotateY(var(--rotateY))
              rotateZ(var(--rotateZ));
            opacity: 1;
          }
        }

        @keyframes leafFall {
          0% {
            transform: translateY(-20vh) translateX(0vw)
                       rotateX(0) rotateY(0) rotateZ(0);
            opacity: 1;
          }
          25% {
            transform: translateY(30vh) translateX(calc(var(--translateX) * 0.3))
                       rotateX(calc(var(--rotateX) * 0.25))
                       rotateY(calc(var(--rotateY) * 0.25))
                       rotateZ(calc(var(--rotateZ) * 0.25));
            opacity: 1;
          }
          50% {
            transform: translateY(60vh) translateX(calc(var(--translateX) * -0.3))
                       rotateX(calc(var(--rotateX) * 0.5))
                       rotateY(calc(var(--rotateY) * 0.5))
                       rotateZ(calc(var(--rotateZ) * 0.5));
            opacity: 1;
          }
          75% {
            transform: translateY(90vh) translateX(calc(var(--translateX) * 0.3))
                       rotateX(calc(var(--rotateX) * 0.75))
                       rotateY(calc(var(--rotateY) * 0.75))
                       rotateZ(calc(var(--rotateZ) * 0.75));
            opacity: 1;
          }
          100% {
            transform:
              translateY(120vh) translateX(var(--translateX))
              rotateX(var(--rotateX))
              rotateY(var(--rotateY))
              rotateZ(var(--rotateZ));
            opacity: 1;
          }
        }

        .falling-digit {
          user-select: none;
          pointer-events: none;
          position: absolute;
          font-weight: 700;
          mix-blend-mode: screen;
          will-change: transform;
        }
      `}</style>
    </>
  );
};

export default ConfettiClock;

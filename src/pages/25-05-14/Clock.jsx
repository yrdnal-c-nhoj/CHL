import React, { useEffect } from "react";
import dottedFont from "./dotted.ttf"; // Custom dotted font for clock display

export default function Clock() {
  useEffect(() => {
    const SCOPE_ID = "ri-clock-2025-11-01";
    const fontName = "DottedRough2025_11_01";
    let animationFrameId;

    // Utility functions
    const getTimeDigits = (srTime) => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, "0");
      srTime.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      return [...(String(hours) + minutes)];
    };

    const randomColor = () => {
      const hues = [0, 120, 240, 300];
      return `hsl(${hues[Math.floor(Math.random() * hues.length)]}, 70%, 50%)`;
    };

    function randomFontSizeVH() { return `clamp(4rem, 6vh, 6rem)`; }
    function randomScale() { return (Math.random() * 0.5 + 0.75).toFixed(2); }
    function randomRotation() { return `${Math.floor(Math.random() * 720 - 360)}deg`; }
    function randomFinalAngle() { return `${Math.floor(Math.random() * 31 - 15)}deg`; }

    function randomDirectionOffset() {
      const side = ["top", "bottom", "left", "right"][Math.floor(Math.random() * 4)];
      const vw = 100, vh = 100;
      switch (side) {
        case "top": return { x: `${(Math.random() * vw).toFixed(2)}vw`, y: `-10vh` };
        case "bottom": return { x: `${(Math.random() * vw).toFixed(2)}vw`, y: `110vh` };
        case "left": return { x: `-10vw`, y: `${(Math.random() * vh).toFixed(2)}vh` };
        case "right": return { x: `110vw`, y: `${(Math.random() * vh).toFixed(2)}vh` };
        default: return { x: "0vw", y: "0vh" };
      }
    }

    const throwDigitsUp = (root, srTime) => {
      const digits = getTimeDigits(srTime);
      const fragment = document.createDocumentFragment();
      const digitCount = digits.length;
      const baseX = 50, spreadX = 10, baseY = 30, spreadY = 5, minSpacing = 8;
      const batchColor = randomColor();

      digits.forEach((char, index) => {
        const span = document.createElement("span");
        span.className = "digit";
        span.textContent = char;

        const xOffset = (index - (digitCount - 1) / 2) * minSpacing;
        const xFinal = `${(baseX + xOffset + (Math.random() * spreadX - spreadX / 2)).toFixed(2)}vw`;
        const yFinal = `${(baseY + (Math.random() * spreadY - spreadY / 2)).toFixed(2)}vh`;
        const scale = randomScale();
        const { x: xStart, y: yStart } = randomDirectionOffset();

        span.style.cssText = `
          --x-start: ${xStart};
          --y-start: ${yStart};
          --x-final: ${xFinal};
          --y-final: ${yFinal};
          --scale: ${scale};
          --rotate-x-start: ${randomRotation()};
          --rotate-y-start: ${randomRotation()};
          --rotate-z-start: ${randomRotation()};
          --rotate-z-final: ${randomFinalAngle()};
          --digit-fs: ${randomFontSizeVH()};
          --anim-duration: ${(10 + Math.random() * 8).toFixed(2)}s;
          color: ${batchColor};
          transition: opacity 1s ease;
        `;

        // Remove after 5 seconds with fade
        setTimeout(() => {
          span.style.opacity = "0";
          setTimeout(() => span.remove(), 1000); // Remove after fade completes
        }, 5000);

        fragment.appendChild(span);
      });

      root.appendChild(fragment);
    };

    const startClockLogic = () => {
      const root = document.getElementById(SCOPE_ID);
      const srTime = document.getElementById("screen-reader-time");
      if (!root || !srTime) return;

      const interval = 200; // 5 times per second
      let lastFrameTime = 0;

      const tick = (currentTime) => {
        if (currentTime - lastFrameTime >= interval) {
          throwDigitsUp(root, srTime);
          lastFrameTime = currentTime - ((currentTime - lastFrameTime) % interval);
        }
        animationFrameId = requestAnimationFrame(tick);
      };

      animationFrameId = requestAnimationFrame(tick);
    };

    // Inject font + styles
    const style = document.createElement("style");
    style.setAttribute("data-scope", SCOPE_ID);
    style.textContent = `
      @font-face {
        font-family: '${fontName}';
        src: url('${dottedFont}') format('truetype');
        font-display: swap;
      }
      #${SCOPE_ID} {
        width: 100vw; height: 100vh; overflow: hidden;
        position: relative; font-family: '${fontName}', system-ui;
        background-image: linear-gradient(180deg, rgb(21 84 89) 0%, rgb(228 207 249) 100%);
      }
      #${SCOPE_ID} .digit {
        position: absolute; left: 0; top: 0; will-change: transform, opacity;
        pointer-events: none; white-space: pre;
        font-size: var(--digit-fs, clamp(4rem, 6vh, 6rem));
        transform-origin: center center;
        transform-style: preserve-3d;
        animation: ri-fly-up var(--anim-duration, 12s) cubic-bezier(.2,.9,.3,1) forwards;
      }
      @keyframes ri-fly-up {
        0% { transform: translate(var(--x-start), var(--y-start)) rotateX(var(--rotate-x-start)) rotateY(var(--rotate-y-start)) rotateZ(var(--rotate-z-start)) scale(var(--scale)); opacity: 1; }
        15%, 90% { transform: translate(var(--x-final), var(--y-final)) rotateZ(var(--rotate-z-final)) scale(var(--scale)); opacity: 1; }
        100% { transform: translate(var(--x-final), var(--y-final)) rotateZ(var(--rotate-z-final)) scale(var(--scale)); opacity: 0; }
      }
      #${SCOPE_ID} #screen-reader-time {
        position: absolute !important; width: 1px; height: 1px;
        padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0);
        white-space: nowrap; border: 0;
      }
    `;
    document.head.appendChild(style);

    const font = new FontFace(fontName, `url(${dottedFont})`, { style: "normal", weight: "400" });
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      startClockLogic();
    }).catch(() => startClockLogic());

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.querySelectorAll(`style[data-scope="${SCOPE_ID}"]`).forEach(el => el.remove());
      document.querySelectorAll(`#${SCOPE_ID} .digit`).forEach(n => n.remove());
    };
  }, []);

  return (
    <div id="ri-clock-2025-11-01" role="timer" aria-label="Animated digital clock">
      <time id="screen-reader-time" aria-live="polite" />
    </div>
  );
}

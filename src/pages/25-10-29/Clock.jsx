import React, { useEffect } from "react";
import dottedFont from "./dotted.ttf"; // Custom dotted font for clock display

export default function Clock() {
  useEffect(() => {
    console.log("➡️ [Clock] useEffect started."); // START
    const SCOPE_ID = "ri-clock-2025-11-01";
    const fontName = "DottedRough2025_11_01";

    // Load font with FontFace API
    const font = new FontFace(fontName, `url(${dottedFont})`, { style: "normal", weight: "400" });
    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        console.log("✅ [Clock] Font loaded successfully."); // FONT LOAD SUCCESS
      })
      .catch((error) => {
        console.warn("❌ [Clock] Font loading failed:", error); // FONT LOAD FAILURE
      });

    // Inject scoped styles
    const style = document.createElement("style");
    style.setAttribute("data-scope", SCOPE_ID);
    style.textContent = `
      @font-face {
        font-family: '${fontName}';
        src: url('${dottedFont}') format('truetype');
        font-display: swap;
      }
      #${SCOPE_ID} {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-image: linear-gradient(180deg, rgb(21 84 89) 0%, rgb(228 207 249) 100%);
        position: relative;
        font-family: '${fontName}', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      }
      #${SCOPE_ID} .digit {
        position: absolute;
        left: 0;
        top: 0;
        will-change: transform, opacity;
        pointer-events: none;
        white-space: pre;
        font-size: var(--digit-fs, clamp(4rem, 6vh, 6rem));
        transform-origin: center center;
10/31/2025 3:07 PM
        transform-style: preserve-3d;
        animation: ri-fly-up var(--anim-duration, 12s) cubic-bezier(.2,.9,.3,1) forwards;
      }
      @keyframes ri-fly-up {
        0% {
          transform: translate(var(--x-start), var(--y-start)) rotateX(var(--rotate-x-start)) rotateY(var(--rotate-y-start)) rotateZ(var(--rotate-z-start)) scale(var(--scale));
          opacity: 1;
        }
        15%, 90% {
          transform: translate(var(--x-final), var(--y-final)) rotateZ(var(--rotate-z-final)) scale(var(--scale));
          opacity: 1;
        }
        100% {
          transform: translate(var(--x-final), var(--y-final)) rotateZ(var(--rotate-z-final)) scale(var(--scale));
          opacity: 0;
        }
      }
      #${SCOPE_ID} #screen-reader-time {
        position: absolute !important;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
        border: 0;
      }
      @media (prefers-reduced-motion: reduce) {
        #${SCOPE_ID} .digit {
          animation: none;
          transform: translate(var(--x-final), var(--y-final)) scale(var(--scale));
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    console.log("📝 [Clock] Styles injected."); // STYLES INJECTED

    const root = document.getElementById(SCOPE_ID);
    const srTime = document.getElementById("screen-reader-time");
    
    if (!root || !srTime) {
      console.warn("⚠️ [Clock] Clock root or screen reader element not found.");
      return;
    }
    console.log("🔎 [Clock] Root elements found."); // ELEMENTS FOUND

    function getTimeDigits() {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, "0");
      try {
        srTime.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      } catch (e) {
        console.error("🛑 [Clock] Error updating screen reader time:", e); // ERROR ON SR TIME
      }
      return [...(String(hours) + minutes)];
    }

    function randomColor() {
      const hues = [0, 120, 240, 300];
      return `hsl(${hues[Math.floor(Math.random() * hues.length)]}, 70%, 50%)`;
    }

    function randomFontSizeVH() {
      return `clamp(4rem, 6vh, 6rem)`; // Consistent font size to prevent overlap
    }

    function randomScale() {
      return (Math.random() * 0.5 + 0.75).toFixed(2);
    }

    function randomDirectionOffset() {
      const side = ["top", "bottom", "left", "right"][Math.floor(Math.random() * 4)];
      const vw = 100;
      const vh = 100;
      switch (side) {
        case "top":
          return { x: `${(Math.random() * vw).toFixed(2)}vw`, y: `-10vh` };
        case "bottom":
          return { x: `${(Math.random() * vw).toFixed(2)}vw`, y: `110vh` };
        case "left":
          return { x: `-10vw`, y: `${(Math.random() * vh).toFixed(2)}vh` };
        case "right":
          return { x: `110vw`, y: `${(Math.random() * vh).toFixed(2)}vh` };
        default:
          return { x: "0vw", y: "0vh" };
      }
    }

    function randomRotation() {
      return `${Math.floor(Math.random() * 720 - 360)}deg`;
    }

    function randomFinalAngle() {
      return `${Math.floor(Math.random() * 31 - 15)}deg`;
    }

    function throwDigitsUp() {
      console.log("🎨 [Clock] throwDigitsUp called."); // THROW START
      const digits = getTimeDigits();
      const fragment = document.createDocumentFragment();
      const digitCount = digits.length;
      const baseX = 50; // Center at 50vw
      const spreadX = 10; // ±10vw spread per digit
      const baseY = 30; // Center at 30vh
      const spreadY = 5; // ±5vh spread
      const minSpacing = 8; // Minimum 8vw spacing to prevent overlap
      const batchColor = randomColor(); // One color for all digits in this batch
      
      digits.forEach((char, index) => {
        const span = document.createElement("span");
        span.className = "digit";
        span.textContent = char;
        
        // Final position: cluster around center with controlled spread
        const xOffset = (index - (digitCount - 1) / 2) * minSpacing; // Center digits
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
        `;

        span.addEventListener("animationend", () => span.remove());
        fragment.appendChild(span);
      });

      root.appendChild(fragment);
      console.log(`➕ [Clock] Added ${digitCount} new digit elements.`); // THROW END
    }

    let lastFrameTime = 0;
    const interval = 200; // 200ms for 5 times per second
    
    function tick(currentTime) {
      try {
        console.log(`⏱️ [Clock] Tick running. Last frame: ${lastFrameTime.toFixed(2)}ms`); // TICK START
        if (currentTime - lastFrameTime >= interval) {
          console.log(`💥 [Clock] Interval met (${(currentTime - lastFrameTime).toFixed(2)}ms). Throwing digits.`); // INTERVAL HIT
          throwDigitsUp();
          // We only update lastFrameTime if throwDigitsUp() succeeded
          lastFrameTime = currentTime - ((currentTime - lastFrameTime) % interval);
        }
      } catch (error) {
        console.error("🛑 [Clock] CRITICAL ERROR IN TICK LOOP. LOOP STOPPED:", error); // CRITICAL ERROR
        // If an error occurs, the next line will still try to schedule the next frame.
      } finally {
        animationFrameId = requestAnimationFrame(tick);
      }
    }
    
    let animationFrameId = requestAnimationFrame(tick);
    console.log("🔁 [Clock] Animation frame loop started."); // LOOP STARTED

    return () => {
      console.log("↩️ [Clock] Cleanup function running."); // CLEANUP
      cancelAnimationFrame(animationFrameId);
      document.querySelectorAll(`style[data-scope="${SCOPE_ID}"]`).forEach((el) => el.remove());
      document.querySelectorAll(`#${SCOPE_ID} .digit`).forEach((n) => n.remove());
    };
  }, []);

  return (
    <div id="ri-clock-2025-11-01" role="timer" aria-label="Animated digital clock">
      <time id="screen-reader-time" aria-live="polite" />
    </div>
  );
}
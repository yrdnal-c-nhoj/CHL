import React, { useEffect } from "react";
import fontFile_2025_11_01 from "./dotted.ttf"; // your local font (same folder)
import "./RoughIdea.css";

export default function Clock() {
  useEffect(() => {
    /* -------------------------------
       Inject custom font dynamically
    -------------------------------- */
    const fontName = "RoughIdeaFont";
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: '${fontName}';
        src: url(${fontFile_2025_11_01}) format('truetype');
        font-display: swap;
      }
      #clock, .digit {
        font-family: '${fontName}', sans-serif;
      }
    `;
    document.head.appendChild(style);

    /* -------------------------------
       Clock animation logic
    -------------------------------- */
    const clock = document.getElementById("clock");
    const srTime = document.getElementById("screen-reader-time");

    function getTimeDigits() {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, "0");
      srTime.textContent = now.toLocaleTimeString();
      return [...(hours.toString() + minutes)];
    }

    function randomColor() {
      return `hsl(${Math.random() * 21}, 60%, 60%)`;
    }

    function randomFontSize() {
      return `${Math.floor(Math.random() * 200 + 60)}px`;
    }

    function randomScale() {
      return (Math.random() * 0.5 + 0.75).toFixed(2);
    }

    function randomDirectionOffset() {
      const side = ["top", "bottom", "left", "right"][Math.floor(Math.random() * 4)];
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      switch (side) {
        case "top":
          return { x: `${Math.random() * vw}px`, y: `-10vh` };
        case "bottom":
          return { x: `${Math.random() * vw}px`, y: `110vh` };
        case "left":
          return { x: `-10vw`, y: `${Math.random() * vh}px` };
        case "right":
          return { x: `110vw`, y: `${Math.random() * vh}px` };
        default:
          return { x: "0px", y: "0px" };
      }
    }

    function randomRotation() {
      return Math.floor(Math.random() * 720 - 360);
    }

    function randomFinalAngle() {
      return Math.floor(Math.random() * 31 - 15);
    }

    function throwDigitsUp() {
      const digits = getTimeDigits();
      const fragment = document.createDocumentFragment();
      const digitSpacing = window.innerWidth / (digits.length + 2);
      const centerY = window.innerHeight * 0.3;

      digits.forEach((char, index) => {
        const span = document.createElement("span");
        span.className = "digit";
        span.textContent = char;

        const xFinal = `${(index + 1) * digitSpacing}px`;
        const yFinal = `${centerY}px`;
        const scale = randomScale();
        const { x: xStart, y: yStart } = randomDirectionOffset();

        Object.assign(span.style, {
          left: "0",
          top: "0",
          color: randomColor(),
          fontSize: randomFontSize(),
        });

        span.style.setProperty("--x-start", xStart);
        span.style.setProperty("--y-start", yStart);
        span.style.setProperty("--x-final", xFinal);
        span.style.setProperty("--y-final", yFinal);
        span.style.setProperty("--scale", scale);
        span.style.setProperty("--rotate-x-start", `${randomRotation()}deg`);
        span.style.setProperty("--rotate-y-start", `${randomRotation()}deg`);
        span.style.setProperty("--rotate-z-start", `${randomRotation()}deg`);
        span.style.setProperty("--rotate-z-final", `${randomFinalAngle()}deg`);

        span.addEventListener("animationend", () => span.remove());
        fragment.appendChild(span);
      });

      clock.appendChild(fragment);
    }

    throwDigitsUp();
    const interval = setInterval(throwDigitsUp, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div id="clock">
        <time id="screen-reader-time" aria-live="polite" />
      </div>
    </>
  );
}

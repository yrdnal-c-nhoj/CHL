import React, { useEffect, useState, useRef } from "react";
import ionFont from "./ion.ttf";
import ionJpeg from "./ion.jpeg";
import iskyWebp from "./isky.webp";

const CLOCK_BACKGROUND = "rgba(0, 255, 255, 0.0)";
const CLOCK_COUNT_PER_DIRECTION = 2;
const MIN_DURATION = 0.01;
const MAX_DURATION = 20;

const namedSilverShades = [
  "silver", "lightgray", "darkgray", "gainsboro", "#b0c4de",
  "#c0c0c0", "#a9a9a9", "#dcdcdc", "#d3d3d3", "#eeeeee",
  "#f5f5f5", "#a5b487", "#adcbce",
];

const spinAnimations = ["spin-a", "spin-b", "spin-c"];

function getRandomGrayOrSilver() {
  if (Math.random() < 0.5) {
    const g = Math.floor(100 + Math.random() * 130);
    return `rgb(${g}, ${g}, ${g})`;
  } else {
    return namedSilverShades[Math.floor(Math.random() * namedSilverShades.length)];
  }
}

function getCharColor(index) {
  const i = index + 1;
  if (i % 29 === 0) return "#b99b5b"; // soft gold
  if (i % 25 === 0) return "#a32934"; // rich red
  if (i % 24 === 0) return "#861024"; // deep maroon
  if (i % 13 === 0) return "#d0b35d"; // bright gold
  if (i % 34 === 0) return "#3e7abc"; // blue steel
  return getRandomGrayOrSilver();
}

function generateTimeString() {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  return `${hours} ${minutes} ${ampm}`;
}

let globalCharIndex = 0;

function createClockObject(direction, vw, vh) {
  const timeStr = generateTimeString();
  const spans = [];
  for (const char of timeStr) {
    spans.push({
      char,
      color: getCharColor(globalCharIndex),
    });
    globalCharIndex++;
  }

  const fontSize = 1 + Math.random() * 2.9; // rem
  const topVh = 5 + Math.random() * 90;
  const driftDuration = MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION);
  const spinName = spinAnimations[Math.floor(Math.random() * spinAnimations.length)];
  const spinDuration = 20 + Math.random() * 30;

  return {
    id: Math.random().toString(36).slice(2),
    direction,
    spans,
    fontSize,
    topVh,
    driftDuration,
    spinName,
    spinDuration,
    startTime: Date.now(),
  };
}

export default function IonosphereClock() {
  const [clocks, setClocks] = useState([]);
  const containerRef = useRef(null);

  // Font + animations
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @font-face {
        font-family: 'ion';
        src: url(${ionFont}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }

      body, html, #root {
        margin: 0; padding: 0; height: 100vh; width: 100vw; overflow: hidden;
        background: rgb(4, 30, 60);
        perspective: 1000px;
        font-size: 16px;
      }

      @keyframes drift-right {
        from { transform: translateX(-120%); }
        to   { transform: translateX(120vw); }
      }
      @keyframes drift-left {
        from { transform: translateX(120vw); }
        to   { transform: translateX(-120%); }
      }
      @keyframes spin-a {
        from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        to   { transform: rotateX(180deg) rotateY(360deg) rotateZ(90deg); }
      }
      @keyframes spin-b {
        from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        to   { transform: rotateX(360deg) rotateY(180deg) rotateZ(270deg); }
      }
      @keyframes spin-c {
        from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        to   { transform: rotateX(90deg) rotateY(270deg) rotateZ(360deg); }
      }

      .clock-wrapper {
        position: absolute;
        will-change: transform;
        pointer-events: none;
        z-index: 3; /* lowered from 6 to stay under nav */
      }

      .clock {
        font-family: 'ion', monospace;
        display: inline-block;
        transform-style: preserve-3d;
        will-change: transform;
        filter: saturate(80%) brightness(80%);
        text-shadow: 0 0 0.375rem rgb(214 241 11), 0 0 0.1875rem rgb(188 211 234);
      }

      nav, .navbar, header {
        position: relative;
        z-index: 10; /* ensures navigation stays on top */
      }
    `;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  // Maintain clocks
  useEffect(() => {
    let maintainTimeout;
    function maintainClockBalance() {
      setClocks((currentClocks) => {
        const now = Date.now();
        const filteredClocks = currentClocks.filter(
          (c) => now - c.startTime < c.driftDuration * 1000
        );
        const lefts = filteredClocks.filter((c) => c.direction === "left");
        const rights = filteredClocks.filter((c) => c.direction === "right");
        const newClocks = [...filteredClocks];
        const vw = window.innerWidth / 100;
        const vh = window.innerHeight / 100;

        if (lefts.length < CLOCK_COUNT_PER_DIRECTION)
          newClocks.push(createClockObject("left", vw, vh));
        if (rights.length < CLOCK_COUNT_PER_DIRECTION)
          newClocks.push(createClockObject("right", vw, vh));

        return newClocks;
      });

      maintainTimeout = setTimeout(maintainClockBalance, 1000);
    }

    maintainClockBalance();
    return () => clearTimeout(maintainTimeout);
  }, []);

  // Launch random clocks
  useEffect(() => {
    let launchTimeout;
    function launchRandomClock() {
      setClocks((currentClocks) => {
        const vw = window.innerWidth / 100;
        const vh = window.innerHeight / 100;
        const direction = Math.random() < 0.5 ? "left" : "right";
        return [...currentClocks, createClockObject(direction, vw, vh)];
      });
      launchTimeout = setTimeout(launchRandomClock, 300 + Math.random() * 1500);
    }
    launchRandomClock();
    return () => clearTimeout(launchTimeout);
  }, []);

  return (
    <>
      <img
        src={iskyWebp}
        alt="Sky background"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          filter: "contrast(90%) saturate(200%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <img
        src={ionJpeg}
        alt="Ion background"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          filter: "contrast(90%) saturate(90%)",
          opacity: 0.5,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {clocks.map(
        ({
          id,
          direction,
          spans,
          fontSize,
          topVh,
          driftDuration,
          spinName,
          spinDuration,
        }) => {
          const animationName = `drift-${direction}`;
          return (
            <div
              key={id}
              className="clock-wrapper"
              style={{
                top: `${topVh}vh`,
                left: 0,
                animation: `${animationName} ${driftDuration}s linear forwards`,
              }}
            >
              <div
                className="clock"
                style={{
                  fontSize: `${fontSize}rem`,
                  animation: `${spinName} ${spinDuration}s linear infinite`,
                }}
              >
                {spans.map(({ char, color }, i) => (
                  <span key={i} style={{ color }}>
                    {char}
                  </span>
                ))}
              </div>
            </div>
          );
        }
      )}
    </>
  );
}

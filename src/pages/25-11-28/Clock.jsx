// TimelineClock.jsx
import React, { useEffect, useState } from "react";
import lineFont from "./line.otf";
import patternImg from "./line.webp";

const fontStyles = `
  @font-face {
    font-family: 'LineFont';
    src: url(${lineFont}) format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  html, body, #root { height: 100dvh; margin: 0; overflow: hidden; }
`;

export default function TimelineClock() {
  const [now, setNow] = useState(new Date());
  const [isVertical, setIsVertical] = useState(false);
  const [flash, setFlash] = useState(false);
  const [comet, setComet] = useState(-100); // -100 = off-screen

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const check = () => setIsVertical(window.innerWidth < window.innerHeight);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Random comet sweep every 4–9 seconds
  useEffect(() => {
    const triggerComet = () => {
      setComet(-20);
      const duration = 800 + Math.random() * 700; // 0.8–1.5s sweep
      const timer = setTimeout(() => setComet(120), 50);
      setTimeout(() => setComet(-100), duration + 100);
      return () => clearTimeout(timer);
    };

    triggerComet(); // initial
    const interval = setInterval(triggerComet, 4000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const percent = (seconds / 86400) * 100;

  const s = {
    page: {
      width: "100vw",
      height: "100dvh",
      position: "fixed",
      top: 0,
      left: 0,
      background: "#0f0404",
      fontFamily: "'LineFont', system-ui, sans-serif",
      overflow: "hidden",
    },
    timeline: { position: "relative", width: "100%", height: "100%" },
    bar: {
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${patternImg})`,
      backgroundRepeat: "repeat",
      backgroundSize: isVertical ? "18vh 24vh" : "24vh 18vh",
    },
    tick: (pos) => ({
      position: "absolute",
      left: isVertical ? "50%" : `${pos}%`,
      top: isVertical ? `${pos}%` : "50%",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      fontSize: "5.5vh",
      fontWeight: "bold",
      color: "#333",
      textShadow: `
        -1.5px -1.5px 0 red, 1.5px -1.5px 0 red,
        -1.5px 1.5px 0 red, 1.5px 1.5px 0 red,
        -2px 0 0 red, 2px 0 0 red, 0 -2px 0 red, 0 2px 0 red
      `,
      userSelect: "none",
    }),

    // MAIN RED LINE (always visible + pulsing)
    nowLine: {
      position: "absolute",
      top: isVertical ? `${percent}%` : 0,
      left: isVertical ? 0 : `${percent}%`,
      width: isVertical ? "100%" : "2.4px",
      height: isVertical ? "2.4px" : "100%",
      transform: isVertical ? "translateY(-50%)" : "translateX(-50%)",
      pointerEvents: "none",
      background: flash
        ? "linear-gradient(90deg, #ff2222, #ff6b6b)"
        : "linear-gradient(90deg, #ff4444, #ff1111)",
      boxShadow: flash
        ? "0 0 40px #ff0000, 0 0 80px #ff3333"
        : "0 0 20px #ff0000, 0 0 40px #ff2222",
      zIndex: 10,
      transition: "all 0.4s ease",
    },

    // COMET HIGHLIGHT that flies across the line
    comet: {
      position: "absolute",
      top: isVertical ? "50%" : `${comet}%`,
      left: isVertical ? `${comet}%` : "50%",
      width: isVertical ? "60px" : "8px",
      height: isVertical ? "8px" : "60px",
      background: "radial-gradient(circle, #ffffff 10%, #ff9999 30%, transparent 70%)",
      borderRadius: "50%",
      transform: isVertical ? "translate(-50%, -50%)" : "translate(-50%, -50%)",
      boxShadow: "0 0 60px 20px #ffffff, 0 0 100px 40px #ff0088",
      pointerEvents: "none",
      zIndex: 20,
      opacity: comet >= -20 && comet <= 120 ? 1 : 0,
      transition: "opacity 0.2s ease",
    },
  };

  const ticks = Array.from({ length: 25 }, (_, h) => ({ hour: h, pos: (h / 24) * 100 }));

  // Flash whole line every 3s (subtle heartbeat)
  useEffect(() => {
    const iv = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={s.page}>
      <style jsx>{fontStyles}</style>
      <div style={s.timeline}>
        <div style={s.bar} />

        {/* Hour ticks */}
        {ticks.map((t) => (
          <div key={t.hour} style={s.tick(t.pos)}>
            {String(t.hour).padStart(2, "0")}
          </div>
        ))}

        {/* Main glowing red line */}
        <div style={s.nowLine} />

        {/* Flying comet highlight */}
        <div style={s.comet} />
      </div>
    </div>
  );
}
// TimelineClock.jsx
import React, { useEffect, useState } from "react";
import lineFont from "./line.otf";
import patternImg from "./line.webp"; // your tiled background image

// Add font-face styles
const fontStyles = `
  @font-face {
    font-family: 'LineFont';
    src: url(${lineFont}) format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

export default function TimelineClock() {
  const [now, setNow] = useState(new Date());
  const [isVertical, setIsVertical] = useState(false);
  const [flash, setFlash] = useState(false); // flash state

  // live clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // detect phone vs laptop
  useEffect(() => {
    function check() {
      setIsVertical(window.innerWidth < window.innerHeight);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // flash every 3 seconds
  useEffect(() => {
    const flashInterval = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 300); // flash duration
    }, 3000);
    return () => clearInterval(flashInterval);
  }, []);

  const seconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const percent = (seconds / 86400) * 100;

  // Tile size control
  const tileWidth = "24vh"; // horizontal tile size
  const tileHeight = "18vh"; // vertical tile size

  //
  // STYLES
  //
  const s = {
    page: {
      // **MODIFIED:** Changed height and overflow for mobile compatibility
      minHeight: "100vh", // Use minHeight to ensure it covers the screen
      height: "100%",     // Ensure it fills the parent if it has defined height
      width: "100vw",
      position: "relative",
      fontFamily: "'LineFont', system-ui, sans-serif",
      // background:
      //   "linear-gradient(180deg, rgba(5,5,10,0.03), rgba(255,255,255,0.02))",
      overflow: "auto", // **MODIFIED:** Allow scrolling to prevent clipping
    },

    timeline: {
      position: "relative",
      width: "100vw",
      height: "100%", // **MODIFIED:** Set to 100% of parent height
      top: 0,
      left: 0,
    },

    bar: {
      position: "absolute",
      width: "100vw",
      height: "100%", // **MODIFIED:** Set to 100% of parent height
      backgroundImage: `url(${patternImg})`,
      backgroundRepeat: "repeat",
      backgroundPosition: "center center",
      backgroundSize: `${tileWidth} ${tileHeight}`,
    },

    tick: (pos) => ({
      position: "absolute",
      pointerEvents: "none",
      left: `${pos}%`,
      top: `${pos}%`,
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    }),

    tickLine: {
      display: "none",
    },

    tickLabel: {
      fontSize: "5.5vh",
      color: "#333",
      userSelect: "none",
      fontFamily: "'LineFont', system-ui, sans-serif",
      lineHeight: 1,
      textAlign: "center",
    },

    nowIndicator: {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      pointerEvents: "none",
      transition: isVertical ? "top 1s linear" : "left 1s linear",
      ...(isVertical
        ? { top: percent + "%", left: "0", transform: "translateY(-50%)" }
        : { left: percent + "%", top: "0", transform: "translateX(-50%)" }),
    },

    nowDot: {
      width: isVertical ? "99vw" : "0.3vh",
      height: isVertical ? "0.3vh" : "99vh",
      background: flash
        ? "linear-gradient(180deg,#ffb3b3,#0F0404FF)" // brighter flash
        : "linear-gradient(180deg,#ff6b6b,#0F0404FF)",
      border: "0.3vh solid rgba(255,255,255,0.9)",
      boxShadow: flash
        ? "0 0.6vh 2vh rgba(255,120,120,0.6)" // more intense shadow during flash
        : "0 0.4vh 1.4vh rgba(255,80,80,0.3)",
      transition: "all 0.3s ease",
    },
  };

  const ticks = Array.from({ length: 25 }).map((_, h) => ({
    hour: h,
    pos: (h / 24) * 100,
  }));

  return (
    <div style={s.page}>
      <style>{fontStyles}</style>
      <div style={s.timeline}>
        <div style={s.bar} />

        {ticks.map((t) => (
          <div key={t.hour} style={s.tick(t.pos)}>
            <div style={s.tickLabel}>{String(t.hour).padStart(2, "0")}</div>
          </div>
        ))}

        <div style={s.nowIndicator}>
          <div style={s.nowDot} />
        </div>
      </div>
    </div>
  );
}
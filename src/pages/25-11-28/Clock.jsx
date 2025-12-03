// TimelineClock.jsx
import React, { useEffect, useState } from "react";
import lineFont from "./line.otf";
import patternImg from "./line.webp";

// 1. Keep fontStyles for global CSS injection
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
  const [comet, setComet] = useState(-100); 
  // ADDED: State to track if the font is loaded
  const [fontLoaded, setFontLoaded] = useState(false); 

  // EXISTING: Clock update
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // EXISTING: Orientation check
  useEffect(() => {
    const check = () => setIsVertical(window.innerWidth < window.innerHeight);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ADDED: Font Loading Check
  useEffect(() => {
    if (document.fonts) {
      // Load the font and wait for it to be ready
      document.fonts.load("5.5vh 'LineFont'").then(() => {
        setFontLoaded(true);
      }).catch(err => {
        // Fallback: If loading fails, render anyway to avoid infinite blank screen
        console.error("Font loading failed:", err);
        setFontLoaded(true);
      });
    } else {
      // Fallback for browsers that don't support document.fonts (render immediately)
      setFontLoaded(true);
    }
  }, []); // Run only once on mount

  // EXISTING: Comet sweep
  useEffect(() => {
    const triggerComet = () => {
      setComet(-20);
      const duration = 800 + Math.random() * 700;
      const timer = setTimeout(() => setComet(120), 50);
      setTimeout(() => setComet(-100), duration + 100);
      return () => clearTimeout(timer);
    };
    triggerComet();
    const interval = setInterval(triggerComet, 4000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  // EXISTING: Flash heartbeat
  useEffect(() => {
    const iv = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    }, 3000);
    return () => clearInterval(iv);
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
      // MODIFIED: Ticks now follow a diagonal path regardless of orientation
      tick: (pos) => ({
        position: "absolute",
        left: `${pos}%`, // Position horizontally based on hour percentage
        top: `${pos}%`,  // Position vertically based on hour percentage
        transform: "translate(-50%, -50%)", // Centered on the diagonal point
        pointerEvents: "none",
        fontSize: "5.5vh",
        // fontWeight: "bold",
        color: "#333",
        textShadow: `-1px -1px 0 red, 1px -1px 0 red, -1px 1px 0 red, 1px 1px 0 red, -1px 0 0 red, 1px 0 0 red, 0 -1px 0 red, 0 1px 0 red`,
        userSelect: "none",
      }),
      // UNCHANGED: MAIN RED LINE (nowLine) position based on orientation
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
      // UNCHANGED: COMET position and visibility based on orientation
      comet: {
        position: "absolute",
        top: isVertical ? `${comet}%` : "50%", 
        left: isVertical ? "50%" : `${comet}%`, 
        width: isVertical ? "8px" : "60px",
        height: isVertical ? "60px" : "8px",
        background: "radial-gradient(circle, #ffffff 10%, #ff9999 30%, transparent 70%)",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: "0 0 60px 20px #ffffff, 0 0 100px 40px #ff0088",
        pointerEvents: "none",
        zIndex: 20,
        opacity: comet >= -20 && comet <= 120 ? 1 : 0,
        transition: "opacity 0.2s ease",
      },
  };

  const ticks = Array.from({ length: 25 }, (_, h) => ({ hour: h, pos: (h / 24) * 100 }));

  // CONDITIONAL RENDER: Show a black screen until the font is loaded
  if (!fontLoaded) {
    return (
      <div style={{...s.page, background: '#0f0404'}}> 
          <style jsx>{fontStyles}</style>
      </div>
    );
  }

  // The main component render (only runs after fontLoaded is true)
  return (
    <div style={s.page}>
      <style jsx>{fontStyles}</style>
      <div style={s.timeline}>
        <div style={s.bar} />
        {/* Hour ticks (now diagonal) */}
        {ticks.map((t) => (
          <div key={t.hour} style={s.tick(t.pos)}>
            {String(t.hour).padStart(2, "0")}
          </div>
        ))}
        {/* Main glowing red line (horizontal or vertical) */}
        <div style={s.nowLine} />
        {/* Flying comet highlight */}
        <div style={s.comet} />
      </div>
    </div>
  );
}
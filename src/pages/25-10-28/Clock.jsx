/** @jsxImportSource react */
import React, { useEffect, useState, useMemo, useRef } from "react";

/* ------------------------------------------------------------------
   1. Load ALL images from digits/0/ to digits/9/ automatically
   ------------------------------------------------------------------ */
function loadAllDigitImages() {
  const globs = {
    0: import.meta.glob("./digits/0/*.{png,jpg,jpeg,gif,webp}", { eager: true, as: "url" }),
    1: import.meta.glob("./digits/1/*.{png,jpg,jpeg,gif,webp}", { eager: true, as: "url" }),
    2: import.meta.glob("./digits/2/*.{png,jpg,jpeg,gif,webp}", { eager: true, as: "url" }),
    3: import.meta.glob("./digits/3/*.{png,jpg,jpeg,gif,webp}", { eager: true, as: "url" }),
    4: import.meta.glob("./digits/4/*.{png,jpg,jpeg,gif,webp}", { eager: true, as: "url" }),
    5: import.meta.glob("./digits/5/*.{png,jpg,jpeg,gif,webp}", { eager: true, as: "url" }),
    6: import.meta.glob("./digits/6/*.{png,jpg,jpeg,gif,webp}", { eager: true, as: "url" }),
    7: import.meta.glob("./digits/7/*.{png,jpg,jpeg,gif,webp}", { eager: true, as: "url" }),
    8: import.meta.glob("./digits/8/*.{png,jpg,jpeg,gif,webp}", { eager: true, as: "url" }),
    9: import.meta.glob("./digits/9/*.{png,jpg,jpeg,gif,webp}", { eager: true, as: "url" }),
  };

  const folders = {};
  for (let d = 0; d <= 9; d++) {
    const modMap = globs[d] || {};
    const urls = Object.values(modMap);
    folders[d] = urls.length > 0 ? urls : [null];
  }
  return folders;
}

/* ------------------------------------------------------------------
   2. Component
   ------------------------------------------------------------------ */
export default function DigitClock() {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [digitIndices, setDigitIndices] = useState([0, 0, 0, 0, 0, 0]);
  const intervalRef = useRef(null);

  const orderedImages = useMemo(() => {
    const raw = loadAllDigitImages();
    const out = {};
    for (let d = 0; d <= 9; d++) {
      let imgs = raw[d] || [];
      out[d] = imgs.filter(Boolean);
      if (out[d].length === 0) out[d] = [null];
    }
    return out;
  }, []);

  const getTimeDigits = (date) => {
    let h = date.getHours() % 12 || 12;
    const hStr = String(h);
    const mStr = String(date.getMinutes()).padStart(2, "0");
    const sStr = String(date.getSeconds()).padStart(2, "0");
    return [...hStr, ...mStr, ...sStr].map(Number);
  };

  const timeDigits = getTimeDigits(currentTime);
  const isSingleHour = timeDigits.length === 5;

  const minuteStart = isSingleHour ? 1 : 2;
  const secondStart = isSingleHour ? 3 : 4;

  /* ------------------------------------------------------------------
     3. Update every second
     ------------------------------------------------------------------ */
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const tick = () => {
      const now = new Date();
      setCurrentTime(now);
      const newDigits = getTimeDigits(now);

      setDigitIndices((prev) => {
        const next = [...prev];
        for (let i = 0; i < next.length; i++) {
          const folder = orderedImages[newDigits[i]] || [];
          next[i] = folder.length > 0 ? (prev[i] + 1) % folder.length : 0;
        }
        return next;
      });
    };

    intervalRef.current = setInterval(tick, 1000);
    tick();

    return () => clearInterval(intervalRef.current);
  }, [orderedImages]);

  const getImage = (digit, pos) => {
    const folder = orderedImages[digit] || [];
    if (folder.length === 0 || !folder[0]) return "";
    const idx = digitIndices[pos] % folder.length;
    return folder[idx];
  };

  /* ---- Styles ------------------------------------------------ */
  const container = {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#B5B7B7FF",
    color: "#fff",
    fontFamily: "sans-serif",
    padding: "0.1rem",
  };

  const clock = {
    display: "flex",
    gap: "1.2rem", // space between HH, MM, SS
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    transform: "translateY(-5vh)",
  };

  const section = {
    display: "flex",
    gap: "0.5rem", // consistent space between tens and ones
    alignItems: "center",
  };

  const img = {
    width: "22vh",
    height: "22vh",
    objectFit: "cover",
    boxShadow: "0 0 1.5vh rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255)",
    backgroundColor: "rgba(90, 90, 90)", // fallback color behind transparent areas
    transition: "transform 0.5s ease-out",
    borderRadius: "8px",
  };

  return (
    <div style={container}>
      <style>{`
        @media (max-width: 768px) {
          .clock-container {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          .clock-img {
            width: 20vh !important;
            height: 20vh !important;
          }
        }
      `}</style>

      <div className="clock-container" style={clock}>
        {/* HOURS */}
        <div style={section}>
          {timeDigits
            .slice(0, isSingleHour ? 1 : 2)
            .map((d, i) => (
              <img
                key={`h${i}`}
                src={getImage(d, i)}
                alt={`hour ${d}`}
                className="clock-img"
                style={img}
              />
            ))}
        </div>

        {/* MINUTES */}
        <div style={section}>
          {timeDigits
            .slice(minuteStart, minuteStart + 2)
            .map((d, i) => (
              <img
                key={`m${i}`}
                src={getImage(d, minuteStart + i)}
                alt={`minute ${d}`}
                className="clock-img"
                style={img}
              />
            ))}
        </div>

        {/* SECONDS */}
        <div style={section}>
          {timeDigits
            .slice(secondStart, secondStart + 2)
            .map((d, i) => (
              <img
                key={`s${i}`}
                src={getImage(d, secondStart + i)}
                alt={`second ${d}`}
                className="clock-img"
                style={img}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

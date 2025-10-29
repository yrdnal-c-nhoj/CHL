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
    folders[d] = urls.length > 0 ? urls : [null]; // fallback
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

  /* ---- Load & shuffle images (once) --------------------------- */
  const shuffledImages = useMemo(() => {
    const raw = loadAllDigitImages();
    const out = {};
    for (let d = 0; d <= 9; d++) {
      let imgs = raw[d] || [];
      imgs = imgs.filter(Boolean); // remove nulls
      out[d] = imgs.length > 0 ? imgs.sort(() => Math.random() - 0.5) : [null];
    }
    return out;
  }, []);

  /* ---- Time → digits (12‑hour, single digit centered) -------- */
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

  /* ---- Clock tick ------------------------------------------- */
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const tick = () => {
      const now = new Date();
      setCurrentTime(now);

      const newDigits = getTimeDigits(now);
      setDigitIndices((prev) =>
        prev.map((idx, i) => {
          const digit = newDigits[i];
          const folder = shuffledImages[digit] || [];
          return folder.length > 0 ? (idx + 1) % folder.length : 0;
        })
      );
    };

    intervalRef.current = window.setInterval(tick, 1000);
    tick();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [shuffledImages]);

  const getImage = (digit, pos) => {
    const folder = shuffledImages[digit] || [];
    if (folder.length === 0 || !folder[0]) return ""; // no image
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
    background: "#767A76FF",
    color: "#fff",
    fontFamily: "sans-serif",
    padding: "1rem",
  };

  const clock = {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const section = {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  };

  const img = {
    width: "18vh",
    height: "18vh",
    objectFit: "cover",
    boxShadow: "0 0 1.5vh rgba(0,0,0,0.6)",
    transition: "transform 0.5s ease-out",
    borderRadius: "8px",
  };

  return (
    <div style={container}>
      {/* REMOVED: <style jsx> — use regular <style> or CSS module */}
      <style>{`
        @media (max-width: 768px) {
          .clock-container {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          .clock-img {
            width: 14vh !important;
            height: 14vh !important;
          }
        }
      `}</style>

      <div className="clock-container" style={clock}>
        {/* HOURS */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: "center",
            minWidth: isSingleHour ? "18vh" : "auto",
          }}
        >
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
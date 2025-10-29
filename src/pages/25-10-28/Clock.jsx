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
  // The digitIndices array must be large enough for the maximum number of digits (6: H/HH:MM:SS).
  // This state holds the index of the image currently shown for each position.
  const [digitIndices, setDigitIndices] = useState([0, 0, 0, 0, 0, 0]);
  const intervalRef = useRef(null);

  /* ---- Load images (once, no shuffle) --------------------------- */
  const orderedImages = useMemo(() => {
    const raw = loadAllDigitImages();
    const out = {};
    for (let d = 0; d <= 9; d++) {
      let imgs = raw[d] || [];
      // Remove nulls and keep the original load order (which is usually determined by the import.meta.glob key iteration)
      out[d] = imgs.filter(Boolean); 
      if (out[d].length === 0) {
        out[d] = [null]; // fallback
      }
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
      
      // Update indices only if the digit *value* has changed at that position
      setDigitIndices((prev) => {
        // Create a new array for the next indices state
        const nextIndices = [...prev]; 
        
        // Iterate through all possible digit positions (up to 6)
        for(let i = 0; i < nextIndices.length; i++) {
            const currentDigitValue = newDigits[i];
            
            // Safety check for array bounds, although newDigits should match position count
            if (currentDigitValue === undefined) continue; 
            
            // The list of images for the current digit value
            const folder = orderedImages[currentDigitValue] || [];
            
            // Check if the digit value at this position has changed
            // This is a common pattern to only change image when the clock value changes
            // The current setup *always* increments the index, which is what we want for cycling
            // The existing logic is correct for *cycling* every second, even if the digit value doesn't change:
            
            // To CYCLE the image every second (as the previous logic did, but non-randomly):
            if (folder.length > 0) {
                // Increment the index and wrap around using modulo operator
                nextIndices[i] = (prev[i] + 1) % folder.length;
            } else {
                nextIndices[i] = 0; // fallback
            }

        }
        return nextIndices;
      });
    };

    intervalRef.current = window.setInterval(tick, 1000);
    tick();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [orderedImages]); // Dependency updated to orderedImages

  const getImage = (digit, pos) => {
    const folder = orderedImages[digit] || []; // Use orderedImages
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
    background: "#62A093FF",
    color: "#fff",
    fontFamily: "sans-serif",
    padding: "1rem",
  };

  const clock = {
    display: "flex",
    gap: "0.5rem",
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
    width: "22vh",
    height: "22vh",
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
            width: 20vh !important;
            height: 20vh !important;
          }
        }
      `}</style>

      <div className="clock-container" style={clock}>
        {/* HOURS */}
        <div
          style={{
            display: "flex",
            // gap: "0.5rem",
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
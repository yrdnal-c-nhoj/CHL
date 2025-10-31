/** @jsxImportSource react */
import React, { useEffect, useState, useMemo, useRef } from "react";

/* ------------------------------------------------------------------
   1. Load ALL images
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

// Get current time as 6-digit array: [H1, H2, M1, M2, S1, S2]
const getTimeDigits = (date) => {
  let h = date.getHours() % 12 || 12;
  const hStr = String(h).padStart(2, "0");
  const mStr = String(date.getMinutes()).padStart(2, "0");
  const sStr = String(date.getSeconds()).padStart(2, "0");
  return [...hStr, ...mStr, ...sStr].map(Number);
};

/* ------------------------------------------------------------------
   2. Component Definition
   ------------------------------------------------------------------ */
export default function DigitClock() {
  const [currentImageUrls, setCurrentImageUrls] = useState(["", "", "", "", "", ""]);
  const intervalRef = useRef(null);
  const lastUsedRef = useRef({}); // Fixed: Now actually used to prevent repetition across seconds

  const orderedImages = useMemo(() => {
    const raw = loadAllDigitImages();
    const out = {};
    for (let d = 0; d <= 9; d++) {
      let imgs = raw[d] || [];
      out[d] = imgs.filter(Boolean);
      if (out[d].length === 0) out[d] = [""];
    }
    return out;
  }, []);

  /* ------------------------------------------------------------------
     3. Update Logic - Fixed to use lastUsedRef properly
     ------------------------------------------------------------------ */
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const tick = () => {
      const now = new Date();
      const newDigits = getTimeDigits(now);
      const currentSecond = now.getSeconds();

      const newUrls = ["", "", "", "", "", ""];
      const usedIndicesMap = {};

      for (let i = 0; i < newDigits.length; i++) {
        const digit = newDigits[i];
        const folder = orderedImages[digit];

        if (!folder || folder.length === 0 || folder[0] === "") {
          newUrls[i] = "";
          continue;
        }

        if (!usedIndicesMap[digit]) {
          usedIndicesMap[digit] = [];
        }

        const availableStylesCount = folder.length;
        let selectedIndex = -1;

        const rotationOffset = currentSecond % availableStylesCount;
        const lastUsed = lastUsedRef.current[`${digit}-${i}`];

        // PRIMARY: Find unused style, avoiding the last one used for this position
        for (let j = 0; j < availableStylesCount; j++) {
          const checkIndex = (rotationOffset + j) % availableStylesCount;

          if (!usedIndicesMap[digit].includes(checkIndex) && checkIndex !== lastUsed) {
            selectedIndex = checkIndex;
            break;
          }
        }

        // FALLBACK 1: At least avoid repeating within current display
        if (selectedIndex === -1) {
          for (let j = 0; j < availableStylesCount; j++) {
            const checkIndex = (rotationOffset + j) % availableStylesCount;
            if (!usedIndicesMap[digit].includes(checkIndex)) {
              selectedIndex = checkIndex;
              break;
            }
          }
        }

        // FALLBACK 2: Use rotation offset
        if (selectedIndex === -1) {
          selectedIndex = rotationOffset;
        }

        newUrls[i] = folder[selectedIndex];
        usedIndicesMap[digit].push(selectedIndex);
        lastUsedRef.current[`${digit}-${i}`] = selectedIndex;
      }

      setCurrentImageUrls(newUrls);
    };

    intervalRef.current = setInterval(tick, 1000);
    tick();

    return () => clearInterval(intervalRef.current);
  }, [orderedImages]);

  /* ------------------------------------------------------------------
     4. Styles and Rendering - YOUR ORIGINAL DESIGN
     ------------------------------------------------------------------ */
  const container = {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #8AA0A0FF, #477777FF, #7CA4A4FF)",
    color: "#fff",
    fontFamily: "sans-serif",
    padding: "0.1rem",
  };

  const clock = {
    display: "flex",
    gap: "1.2rem",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    transform: "translateY(-3vh)",
  };

  const section = {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  };

  const img = {
    width: "24vh",
    height: "24vh",
    objectFit: "cover",
    boxShadow: "0 0 33vh #F4EBEBFF",
    border: "2px solid #050404FF",
    backgroundColor: "rgba(190, 200, 170)",
    transition: "transform 0.5s ease-out",
    borderRadius: "3px",
  };

  const timeDigits = getTimeDigits(new Date());

  return (
    <div style={container}>
      <style>{`
        @media (max-width: 768px) {
          .clock-container {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          .clock-img {
            width: 21vh !important;
            height: 21vh !important;
          }
        }
      `}</style>

      <div className="clock-container" style={clock}>
        {/* HOURS (Positions 0 and 1) */}
        <div style={section}>
          {currentImageUrls.slice(0, 2).map((url, i) => (
            <img
              key={`h${i}`}
              src={url}
              alt={`hour ${timeDigits[i]}`}
              className="clock-img"
              style={img}
            />
          ))}
        </div>

        {/* MINUTES (Positions 2 and 3) */}
        <div style={section}>
          {currentImageUrls.slice(2, 4).map((url, i) => (
            <img
              key={`m${i}`}
              src={url}
              alt={`minute ${timeDigits[i + 2]}`}
              className="clock-img"
              style={img}
            />
          ))}
        </div>

        {/* SECONDS (Positions 4 and 5) */}
        <div style={section}>
          {currentImageUrls.slice(4, 6).map((url, i) => (
            <img
              key={`s${i}`}
              src={url}
              alt={`second ${timeDigits[i + 4]}`}
              className="clock-img"
              style={img}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
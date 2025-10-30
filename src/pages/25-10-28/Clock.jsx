/** @jsxImportSource react */
import React, { useEffect, useState, useMemo, useRef } from "react";

/* ------------------------------------------------------------------
   1. Load ALL images (Unchanged)
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
   2. Component Definition
   ------------------------------------------------------------------ */
export default function DigitClock() {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [currentImageUrls, setCurrentImageUrls] = useState(["", "", "", "", "", ""]); 
  const intervalRef = useRef(null);

  // Tracks the last time (timestamp) a specific image style index was used for a digit (LRU Fallback)
  // NOTE: LRU fallback logic is now removed/simplified as we are forcing a change via offset.
  const lastUsedRef = useRef({}); 

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

  // Function to get the current time as a 6-digit array: [H1, H2, M1, M2, S1, S2]
  const getTimeDigits = (date) => {
    let h = date.getHours() % 12 || 12; // 12-hour format (1-12)
    const hStr = String(h).padStart(2, "0"); // Always pad the hour to 2 digits (e.g., 9 -> 09)
    const mStr = String(date.getMinutes()).padStart(2, "0");
    const sStr = String(date.getSeconds()).padStart(2, "0");
    return [...hStr, ...mStr, ...sStr].map(Number);
  };

  const timeDigits = useMemo(() => getTimeDigits(currentTime), [currentTime]); 

  /* ------------------------------------------------------------------
     3. Update Logic (Runs every second) - FORCING A CHANGE
     ------------------------------------------------------------------ */
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const tick = () => {
      const now = new Date();
      setCurrentTime(now); // Update the time display
      const newDigits = getTimeDigits(now); // [H1, H2, M1, M2, S1, S2]
      const currentSecond = now.getSeconds(); // The key to forcing the change

      const newUrls = ["", "", "", "", "", ""];
      // Tracks image styles (indexes) already used by a given digit *in this tick* (for uniqueness)
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

        // --- NEW LOGIC FORCED CHANGE: Use the current second as an OFFSET ---
        // This calculates a starting index that changes every second.
        const rotationOffset = currentSecond % availableStylesCount;

        // 1. PRIMARY LOGIC: Start searching for the SMALLEST UNUSED style index from the offset
        for (let j = 0; j < availableStylesCount; j++) {
          // Calculate the index in the folder, wrapping around the folder length
          const checkIndex = (rotationOffset + j) % availableStylesCount;

          if (!usedIndicesMap[digit].includes(checkIndex)) {
            selectedIndex = checkIndex;
            break; 
          }
        }
        
        // 2. FALLBACK LOGIC: If we couldn't find a unique one (e.g., only 2 styles for '1' but it appears 6 times)
        if (selectedIndex === -1) {
            // For simplicity, just reuse the style dictated by the offset, accepting the repeat
            selectedIndex = rotationOffset;
        }

        newUrls[i] = folder[selectedIndex];
        
        // Mark the selected index as used by this digit in this time cycle
        usedIndicesMap[digit].push(selectedIndex);
      }

      setCurrentImageUrls(newUrls);
    };

    // Run `tick` every 1000 milliseconds (1 second)
    intervalRef.current = setInterval(tick, 1000);
    tick(); // Run immediately on mount

    return () => clearInterval(intervalRef.current);
  }, [orderedImages]);


  /* ------------------------------------------------------------------
     4. Styles and Rendering (Unchanged)
     ------------------------------------------------------------------ */
  const container = {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#5B6C6CFF",
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
    transform: "translateY(-3vh)",
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
    backgroundColor: "rgba(190, 200, 170)",
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
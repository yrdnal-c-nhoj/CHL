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
  // The state will now hold the SPECIFIC IMAGE URL for each of the 6 positions
  const [currentImageUrls, setCurrentImageUrls] = useState(["", "", "", "", "", ""]); 
  const intervalRef = useRef(null);

  const orderedImages = useMemo(() => {
    const raw = loadAllDigitImages();
    const out = {};
    for (let d = 0; d <= 9; d++) {
      let imgs = raw[d] || [];
      // Filter out nulls and ensure there's a fallback
      out[d] = imgs.filter(Boolean);
      if (out[d].length === 0) out[d] = [""]; // Use an empty string URL as a definitive fallback
    }
    return out;
  }, []);

  // --- MODIFICATION: Ensure 6 digits (HHMMSS) by always padding the hour ---
  const getTimeDigits = (date) => {
    let h = date.getHours() % 12 || 12; // 12-hour format
    // Always pad the hour to 2 digits (e.g., 9 becomes 09, 12 remains 12)
    const hStr = String(h).padStart(2, "0"); 
    const mStr = String(date.getMinutes()).padStart(2, "0");
    const sStr = String(date.getSeconds()).padStart(2, "0");
    // Return a consistent 6 digits
    return [...hStr, ...mStr, ...sStr].map(Number);
  };

  const timeDigits = getTimeDigits(currentTime); // This is now always 6 digits: [H1, H2, M1, M2, S1, S2]

  /* ------------------------------------------------------------------
     3. Update every second (Implementing the unique image logic)
     ------------------------------------------------------------------ */
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const tick = () => {
      const now = new Date();
      setCurrentTime(now);
      const newDigits = getTimeDigits(now); // [H1, H2, M1, M2, S1, S2]

      const newUrls = ["", "", "", "", "", ""];
      // Map to track which image indices are currently used for a given digit value
      // e.g., usedIndicesMap = { 1: [0, 1], 0: [0] } means digit '1' is using styles 0 and 1
      const usedIndicesMap = {}; 

      for (let i = 0; i < newDigits.length; i++) {
        const digit = newDigits[i];
        const folder = orderedImages[digit];

        if (!folder || folder.length === 0 || folder[0] === "") {
          // No images available, assign empty string URL
          newUrls[i] = "";
          continue;
        }

        // Initialize the tracking array for this digit if needed
        if (!usedIndicesMap[digit]) {
          usedIndicesMap[digit] = [];
        }

        const availableStylesCount = folder.length;
        let selectedIndex = -1;

        // Find the SMALLEST UNUSED index/style for this digit
        for (let j = 0; j < availableStylesCount; j++) {
          if (!usedIndicesMap[digit].includes(j)) {
            selectedIndex = j;
            break; // Found the unique style for this position
          }
        }
        
        // --- FALLBACK LOGIC ---
        // If we ran out of unique styles (e.g., '11:11:11' and only 4 styles for '1'),
        // we must reuse an index, starting from the beginning of the folder list (index 0).
        // The prompt implies you *must* have enough unique images, but this is a safe fallback.
        if (selectedIndex === -1) {
            // This position will reuse the style that has been unused the longest.
            // For simplicity, we just use the first available style (index 0) and accept a repeat.
            // A more complex solution would track which style was last used, but index 0 is simple.
            selectedIndex = 0; 
        }

        newUrls[i] = folder[selectedIndex];
        // Mark the selected index as used by this digit in this time cycle
        usedIndicesMap[digit].push(selectedIndex);
      }

      setCurrentImageUrls(newUrls);
    };

    intervalRef.current = setInterval(tick, 1000);
    tick();

    return () => clearInterval(intervalRef.current);
  }, [orderedImages]);


  /* ---- Styles (No Change) ------------------------------------------------ */
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
    backgroundColor: "rgba(190, 200, 170)", // fallback color behind transparent areas
    transition: "transform 0.5s ease-out",
    borderRadius: "8px",
  };

  // The rendering logic must be updated to use the new currentImageUrls state
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

        {/* Separator */}
        <span style={{ fontSize: '10vh', color: '#fff' }}>:</span>

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
        
        {/* Separator */}
        <span style={{ fontSize: '10vh', color: '#fff' }}>:</span>


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
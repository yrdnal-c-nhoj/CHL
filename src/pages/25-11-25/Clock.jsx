import React, { useEffect, useState, useLayoutEffect, useMemo, useCallback, useRef } from "react";
// Assuming these imports are correct and available in your environment
import fontClockUrl_20251126 from "./ntp.ttf";
import marqueeFontUrl from "./n2.ttf";
import backgroundImg from "./npt.webp";

// --- Constants (Keep as is) ---
const NTP_EPOCH_OFFSET = 2208988800;
const MS_PER_SECOND = 1000;
const SECONDS_PER_DAY = 86400;

// --- Custom Hooks (Keep as is) ---
function useNtpOffset() {
  const [offset, setOffset] = useState(0);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchTime = async () => {
      try {
        const start = performance.now();
        // Using Etc/UTC as a reliable, non-DST time source
        const res = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
        const data = await res.json();
        const end = performance.now();
        if (!isMounted) return;

        // Calculate offset (network latency compensated)
        const networkDelay = (end - start) / 2;
        const serverTime = new Date(data.utc_datetime).getTime();
        const newOffset = serverTime - (Date.now() + networkDelay);

        setOffset(newOffset);
        setIsSynced(true);
      } catch (e) {
        if (isMounted) {
          console.error("Failed to load NTP time:", e);
          setIsSynced(true); 
        }
      }
    };
    
    fetchTime();
    return () => { isMounted = false; };
  }, []);

  return { offset, isSynced };
}

// --- Utility Functions (Keep as is) ---
const calculateClockAngles = (ntpSeconds) => {
    // ... (logic remains the same)
    const timeOfDay = ntpSeconds % SECONDS_PER_DAY;
    const hours = Math.floor(timeOfDay / 3600);
    const minutes = Math.floor((timeOfDay % 3600) / 60);
    const seconds = timeOfDay % 60;
    const secAngle = seconds * 6 - 90;
    const minAngle = minutes * 6 + seconds * 0.1 - 90;
    const hourAngle = ((hours % 12) * 30) + minutes * 0.5 - 90;
    return { secAngle, minAngle, hourAngle };
};

const generateDigitColors = (numDigits) => {
    return Array.from({ length: numDigits }, () => {
        const h = Math.random() * 360;
        const shadowH = (h + 180) % 360; // Complementary color for shadow
        return {
            color: `hsl(${h}, 200%, 50%)`,
            shadowColor: `hsl(${shadowH}, 200%, 60%)`,
        };
    });
};

// --- Component ---
export default function NtpClock() {
  const { offset, isSynced } = useNtpOffset();
  const [ntpSeconds, setNtpSeconds] = useState(0);
  const [digitColors, setDigitColors] = useState([]);
  const [marqueePos, setMarqueePos] = useState(0);
  // displayTime shows local time for the marquee text
  const [displayTime, setDisplayTime] = useState(new Date().toLocaleString([], { timeZoneName: 'short' }));
  const marqueeRef = useRef(null);

  // --- Font Loading (Keep as is) ---
  useLayoutEffect(() => {
    const fontFace = `
      @font-face {
        font-family: 'ClockFont';
        src: url('${fontClockUrl_20251126}') format('woff2');
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'MarqueeFont';
        src: url('${marqueeFontUrl}') format('truetype');
        font-style: normal;
        font-display: swap;
      }
    `;
    const styleEl = document.createElement("style");
    styleEl.id = "dynamic-fonts";
    styleEl.innerHTML = fontFace;
    document.head.appendChild(styleEl);
    return () => {
      const existingEl = document.getElementById("dynamic-fonts");
      if (existingEl) document.head.removeChild(existingEl);
    };
  }, []);


  // --- **Core Change 1 & 2: Update Time & Colors Every Second** ---
  useEffect(() => {
    if (!isSynced) return;
    
    // Function to calculate time and generate colors
    const updatePerSecond = () => {
      // 1. Calculate the synchronized time
      const nowTime = Date.now() + offset;
      const newSeconds = Math.floor(nowTime / MS_PER_SECOND) + NTP_EPOCH_OFFSET;
      
      // 2. Update NTP seconds (for clock display)
      setNtpSeconds(newSeconds);
      
      // 3. Generate new colors every second (randomly)
      setDigitColors(generateDigitColors(String(newSeconds).length)); 
      
      // 4. Update local display time for marquee
      setDisplayTime(new Date().toLocaleString([], { timeZoneName: 'short' }));
    }

    // Run once immediately
    updatePerSecond();
    
    // Set up the interval to run every 1000ms (1 second)
    const tick = setInterval(updatePerSecond, MS_PER_SECOND); 
    
    return () => clearInterval(tick);
  }, [isSynced, offset]); // Only re-runs if sync status or offset changes


  // --- Marquee Animation (Keep as is / Independent) ---
  useEffect(() => {
    let frame;
    const step = () => {
      setMarqueePos(prev => {
        const speed = 0.7; // vh per frame
        // This is a simple linear animation, you might want to reset 'prev'
        // based on the size of the marqueeRef content if you want it to loop properly
        return prev + speed;
      });
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []); // Only runs once on mount

  // --- Styles and Rendering (Keep as is / Independent) ---
  const isPortrait = window.innerHeight > window.innerWidth;

  const wrapperStyle = useMemo(() => ({
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
    // **Background Image is independent of the timing logic**
    backgroundImage: `
      url(${backgroundImg}),
      linear-gradient(to right, rgba(200,200,200,0.05) 0.1vh, transparent 0.1vh),
      linear-gradient(to bottom, rgba(200,200,200,0.05) 0.1vh, transparent 0.1vh)
    `,
    backgroundSize: "25vh 15vh, 25vh 15vh, 25vh 15vh",
    backgroundPosition: "center",
    filter: "invert(1) saturate(7)",
    overflow: "hidden",
    position: "relative",
  }), []);

  const baseClockStyle = { fontFamily: "ClockFont, monospace", textAlign: "center" };

  const clockStyle = useMemo(() => ({
    ...baseClockStyle,
    fontSize: isPortrait ? "13vh" : "15vh",
    lineHeight: "0.75",
    display: "flex",
    flexDirection: isPortrait ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  }), [isPortrait]);

  const staticText = `{{time}} NTP, or Network Time Protocol, is a system that keeps computers’ clocks accurate by checking the time from trusted servers and adjusting them as needed. `;

  const marqueeText = Array(10).fill(staticText).join(" ");

  const marqueeStyle = {
    position: "absolute",
    whiteSpace: "nowrap",
    fontSize: "49vh",
    fontFamily: "MarqueeFont, serif, sans-serif",
    color: "#110101FF",
    textShadow: "#6EE612FF 1px 0",
    zIndex: 1,
    // opacity: 0.9,
    pointerEvents: "none",
    // Marquee position is updated by requestAnimationFrame, making it independent
    ...(isPortrait ? {
      top: "50%",
      left: `${100 - marqueePos}vw`,
      transform: "translate(-50%, -50%)",
    } : {
      left: "50%",
      top: `${100 - marqueePos}vh`,
      transform: "translate(-50%, 0) rotate(90deg)",
    }),
  };

  // Although you're not rendering the hands, the angles are still calculated.
  // We'll keep this as it doesn't hurt performance much.
  const { secAngle, minAngle, hourAngle } = useMemo(() => calculateClockAngles(ntpSeconds), [ntpSeconds]);

  return (
    <div style={wrapperStyle}>
      {/* Clock Display */}
      <div style={clockStyle}>
        {isSynced ? (
          String(ntpSeconds).split("").map((digit, i) => (
            <span
              key={i}
              style={{
                color: digitColors[i]?.color || "#00ffff",
                textShadow: `1.0vh 0 0 ${digitColors[i]?.shadowColor || "#00ffff"}, -1.0vh 0 0 ${digitColors[i]?.shadowColor || "#00ffff"}, 1.1vh 0 0 ${digitColors[i]?.shadowColor || "#00ffff"}, -1.1vh 0 0 ${digitColors[i]?.shadowColor || "#00ffff"}, 1px 0 black, 0 -1px 0 black, 1px 0 0 black, -1px 0 0 black`,
              }}
            >
              {digit}
            </span>
          ))
        ) : (
          <span style={{ fontSize: "6vh", opacity: 0.0 }}>Syncing...</span>
        )}
      </div>

      {/* Marquee */}
      <div ref={marqueeRef} style={marqueeStyle}>
        {marqueeText.replace(/\{\{time\}\}/g, displayTime)}
      </div>
    </div>
  );
}
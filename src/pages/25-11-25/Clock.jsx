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
        const res = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
        const data = await res.json();
        const end = performance.now();
        if (!isMounted) return;

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
        const shadowH = (h + 180) % 360;
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
  const [marqueeProgress, setMarqueeProgress] = useState(0); // Tracks fraction of loop
  const [displayTime, setDisplayTime] = useState(new Date().toLocaleString([], { timeZoneName: 'short' }));
  const marqueeRef = useRef(null);

  // --- 1. Viewport Fix & Font Loading (MODIFIED) ---
  useLayoutEffect(() => {
    // Font Face Definitions (as before)
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
    
    // **Mobile Viewport Height Fix**
    const setAppHeight = () => {
        // Sets a CSS variable on the root to the true inner height of the window
        document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    }

    setAppHeight(); // Set on initial load
    window.addEventListener('resize', setAppHeight); // Update on resize/orientation change

    // Style injection for fonts
    const styleEl = document.createElement("style");
    styleEl.id = "dynamic-fonts";
    styleEl.innerHTML = fontFace;
    document.head.appendChild(styleEl);

    return () => {
      const existingEl = document.getElementById("dynamic-fonts");
      if (existingEl) document.head.removeChild(existingEl);
      window.removeEventListener('resize', setAppHeight); // Cleanup listener
    };
  }, []);


  // --- Core Change 1 & 2: Update Time & Colors Every Second (AS IS) ---
  useEffect(() => {
    if (!isSynced) return;
    
    const updatePerSecond = () => {
      const nowTime = Date.now() + offset;
      const newSeconds = Math.floor(nowTime / MS_PER_SECOND) + NTP_EPOCH_OFFSET;
      
      setNtpSeconds(newSeconds);
      setDigitColors(generateDigitColors(String(newSeconds).length)); 
      setDisplayTime(new Date().toLocaleString([], { timeZoneName: 'short' }));
    }

    updatePerSecond();
    
    const tick = setInterval(updatePerSecond, MS_PER_SECOND); 
    
    return () => clearInterval(tick);
  }, [isSynced, offset]);


  // --- 3. Marquee Animation (MODIFIED: Time-Based) ---
  useEffect(() => {
    let frame;
    let lastTimestamp = 0;
    const MARQUEE_SPEED_PX_PER_SECOND = 200; // Define a physical speed
    
    const step = (timestamp) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      // Time elapsed since the last frame in seconds
      const deltaTime = (timestamp - lastTimestamp) / MS_PER_SECOND;

      // Calculate the distance the marquee *should* have traveled
      const distanceTraveled = deltaTime * MARQUEE_SPEED_PX_PER_SECOND;

      setMarqueeProgress(prevProgress => {
        // Calculate the current position based on the component's size
        const element = marqueeRef.current;
        if (!element) return 0;

        const maxOffset = element.offsetWidth; // Assuming horizontal marquee for simplicity

        // Update the total distance traveled
        let newPos = prevProgress + distanceTraveled;

        // Reset the position to loop when it exceeds one full loop (maxOffset)
        if (newPos >= maxOffset) {
            newPos = newPos % maxOffset;
        }

        return newPos;
      });

      lastTimestamp = timestamp;
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []); // Runs once on mount


  // --- Styles and Rendering (MODIFIED: wrapperStyle, marqueeStyle) ---
  const isPortrait = window.innerHeight > window.innerWidth;

  const wrapperStyle = useMemo(() => ({
    width: "100vw",
    // 🚨 FIX: Use the CSS variable for mobile-safe height
    height: "var(--app-height, 100vh)", 
    minHeight: "-webkit-fill-available", // Fallback for some iOS/WebKit versions
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
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

  // Ensure enough text for seamless looping
  const marqueeText = Array(20).fill(staticText).join(" "); 

  const marqueeStyle = useMemo(() => ({
    position: "absolute",
    whiteSpace: "nowrap",
    fontSize: "49vh",
    fontFamily: "MarqueeFont, serif, sans-serif",
    color: "#110101FF",
    textShadow: "#6EE612FF 1px 0",
    zIndex: 1,
    pointerEvents: "none",
    // **CALCULATED POSITION: Use marqueeProgress for deterministic position**
    ...(isPortrait ? {
      top: "50%",
      left: `calc(100vw - ${marqueeProgress}px)`, // Marquee moves left from 100vw
      transform: "translate(-50%, -50%)",
    } : {
      left: "50%",
      top: `calc(100vh - ${marqueeProgress}px)`, // Marquee moves up from 100vh
      transform: "translate(-50%, 0) rotate(90deg)",
    }),
  }), [isPortrait, marqueeProgress]);

  // Although you're not rendering the hands, the angles are still calculated.
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
      {/* NOTE: For proper looping in a time-based/linear animation, the marquee 
           text should be duplicated within the element or via CSS/Web Animations API 
           to fill the empty space when one section scrolls out. The implementation 
           above only ensures a constant speed. */}
      <div ref={marqueeRef} style={marqueeStyle}>
        {marqueeText.replace(/\{\{time\}\}/g, displayTime)}
      </div>
    </div>
  );
}
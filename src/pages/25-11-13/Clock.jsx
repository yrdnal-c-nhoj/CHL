import React, { useEffect, useState, useRef } from "react";
// 🎯 Import the background image
import backgroundImageURL from "./bg.jpg"; 

// A unique ID generator for each rolling clock
let nextId = 0;

export default function RollingAnalogClock() {
  const [clocks, setClocks] = useState([]);

  /* ------------------------------------------------------------------
     SPAWN CLOCKS AT RANDOM INTERVALS
  ------------------------------------------------------------------ */
  useEffect(() => {
    let isMounted = true;

    const spawnClock = () => {
      if (!isMounted) return;

      // Random animation duration (3–15 seconds)
      const duration = Math.random() * 12 + 3; // 3 to 15 seconds
      // Random direction (50% chance each)
      const direction = Math.random() < 0.5 ? "right-to-left" : "left-to-right";
      setClocks((prev) => [
        ...prev,
        // duration is stored in milliseconds for cleanup
        { id: nextId++, born: Date.now(), duration: duration * 1000, direction }
      ]);

      // Schedule next spawn after random delay (0.3–2 seconds)
      const delay = Math.random() * 1700 + 300; // 300ms to 2000ms
      setTimeout(spawnClock, delay);
    };

    // Start spawning
    spawnClock();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------
     REMOVE CLOCKS AFTER THEIR RANDOM DURATION
  ------------------------------------------------------------------ */
  useEffect(() => {
    const cleaner = setInterval(() => {
      setClocks((prev) =>
        prev.filter((c) => Date.now() - c.born < c.duration)
      );
    }, 200); 
    return () => clearInterval(cleaner);
  }, []);

  /* ------------------------------------------------------------------
     ROOT STYLE: Uses the imported image
  ------------------------------------------------------------------ */
  const rootStyle = {
    width: "100vw",
    height: "100dvh",
    overflow: "hidden",
    // Use the imported image URL
    backgroundImage: `url('${backgroundImageURL}')`,
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    position: "relative",
  };

  return (
    <div style={rootStyle}>
      {clocks.map((clock) => (
        <SingleSlowRollingClock
          key={clock.id}
          duration={clock.duration / 1000} // Pass duration in seconds
          direction={clock.direction} 
        />
      ))}
    </div>
  );
}

// --------------------------------------------------------------------

/* ==================================================================
   A SINGLE ROLLING CLOCK (with extended hands and marker position)
================================================================== */
function SingleSlowRollingClock({ duration, direction }) {
  const clockRef = useRef(null);
  const handsRef = useRef({ hour: null, minute: null, second: null });
  const [now, setNow] = useState(new Date());
  
  // Set a large distance to ensure the clock travels completely off-screen
  const travelDistance = 150; // 150vw

  /* --------------------------------------
     Update clock hands every second
  --------------------------------------- */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const d = now;
    const sec = d.getSeconds() + d.getMilliseconds() / 1000;
    const min = d.getMinutes() + sec / 60;
    const hr = (d.getHours() % 12) + min / 60;
    
    // Apply transforms
    if (handsRef.current.hour)
      handsRef.current.hour.style.transform =
        `translate(-50%, 0) rotate(${hr * 30}deg)`;
    if (handsRef.current.minute)
      handsRef.current.minute.style.transform =
        `translate(-50%, 0) rotate(${min * 6}deg)`;
    if (handsRef.current.second)
      handsRef.current.second.style.transform =
        `translate(-50%, 0) rotate(${sec * 6}deg)`;
  }, [now]);

  /* --------------------------------------
     Trigger roll with set duration and direction
  --------------------------------------- */
  useEffect(() => {
    const el = clockRef.current;
    if (!el) return;

    // Set starting and ending positions based on direction, using vw for guaranteed off-screen travel
    const isRightToLeft = direction === "right-to-left";
    const startX = isRightToLeft ? `${travelDistance}vw` : `-${travelDistance}vw`;
    const endX = isRightToLeft ? `-${travelDistance}vw` : `${travelDistance}vw`;
    const rotation = isRightToLeft ? -720 : 720; // 2 full rotations

    // Starting position
    el.style.transform =
      `translateX(${startX}) translate(-50%, -50%) rotate(0deg)`;
    el.style.transition = "none";

    // Force reflow
    void el.offsetWidth;

    // Begin roll
    requestAnimationFrame(() => {
      el.style.transition = `transform ${duration}s linear`;
      el.style.transform =
        `translateX(${endX}) translate(-50%, -50%) rotate(${rotation}deg)`;
    });
  }, [duration, direction, travelDistance]);

  /* --------------------------------------
     Styles for clock layout (Hands made longer)
  --------------------------------------- */
  const clockFaceStyle = {
    width: "40vh",
    height: "40vh",
    borderRadius: "50%",
    background: "#FAF1C9FF",
    border: "0.5vh solid #222",
    position: "relative",
    boxShadow: "0 0.6vh 1.2vh rgba(0,0,0,0.08)",
  };

  const handCommon = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "50% 100%",
  };

  const hourStyle = {
    ...handCommon,
    width: "0.8vh",
    height: "8.5vh", // ⬅️ Longer
    marginTop: "-8.5vh",
    background: "#222",
    borderRadius: "0.4vh",
    zIndex: 3,
  };

  const minuteStyle = {
    ...handCommon,
    width: "0.6vh",
    height: "12vh", // ⬅️ Longer
    marginTop: "-12vh",
    background: "#111",
    borderRadius: "0.4vh",
    zIndex: 2,
  };

  const secondStyle = {
    ...handCommon,
    width: "0.35vh",
    height: "13vh", // ⬅️ Longer
    marginTop: "-13vh",
    background: "#d9534f",
    borderRadius: "0.2vh",
    zIndex: 1,
  };

  const pinStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "1.2vh",
    height: "1.2vh",
    marginLeft: "-0.6vh",
    marginTop: "-0.6vh",
    background: "#222",
    borderRadius: "50%",
    zIndex: 10,
  };

  // Initial position based on direction
  const initialX = direction === "right-to-left" ? `${travelDistance}vw` : `-${travelDistance}vw`;

  return (
    <div
      ref={clockRef}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translateX(${initialX}) translate(-50%, -50%)`,
      }}
    >
      <div style={clockFaceStyle}>
        {/* 12 o'clock marker only (Moved out further) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "0.9vh",
            height: "3vh",
            marginLeft: "-0.45vh",
            transform: "translateY(-18vh)", // ⬅️ Moved further out
            background: "#0F35DFFF",
            borderRadius: "0.3vh",
          }}
        />
        {/* hands */}
        <div ref={(el) => (handsRef.current.hour = el)} style={hourStyle} />
        <div ref={(el) => (handsRef.current.minute = el)} style={minuteStyle} />
        <div ref={(el) => (handsRef.current.second = el)} style={secondStyle} />
        <div style={pinStyle} />
      </div>
    </div>
  );
}
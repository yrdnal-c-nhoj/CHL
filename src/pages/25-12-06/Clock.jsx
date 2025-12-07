import React, { useEffect, useState } from "react";

// Import assets
import bgImage from "./giraffe.webp";
import hourHandImg from "./hand3.gif";
import minuteHandImg from "./hand1.gif";
import secondHandImg from "./hand2.gif";
import customFont_2025_1206 from "./gir.otf";
import tileImg from "./run.webp"; // single tiling image

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update viewport size
  useEffect(() => {
    const handleResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Custom font
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: 'CustomClockFont';
        src: url(${customFont_2025_1206}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Update clock frequently (16 times per second for smooth animation)
  useEffect(() => {
    // The higher frequency is critical for smooth second hand motion that includes milliseconds
    const timer = setInterval(() => setTime(new Date()), 1000 / 16);
    return () => clearInterval(timer);
  }, []);

  // Clock calculations
  const now = time;
  
  // Calculate total time in units needed for rotation (including milliseconds for ultra-smoothness)
  const totalHours = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600 + now.getMilliseconds() / 3600000;
  const totalMinutes = now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000; // Total minutes past the hour
  const totalSeconds = now.getSeconds() + now.getMilliseconds() / 1000; // Total seconds past the minute

  // Convert time units to degrees of rotation
  const hourDeg = totalHours * 30;         // 360 deg / 12 hours = 30 deg/hour
  const minuteDeg = totalMinutes * 6;       // 360 deg / 60 minutes = 6 deg/minute
  const secondDeg = totalSeconds * 6;       // 360 deg / 60 seconds = 6 deg/second

  // Tile settings
  const tileSize = 10; // vmin fixed size

  // Tile Count Calculation (ensures full coverage of viewport)
  const vmin = Math.min(viewport.width, viewport.height); 
  const tileSizePx = (tileSize / 100) * vmin; 
  
  const calculatedHorizontalTileCount = Math.ceil(viewport.width / tileSizePx);
  // Add 1 to ensure the tile container fully covers the viewport's height when centered
  const calculatedVerticalTileCount = Math.ceil(viewport.height / tileSizePx) + 1; 

  /**
   * Renders a row of tiles for the top/bottom edges.
   * FIX: Changed backgroundSize to "contain" to prevent clipping of non-square images.
   */
  const renderRowTiles = (rotationDeg) =>
    Array.from({ length: calculatedHorizontalTileCount }).map((_, i) => (
      <div
        key={i}
        style={{
          height: `${tileSize}vmin`,
          width: `${tileSize}vmin`,
          overflow: "hidden",              // keeps the tile area clean
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            backgroundImage: `url(${tileImg})`,
            backgroundSize: "contain",  // <--- FIX: Ensures the whole image is visible
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: `rotate(${rotationDeg}deg)`,
            transformOrigin: "center",
          }}
        />
      </div>
    ));

  /**
   * Renders a column of tiles for the left/right edges.
   * FIX: Changed backgroundSize to "contain" to prevent clipping of non-square images.
   */
  const renderColumnTiles = (rotationDeg) =>
    Array.from({ length: calculatedVerticalTileCount }).map((_, i) => (
      <div
        key={i}
        style={{
          height: `${tileSize}vmin`,
          width: `${tileSize}vmin`,
          overflow: "hidden",              // keeps the tile area clean
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            backgroundImage: `url(${tileImg})`,
            backgroundSize: "contain",  // <--- FIX: Ensures the whole image is visible
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: `rotate(${rotationDeg}deg)`,
            transformOrigin: "center",
          }}
        />
      </div>
    ));

  // Clock numbers
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const numberStyle = (num) => {
    // Calculate position for the number around the clock circle
    const angle = ((num - 3) * 30) * (Math.PI / 180); // -3 adjusts 12 to the top (90 deg)
    const radius = 45; // 45vmin radius from center
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {
      position: "absolute",
      left: `calc(50% + ${x}vmin)`,
      top: `calc(50% + ${y}vmin)`,
      fontSize: "clamp(7rem, 8vh, 8.5rem)",
      fontFamily: "CustomClockFont",
      userSelect: "none",
      textAlign: "center",
      transform: "translate(-50%, -50%)",
      textShadow: "1px 1px 0 white",
    };
  };

  const outerContainerStyle = {
    height: "100vh",
    width: "100vw",
    position: "relative",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const clockContainerStyle = {
    width: "85vmin",
    height: "85vmin",
    borderRadius: "50%",
    position: "relative",
    zIndex: 5,
  };

  const handStyle = (deg, width, height, transitionDuration) => ({
    position: "absolute",
    width: `${width}vmin`,
    height: `${height}vmin`,
    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
    transformOrigin: "50% 100%",
    top: "50%",
    left: "50%",
    // Use an immediate transition for the second hand, and smooth transitions for minute/hour hands
    transition: transitionDuration ? `transform ${transitionDuration}s linear` : 'none',
    zIndex: 10,
    filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.9)) drop-shadow(-2px -2px 2px rgba(255,255,255,0.7))",
    maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 15%)',
    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 15%)',
  });

  const rowContainerStyle = (position) => ({
    position: "absolute",
    top: position === "top" ? 0 : "auto",
    bottom: position === "bottom" ? 0 : "auto",
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    zIndex: 3,
  });

  const columnContainerStyle = (side) => ({
    position: "absolute",
    left: side === "left" ? 0 : "auto",
    right: side === "right" ? 0 : "auto",
    top: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    // Center the column tiles to cover potential edges
    justifyContent: "center", 
    zIndex: 3,
  });

  return (
    <div style={outerContainerStyle}>

      {/* Top row – rotated 180 deg to flip the image */}
      <div style={rowContainerStyle("top")}>
        {renderRowTiles(180)}
      </div>

      {/* Bottom row – normal orientation */}
      <div style={rowContainerStyle("bottom")}>
        {renderRowTiles(360)}
      </div>

      {/* LEFT SIDE – rotated 90 deg */}
      <div style={columnContainerStyle("left")}>
        {renderColumnTiles(90)}
      </div>

      {/* RIGHT SIDE – rotated 270 deg */}
      <div style={columnContainerStyle("right")}>
        {renderColumnTiles(270)}
      </div>

      {/* Clock Face and Hands */}
      <div style={clockContainerStyle}>
        {/* Clock Numbers */}
        {numbers.map((num) => (
          <div key={num} style={numberStyle(num)}>
            {num}
          </div>
        ))}

        {/* Hands */}
        {/* Minute Hand: 60-second transition for smooth minute movement */}
        <img 
          src={minuteHandImg} 
          alt="minute" 
          style={handStyle(minuteDeg, 25, 52, 60)} 
        />
        
        {/* Hour Hand: 12-hour transition for smooth hour movement */}
        <img 
          src={hourHandImg} 
          alt="hour" 
          style={handStyle(hourDeg, 28, 44, 12 * 3600)} 
        />
        
        {/* Second Hand: Immediate update (or 1 second transition, though faster is smoother) */}
        <img 
          src={secondHandImg} 
          alt="second" 
          style={handStyle(secondDeg, 26, 58, 0.0625)} // 1/16th of a second
        />
      </div>
    </div>
  );
}
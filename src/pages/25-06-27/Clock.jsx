import React, { useEffect, useRef, useState } from "react";
import morseFont from "./morse.ttf";
import birdsGif from "./birds.gif";

const colors = [
  "#c0c6c7", "#99a3a3", "#96431FFF", "#666666", "#333333", "#777777",
  "#444444", "#999999", "#888888", "#aaaaaa", "#bbbbbb", "#66615C",
  "#c0c6c7", "#99a3a3", "#894528FF", "#7E4930FF"
];

const totalLines = 250;
const svgWidth = 1000; // virtual coordinate system for SVG
const svgHeight = 500;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MorseClock = () => {
  const [time, setTime] = useState(new Date());
  const [digits, setDigits] = useState(Array(6).fill("0"));
  const [changingIndices, setChangingIndices] = useState(new Set());
  const wiresRef = useRef([]);
  const svgRef = useRef(null);

  // Load font using FontFace API once
  useEffect(() => {
    const font = new FontFace("morse", `url(${morseFont})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
    });
  }, []);

  // Initialize wires on mount
  useEffect(() => {
    if (!svgRef.current) return;
    wiresRef.current = [];

    // Calculate evenly spaced Y positions with shuffle
    const step = svgHeight / (totalLines + 1);
    const yPositions = Array.from({ length: totalLines }, (_, i) => (i + 1) * step);

    // Shuffle positions
    for (let i = yPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [yPositions[i], yPositions[j]] = [yPositions[j], yPositions[i]];
    }

    // Clear previous SVG children
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    for (let i = 0; i < totalLines; i++) {
      const sagFactor = randomInt(10, 100);
      const baseY = yPositions[i];
      const controlX = randomInt(svgWidth * 0.3, svgWidth * 0.7);
      const controlY = baseY + sagFactor;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const d = `M0 ${baseY} Q${controlX} ${controlY} ${svgWidth} ${baseY}`;
      path.setAttribute("d", d);
      path.setAttribute("stroke", colors[i % colors.length]);
      path.setAttribute("stroke-width", (1 + (i % 3) * 0.5).toString());
      path.setAttribute("fill", "none");
      path.style.transition = "d 0.5s ease-in-out";
      svgRef.current.appendChild(path);

      wiresRef.current.push({
        path,
        currentStartY: baseY,
        currentEndY: baseY,
        currentControlX: controlX,
        currentControlY: controlY,
        targetStartY: baseY,
        targetEndY: baseY,
        targetControlX: controlX,
        targetControlY: controlY,
        fixedStartY: baseY,
        fixedEndY: baseY,
      });
    }
  }, []);

  // Update wires animation function
  function updateWires() {
    wiresRef.current.forEach((wire) => {
      const sagFactor = randomInt(10, 100);
      wire.targetControlY = wire.fixedStartY + sagFactor;
      wire.targetControlX = randomInt(svgWidth * 0.3, svgWidth * 0.7);

      // Interpolate positions
      wire.currentControlY += (wire.targetControlY - wire.currentControlY) * 0.1;
      wire.currentControlX += (wire.targetControlX - wire.currentControlX) * 0.1;

      // Compose new path d attribute
      const d = `M0 ${wire.fixedStartY} Q${wire.currentControlX} ${wire.currentControlY} ${svgWidth} ${wire.fixedEndY}`;
      wire.path.setAttribute("d", d);
    });
  }

  // Update time and digits every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setTime(now);

      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const newDigits = [...hours, ...minutes, ...seconds];

      // Detect which digits changed to animate fade
      setChangingIndices((prev) => {
        const changed = new Set();
        newDigits.forEach((digit, idx) => {
          if (digit !== digits[idx]) changed.add(idx);
        });
        return changed;
      });

      setDigits(newDigits);
      updateWires();
    }, 1000);

    return () => clearInterval(interval);
  }, [digits]);

  // Clear changing classes after fade duration (300ms)
  useEffect(() => {
    if (changingIndices.size === 0) return;
    const timeout = setTimeout(() => {
      setChangingIndices(new Set());
    }, 300);
    return () => clearTimeout(timeout);
  }, [changingIndices]);

  // Styles

const styles = {
  container: {
    margin: 0,
    height: "100dvh",
    width: "100vw",
    background: "linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'morse', Arial, sans-serif",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "60vh",
    objectFit: "cover",
    zIndex: 0,
    opacity: 0.5,
    userSelect: "none",
    pointerEvents: "none",
  },
svg: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",  // increase from 50vh to 100vh or desired height
  zIndex: 1,
  pointerEvents: "none",
},

  clock: {
    display: "flex",
    flexDirection: "column",  // vertical stack
    gap: "2rem",
    position: "relative",
    zIndex: 4,
    userSelect: "none",
    alignItems: "center",  // center digits horizontally
  },
  digitBox: {
    width: "900%",     
      height: "1.5rem",    // taller for vertical stacking
    backgroundColor: "#b87333",
    color: "#b90404",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "3rem",
    boxShadow:
      "0px -0.2rem 0px #9db4a0, 0px 0.2rem 0px #9db4a0, 0px -0.325rem 0.25rem #ecf1c6, 0px 0.45rem 0.525rem #1a1b1a",
    fontWeight: "normal",
    textShadow:
      "0px -0.125rem 0px rgb(250, 247, 247), -0.125rem 0px 0px rgb(247, 242, 242), 0.125rem 0px 0px rgba(0, 0, 0), 0px 0.125rem 0px rgba(0, 0, 0), 0px -0.0625rem 0px rgb(248, 241, 241), -0.0625rem 0px 0px rgba(0, 0, 0), 0.0625rem 0px 0px rgba(0, 0, 0), 0px 0.0625rem 0px rgba(0, 0, 0)",
    transition: "opacity 0.3s ease-in-out",
    userSelect: "none",
  },
  digitText: (isChanging) => ({
    opacity: isChanging ? 0 : 1,
    transition: "opacity 0.3s ease-in-out",
  }),
};



  return (
    <div style={styles.container}>
      <img src={birdsGif} alt="Background" style={styles.bgImage} draggable={false} />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        style={styles.svg}
      ></svg>
      <div style={styles.clock} aria-label="Morse Code Clock">
        {digits.map((digit, i) => (
          <div key={i} style={styles.digitBox} aria-live="polite">
            <span style={styles.digitText(changingIndices.has(i))}>{digit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MorseClock;

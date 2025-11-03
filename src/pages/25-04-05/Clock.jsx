import React, { useState, useEffect } from "react";
// Import main background image
import overlayImg from "./images/gfccc.gif"; 

// --- 🖼️ CORRECT IMAGE IMPORTS ---
// Assuming gr4.gif, gr5.gif, and gr6.gif are in the same folder as the main component file, 
// or adjust the paths as necessary (e.g., if they are in './images/').
// I'll assume they are imported from the same place as overlayImg based on your original structure.
import hourHandSource from "./images/gr4.gif";
import minuteHandSource from "./images/gr5.gif";
import secondHandSource from "./images/gr9.png";
// ------------------------------------

// --- Clock Logic Functions (Unchanged) ---
const getHourRotation = (date) => {
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  return (hours * 30) + (minutes * 0.5);
};

const getMinuteRotation = (date) => {
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return (minutes * 6) + (seconds * 0.1);
};

const getSecondRotation = (date) => {
  const seconds = date.getSeconds();
  return seconds * 6;
};


const TallClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const hourRotation = getHourRotation(time);
  const minuteRotation = getMinuteRotation(time);
  const secondRotation = getSecondRotation(time);

  // Set image URLs using the imported source variables
  const hourHandStyle = { 
    backgroundImage: `url(${hourHandSource})`, 
    transform: `translateX(-50%) rotate(${hourRotation}deg)` 
  };
  const minuteHandStyle = { 
    backgroundImage: `url(${minuteHandSource})`, 
    transform: `translateX(-50%) rotate(${minuteRotation}deg)` 
  };
  const secondHandStyle = { 
    backgroundImage: `url(${secondHandSource})`, 
    transform: `translateX(-50%) rotate(${secondRotation}deg)` 
  };

  return (
    <div style={styles.container}>
      {/* Clock Content */}
      <div style={styles.clockContainer}>
        <div style={styles.clockFace}>
          
          {/* Hour Hand */}
          <div 
            style={{ 
              ...styles.hand, 
              ...styles.hourHand, 
              ...styles.imageHand, 
              ...hourHandStyle
            }} 
          />
          
          {/* Minute Hand */}
          <div 
            style={{ 
              ...styles.hand, 
              ...styles.minuteHand, 
              ...styles.imageHand,
              ...minuteHandStyle
            }} 
          />
          
          {/* Second Hand */}
          <div 
            style={{ 
              ...styles.hand, 
              ...styles.secondHand, 
              ...styles.imageHand,
              ...secondHandStyle
            }} 
          />
          
          <div style={styles.centerDot} />
        </div>
      </div>

      {/* Overlays */}
      <div style={{ ...styles.overlay, ...styles.overlay1 }} />
      <div style={{ ...styles.overlay, ...styles.overlay2 }} />
      <div style={{ ...styles.overlay, ...styles.overlay3 }} />
    </div>
  );
};

// --- Styles (Unchanged, optimized for image background) ---
const styles = {
  container: {
    backgroundColor: "#805c0d",
    margin: 0,
    padding: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  clockContainer: {
    position: "relative",
    zIndex: 9,
    width: "80vmin",
    height: "80vmin",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  clockFace: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    position: "relative",
  },
  centerDot: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    backgroundColor: "#333",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
  },
  
  // General hand properties
  hand: {
    position: "absolute",
    left: "50%",
    transformOrigin: "bottom center",
    transition: "all 0.1s cubic-bezier(0, 0, 0.58, 1)", 
  },
  
  // Properties for hands that use images
  imageHand: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom', 
    backgroundSize: '100% 100%',
    backgroundColor: 'transparent',
    borderRadius: 0, 
  },

  // Hand Sizing 
  hourHand: {
    width: "10%",
    height: "35%", 
    top: "15%",
    zIndex: 8,
  },
  minuteHand: {
    width: "8%",
    height: "45%",
    top: "5%",
    zIndex: 9,
  },
  secondHand: {
    width: "50%",
    height: "50%",
    top: "0%",
    zIndex: 11,
  },
  
  // Overlay Styles
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${overlayImg})`,
    backgroundRepeat: "repeat",
    zIndex: 1,
    pointerEvents: "none",
  },
  overlay1: {
    backgroundSize: "12vmin 12vmin",
    opacity: 0.8,
    zIndex: 5,
  },
  overlay2: {
    backgroundSize: "20vmin 20vmin",
    opacity: 0.5,
    zIndex: 6,
  },
  overlay3: {
    backgroundSize: "auto",
    opacity: 0.3,
    zIndex: 7,
  },
};

export default TallClock;
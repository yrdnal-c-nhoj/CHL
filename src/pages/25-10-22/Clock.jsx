import React, { useEffect, useRef, useState } from "react";
import videoFile from "./bg.mp4";
import fallbackImg from "./bg.webp";
import fontFile_2025_10_22 from "./fundy.ttf";

export default function ClockWithVideo() {
  const [fontReady, setFontReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  // CRITICAL CHANGE: showPlayButton is now always false and will never be set true
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [time, setTime] = useState(new Date());
  const videoRef = useRef(null);

  // Time update every 10ms (Unchanged)
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 10);
    return () => clearInterval(interval);
  }, []);

  // Font loading (Unchanged)
  useEffect(() => {
    const font = new FontFace(
      "MyCustomFont",
      `url(${fontFile_2025_10_22}) format("truetype")`
    );
    font
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        setFontReady(true);
      })
      // Set to true even if load fails, to prevent infinite loading state
      .catch(() => setFontReady(true));
  }, []);

  // Video Autoplay and Error Handling (MODIFIED)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onError = (e) => {
      console.error("Video error (asset failure):", e.target.error);
      setVideoFailed(true);
      // Removed: setShowPlayButton(true);
    };
    const onStalled = () => {
      // Removed: setShowPlayButton(true);
    };

    v.addEventListener("error", onError);
    v.addEventListener("stalled", onStalled);

    // Initial play attempt relies on <video autoPlay muted playsInline> for best chance.
    // We add an explicit play attempt for edge cases, but aggressively ignore the error.
    const playPromise = v.play?.();
    if (playPromise) {
      playPromise.catch((err) => {
        console.warn("Autoplay failed (Policy issue). Proceeding silently.", err);
        // Removed: setShowPlayButton(true);
      });
    }
    
    // Set a timeout to check for asset failure (enhances fallback reliability)
    const checkReadiness = setTimeout(() => {
        if (v.readyState < 4 && !v.paused) {
             console.warn("Video failed to load completely. Switching to fallback.");
             setVideoFailed(true);
        }
    }, 3000); // 3-second grace period

    return () => {
      clearTimeout(checkReadiness);
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onStalled);
    };
  }, []);

  // Removed: handlePlayClick function

  const formatTime = () => {
    const h = String(time.getHours()).padStart(2, "0");
    const m = String(time.getMinutes()).padStart(2, "0");
    const s = String(time.getSeconds()).padStart(2, "0");
    // Milliseconds slice for the 2-digit "tick" at the end
    const ms = String(time.getMilliseconds()).padStart(3, "0");
    return `${h}${m}${s}${ms.slice(0, 2)}`;
  };

  const timeChars = formatTime().split("");

  const containerStyle = {
    width: "100vw",
    height: "100dvh",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
    display: fontReady ? "block" : "none",
  };

  const mediaStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
    pointerEvents: "none",
    display: videoFailed ? "none" : "block",
  };

  const fallbackStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: videoFailed ? "block" : "none",
  };

  const clockStyle = {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.1rem",
    zIndex: 1,
    animation: "float_2025_10_22 26.3s linear infinite",
  };

  const digitStyle = {
    fontFamily: "'MyCustomFont', sans-serif",
    fontSize: "4rem",
    width: "2rem",
    textAlign: "center",
    color: "#DF9268FF",
    animation: "colorCycle_2025_10_22 26s linear infinite",
    textShadow: `
      0 0 8px #4B3424FF,
      0 0 6px #98643FFF,
      0 0 4px #C88A5E,
      0 0 2px #D2C497FF
    `,
    transition: "text-shadow 1s linear",
  };

  const separatorStyle = {
    ...digitStyle,
    width: "1rem",
  };

  const scopedCSS = `
    @font-face {
      font-family: 'MyCustomFont';
      src: url(${fontFile_2025_10_22}) format('truetype');
      font-display: block;
    }

    @keyframes float_2025_10_22 {
      0% { bottom: 0; }
      50% { bottom: calc(100dvh - 4rem - 20px); }
      100% { bottom: 0; }
    }

    @keyframes colorCycle_2025_10_22 {
      0% {
        color: #df9268ff;
        text-shadow:
           -1px 0 0px #4b3424ff,
           0 0 6px #98643fff,
           0 0 4px #c88a5e,
           1px 0 2px #d2c497ff;
        opacity: 1;
      }
      23.08% {
        opacity: 0;
        color: #7C947CFF;
        text-shadow:
          -1px -1px #04140BFF,
           3px 2px 6px #E6EDE9FF,
          -2px 0 4px #EBECEBFF,
           1px 1px #e4ebe6ff;
      }
      50% {
        opacity: 1;
        color: #F4ECCCFF;
        text-shadow:
          1px 1px #e10e23ff,
          0 0 6px #F8FDF7FF,
          0 0 4px #5874a0ff,
         -1px 0 #0d131cff;
      }
      76.92% {
        opacity: 0;
        color: #7C947CFF;
        text-shadow:
          -1px -1px #04140BFF,
           3px 2px 6px #E6EDE9FF,
          -2px 0 4px #EBECEBFF,
           1px 1px #e4ebe6ff;
      }
      100% {
        color: #df9268ff;
        text-shadow:
           -1px 0 0px #4b3424ff,
           0 0 6px #98643fff,
           0 0 4px #c88a5e,
           1px 0 2px #d2c497ff;
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      video {
        /* CHANGED: Use cover to fill the screen for a background effect */
        object-fit: cover; 
      }
    }
  `;

  // Helper function to insert separators into the time string for readability
  const renderTimeDigits = () => {
    // Current format is HHMMSSms(2)
    const formattedTime = formatTime(); 
    const elements = [];
    
    // Use an iterator to track the digit index
    let charIndex = 0;
    
    // HH
    elements.push(<span key={charIndex++} style={digitStyle}>{formattedTime[0]}</span>);
    elements.push(<span key={charIndex++} style={digitStyle}>{formattedTime[1]}</span>);
    elements.push(<span key="sep1" style={separatorStyle}>:</span>); // Separator 1

    // MM
    elements.push(<span key={charIndex++} style={digitStyle}>{formattedTime[2]}</span>);
    elements.push(<span key={charIndex++} style={digitStyle}>{formattedTime[3]}</span>);
    elements.push(<span key="sep2" style={separatorStyle}>:</span>); // Separator 2
    
    // SS
    elements.push(<span key={charIndex++} style={digitStyle}>{formattedTime[4]}</span>);
    elements.push(<span key={charIndex++} style={digitStyle}>{formattedTime[5]}</span>);
    elements.push(<span key="sep3" style={separatorStyle}>.</span>); // Separator 3
    
    // MS (2 digits)
    elements.push(<span key={charIndex++} style={digitStyle}>{formattedTime[6]}</span>);
    elements.push(<span key={charIndex++} style={digitStyle}>{formattedTime[7]}</span>);

    return elements;
  }
  
  return (
    <div style={containerStyle}>
      {/* CSS is injected here */}
      <style>{scopedCSS}</style>
      <video
        ref={videoRef}
        style={mediaStyle}
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
      >
        <source src={videoFile} type="video/mp4" />
        {/* It is a good practice to include a WebM source for better cross-browser support */}
        <source src="./bg.webm" type="video/webm" /> 
        Your browser does not support the video tag.
      </video>
      <div style={fallbackStyle} aria-hidden />
      
      {/* 🛑 The 'Play Video' button rendering block is intentionally REMOVED here */}
      
      <div style={clockStyle}>
        {/* Rendering the time with explicit separators for clear readability */}
        {renderTimeDigits()}
      </div>
    </div>
  );
}
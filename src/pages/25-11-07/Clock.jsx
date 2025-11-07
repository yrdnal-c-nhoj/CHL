import React, { useState, useEffect, useRef } from "react";
import bgImage from "./birds.webp";

export default function PanicAnalogClock() {
  
  // === CONFIGURATION ===
  // Inward pan amount (kept for image positioning)
  const edgeInset = -4; 
  // Fade animation duration (kept for transition style)
  const fadeDuration = 250; 
  // Right image delay (kept for controlled fade-in)
  const rightImageDelay = 100; 
  // Opacity values (as requested)
  const leftOpacity = 0.8;
  const rightOpacity = 0.5;
  
  
  
  
  // === STATE ===
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [leftSrc, setLeftSrc] = useState(bgImage);
  const [hasRefetched, setHasRefetched] = useState(false);
  const refetchTimer = useRef(null);

  // === EFFECTS ===
  useEffect(() => {
    // Show left image immediately
    setShowLeft(true);

    // Then show right image half a second later
    const timer = setTimeout(() => {
      setShowRight(true);
    }, rightImageDelay);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (refetchTimer.current) clearTimeout(refetchTimer.current);
    };
  }, []);

  // === STYLES ===
  const baseImgStyle = {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "auto",
    objectFit: "contain",
    pointerEvents: "none",
    transition: `opacity ${fadeDuration}ms ease-out`,
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left image (appears immediately) */}
      <img
        src={leftSrc}
        alt="left background"
        onLoad={() => {
          if (!hasRefetched) {
            refetchTimer.current = setTimeout(() => {
              setLeftSrc(`${bgImage}?t=${Date.now()}`);
              setHasRefetched(true);
            }, 7000);
          }
        }}
        style={{
          ...baseImgStyle,
          left: 0,
          opacity: showLeft ? leftOpacity : 0,
          objectPosition: "left center",
          marginLeft: -edgeInset,
          zIndex: 5,
        }}
      />

      {/* Right image (fades in later) */}
      <img
        src={bgImage}
        alt="right background"
        style={{
          ...baseImgStyle,
          right: 0,
          opacity: showRight ? rightOpacity : 0,
          objectPosition: "right center",
          transform: "scaleX(-1)",
          marginRight: -edgeInset,
          zIndex: 6,
        }}
      />
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import bgImage from "./birds.webp";
import todayFont from "./twobirds.ttf"; // Font import for TTF file

export default function PanicAnalogClock() {
  // === CONFIGURATION ===
  const edgeInset = 324;
  const fadeDuration = 50;
  const rightImageDelay = 390; // 0.5s delay as requested
  const leftOpacity = 0.4;
  const rightOpacity = 0.6;
  const fontName = "CustomClockFont"; // Custom font name for @font-face

  // === STATE ===
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [leftSrc, setLeftSrc] = useState(null);
  const [rightSrc, setRightSrc] = useState(null);
  const [fontUrl, setFontUrl] = useState(null);

  // Refs for cleanup of object URLs and timers
  const urlsRef = useRef({ left: null, right: null, font: null });
  const timersRef = useRef({ rightDelay: null });

  const [timeStr, setTimeStr] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setOverlayVisible(false), 500);
    return () => clearTimeout(t);
  }, []);

  const formatTime = (d) => {
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    const mm = String(m).padStart(2, "0");
    return `${h}:${mm} ${ampm}`;
  };

  // === TIME UPDATE EFFECT ===
  useEffect(() => {
    const update = () => setTimeStr(formatTime(new Date()));
    update();
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId = null;
    const timeoutId = setTimeout(() => {
      update();
      intervalId = setInterval(update, 60_000);
    }, Math.max(0, msToNextMinute));
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // === IMAGE AND FONT FETCH EFFECT ===
  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        // Fetch the animated image
        const imgRes = await fetch(bgImage, { cache: "no-store" });
        const imgBuf = await imgRes.arrayBuffer();
        const imgBlobType = imgRes.headers.get("content-type") || "image/gif";
        const blobLeft = new Blob([imgBuf], { type: imgBlobType });
        const blobRight = new Blob([imgBuf], { type: imgBlobType });
        const urlLeft = URL.createObjectURL(blobLeft);
        const urlRight = URL.createObjectURL(blobRight);

        // Fetch the font
        const fontRes = await fetch(todayFont, { cache: "no-store" });
        const fontBuf = await fontRes.arrayBuffer();
        const fontBlobType = fontRes.headers.get("content-type") || "font/ttf";
        const fontBlob = new Blob([fontBuf], { type: fontBlobType });
        const fontUrl = URL.createObjectURL(fontBlob);

        if (aborted) {
          URL.revokeObjectURL(urlLeft);
          URL.revokeObjectURL(urlRight);
          URL.revokeObjectURL(fontUrl);
          return;
        }

        urlsRef.current.left = urlLeft;
        urlsRef.current.right = urlRight;
        urlsRef.current.font = fontUrl;

        // Set image sources
        setLeftSrc(urlLeft);
        setShowLeft(true);
        timersRef.current.rightDelay = setTimeout(() => {
          setRightSrc(urlRight);
          setShowRight(true);
        }, rightImageDelay);

        // Set font URL
        setFontUrl(fontUrl);
      } catch (e) {
        // Fallback for images
        setLeftSrc(`${bgImage}?l=${Date.now()}`);
        timersRef.current.rightDelay = setTimeout(() => {
          setRightSrc(`${bgImage}?r=${Date.now()}`);
        }, rightImageDelay);
        setShowLeft(true);
        timersRef.current.rightDelay = setTimeout(() => setShowRight(true), rightImageDelay);

        // Fallback for font
        setFontUrl(null);
      }
    })();

    return () => {
      // Cleanup timers and object URLs
      if (timersRef.current.rightDelay) clearTimeout(timersRef.current.rightDelay);
      if (urlsRef.current.left) URL.revokeObjectURL(urlsRef.current.left);
      if (urlsRef.current.right) URL.revokeObjectURL(urlsRef.current.right);
      if (urlsRef.current.font) URL.revokeObjectURL(urlsRef.current.font);
      aborted = true;
    };
  }, [rightImageDelay]);






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


  const stoneClockStyle = {
    position: "absolute",
    bottom: "2vh",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: 4,
    fontFamily: fontUrl ? `"${fontName}", Menlo, Monaco, Consolas, monospace` : "Menlo, Monaco, Consolas, monospace",
    fontWeight: 900,
    fontSize: "10vh",
    lineHeight: 1,
    letterSpacing: "0.6vh",
    userSelect: "none",
    // REFINED TEXT SHADOW for deeper carving and clearer 3D-ness
    textShadow: [
      // Deep, offset shadow for 'carved out' depth
      "0.3vh 0.3vh 0.4vh rgba(0, 0, 0, 0.9)", 
      "0.5vh 0.5vh 0.8vh rgba(0, 0, 0, 0.8)",
      // Very slight, lighter border for an etched edge
      "0.1vh 0.1vh 0 rgba(255, 255, 255, 0.2)",
      // Inset shadows - simulates light hitting the carved surface edges
      "inset 0 0 1vh rgba(0, 0, 0, 0.5)", // Inner dark shadow
      "inset -0.2vh -0.2vh 0.3vh rgba(255, 255, 255, 0.2)", // Inner highlight
    ].join(", "),
    
    // REFINED ROCKY TEXTURE with more pronounced speckles and color variation
    backgroundImage: [
      // Base: Darker, cooler grey for stone
      "linear-gradient(135deg, #C1AA85FF 0%, #EBD258FF 100%)", 
      
      // Speckled texture (noise) - slightly more random and colored
      "radial-gradient(circle at 50% 50%, rgba(255, 255, 255) 1%, transparent 2%)",
      "radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.8) 1%, transparent 3%)",
      "radial-gradient(circle at 75% 30%, rgba(150, 100, 70, 0.1) 1%, transparent 2.5%)", // Hint of brown/earth tone
      
      // Lighting/Highlighting for the top surface (subtle, non-text-filled)
      "linear-gradient(to top, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.0) 50%)",
    ].join(", "),
    
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    
    // 3D transform for better perspective on a stone slab
    transform: "perspective(80vh) rotateX(10deg) rotateY(-5deg) scale(1.02)",
    transformOrigin: "center bottom",
  };



  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        backgroundColor: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Inline @font-face for custom font */}
      {fontUrl && (
        <style>
          {`
            @font-face {
              font-family: "${fontName}";
              src: url("${fontUrl}") format("truetype");
              font-weight: 900;
              font-style: normal;
              font-display: swap;
            }
          `}
        </style>
      )}

      {/* Bottom layer (starts immediately) */}
      <img
        src={leftSrc || undefined}
        alt="left background"
        style={{
          ...baseImgStyle,
          left: 0,
          opacity: showLeft ? leftOpacity : 0,
          objectPosition: "left center",
          marginLeft: -edgeInset,
          zIndex: 2,
        }}
      />
      {/* Top layer (starts after 0.5s) */}
      <img
        src={rightSrc || undefined}
        alt="right background"
        style={{
          ...baseImgStyle,
          right: 0,
          opacity: showRight ? rightOpacity : 0,
          objectPosition: "right center",
          transform: "scaleX(-1)",
          marginRight: -edgeInset,
          zIndex: 1,
        }}
      />
      <div style={stoneClockStyle}>{timeStr}</div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000",
          opacity: overlayVisible ? 1 : 0,
          transition: "opacity 500ms ease-out",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </div>
  );
}
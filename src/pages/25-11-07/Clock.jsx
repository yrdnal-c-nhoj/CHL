import React, { useState, useEffect, useRef } from "react";
import bgImage from "./birds.webp";
import todayFont from "./twobirds.ttf"; // Font import for TTF file

export default function PanicAnalogClock() {
  // === CONFIGURATION ===
  const edgeInset = 324;
  const fadeDuration = 50;
  const rightImageDelay = 590; // 0.5s delay as requested
  const leftOpacity = 0.5;
  const rightOpacity = 1.0;
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
  const [leftLoaded, setLeftLoaded] = useState(false);
  const [rightLoaded, setRightLoaded] = useState(false);


  const formatTime = (d) => {
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    const mm = String(m).padStart(2, "0");
    return `${h}${mm} ${ampm}`;
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
  // Start fade 100ms after the second image has loaded
  useEffect(() => {
    if (!rightLoaded) return;
    let cancelled = false;
    const t = setTimeout(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (!cancelled) setOverlayVisible(false);
      });
    }, 100);
    return () => { cancelled = true; clearTimeout(t); };
  }, [rightLoaded]);

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
    opacity: 0.9,
    userSelect: "none",
    // Container-level stronger drop shadow for lift
    textShadow: "0.6vh 1vh 2vh rgba(0,0,0,0.7)",
    transform: "perspective(80vh) rotateX(10deg) rotateY(-5deg) scale(1.02)",
    transformOrigin: "center bottom",
  };

  // Per-digit rock styling
  const rockDigitStyle = {
    display: "inline-block",
    padding: "0 0.15em",
    // Layered rock texture (warm brown stone)
    backgroundImage: [
      // Base strata: warm browns
      "linear-gradient(135deg, #5b3a1d 0%, #8a5b33 35%, #c59a6a 70%, #e0c39a 100%)",
      // Light mineral flecks
      "radial-gradient(circle at 22% 28%, rgba(255,235,200,0.22) 0%, transparent 30%)",
      "radial-gradient(circle at 68% 62%, rgba(90,60,30,0.35) 0%, transparent 40%)",
      // Dark inclusions
      "radial-gradient(circle at 40% 80%, rgba(40,25,15,0.28) 0%, transparent 28%)",
      // Subtle top highlight
      "linear-gradient(to top, rgba(255,240,210,0.14), rgba(0,0,0,0) 60%)",
    ].join(", "),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    // Carved/beveled edges tuned for brown stone
    textShadow: [
      "0.7vh 0.9vh 0 rgba(0,0,0,0.9)",          // deep drop
      "0.28vh 0.28vh 0 rgba(255,230,200,0.55)", // warm highlight edge
      "-0.2vh -0.2vh 0 rgba(70,45,25,0.6)",     // inner bevel
      "0 1.6vh 2.8vh rgba(0,0,0,0.9)",          // ambient thickness
    ].join(", "),
    filter: "saturate(0.95) contrast(1.12)",
    opacity: 0.8,
  };

  const rockPunctStyle = {
    display: "inline-block",
    opacity: 0.2,
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
        onLoad={() => setLeftLoaded(true)}
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
        onLoad={() => setRightLoaded(true)}
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
      <div style={stoneClockStyle}>
        {Array.from(timeStr).map((ch, idx) => {
          const isAlnum = /[0-9A-Za-z]/.test(ch);
          if (!isAlnum) {
            return (
              <span key={idx} style={rockPunctStyle}>{ch}</span>
            );
          }
          // Slight per-digit variation for a more natural rock look
          const rot = (Math.random() * 4 - 2).toFixed(2); // -2deg to 2deg
          const lift = (Math.random() * 0.2 - 0.1).toFixed(2); // -0.1em to 0.1em
          const bright = (0.95 + Math.random() * 0.1).toFixed(2); // 0.95..1.05
          const perDigitStyle = {
            ...rockDigitStyle,
            transform: `translateY(${lift}em) rotate(${rot}deg)`,
            filter: `${rockDigitStyle.filter} brightness(${bright})`,
          };
          return (
            <span key={idx} style={perDigitStyle}>{ch}</span>
          );
        })}
      </div>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100svh",
          backgroundColor: "#000",
          opacity: overlayVisible ? 1 : 0,
          transition: "opacity 700ms ease-out",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "opacity",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
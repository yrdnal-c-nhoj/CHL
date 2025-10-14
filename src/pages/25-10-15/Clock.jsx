// Clock.jsx
import React, { useEffect, useState, useRef } from "react";
/*
  IMPORTANT:
  - Put your font file in the same folder and name it something like: myfont-20251013.ttf
    The imported variable name must contain today's date (20251013) per your requirement.
  - Put your background image in the same folder (e.g. bg.jpg)
*/
import bgImage from "./roundhay.webp";
import d20251013Font from "./air.ttf"; // variable name contains 20251013

export default function Clock() {
  const [ready, setReady] = useState(false); // only render when true
  const [now, setNow] = useState(new Date());
  const tickRef = useRef(null);
  const styleTagRef = useRef(null);

  // Helper: zero-pad
  const z = (n) => (n < 10 ? `0${n}` : String(n));

  useEffect(() => {
    let mounted = true;

    // 1) Inject @font-face rule (inline style element). This is global but the font will only
    //    be used on the clock container via inline fontFamily to avoid leakage.
    const fontFamilyName = "LocalClockFont-20251013";
    const styleTag = document.createElement("style");
    styleTagRef.current = styleTag;
    styleTag.type = "text/css";
    styleTag.innerHTML = `
      @font-face {
        font-family: '${fontFamilyName}';
        src: url('${d20251013Font}') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(styleTag);

    // 2) Use FontFace API to load font (more reliable for preloading)
    const fontFace = new FontFace(fontFamilyName, `url(${d20251013Font})`, {});
    // Load the font, add to document.fonts
    fontFace.load().then((loadedFace) => {
      document.fonts.add(loadedFace);
      // optional: ensure font is actually available via document.fonts.ready
      return document.fonts.ready;
    }).catch((err) => {
      // if font fails to load, we still proceed (but user may see fallback)
      console.error("Font failed to load:", err);
    }).finally(() => {
      // Wait for image to load too (below)
    });

    // 3) Preload background image
    const img = new Image();
    img.src = bgImage;
    img.onload = () => {
      // both font and image must be available; check document.fonts.status via ready promise
      document.fonts.ready.then(() => {
        if (mounted) setReady(true);
      }).catch(() => {
        if (mounted) setReady(true);
      });
    };
    img.onerror = () => {
      // If image fails, still proceed to avoid blocking forever
      console.warn("Background image failed to load, proceeding anyway.");
      document.fonts.ready.then(() => {
        if (mounted) setReady(true);
      }).catch(() => {
        if (mounted) setReady(true);
      });
    };

    return () => {
      mounted = false;
      // cleanup injected style
      if (styleTagRef.current && styleTagRef.current.parentNode) {
        styleTagRef.current.parentNode.removeChild(styleTagRef.current);
      }
      // clear interval if set
      if (tickRef.current) {
        clearInterval(tickRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // start clock interval only when ready
  useEffect(() => {
    if (!ready) return;
    // update every 250ms so seconds flip nicely
    tickRef.current = setInterval(() => {
      setNow(new Date());
    }, 250);
    return () => clearInterval(tickRef.current);
  }, [ready]);

  // If not ready, render nothing (no FOUC)
  if (!ready) return null;

  // Format time
  const hours24 = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const isAM = hours24 < 12;
  // leading zeros already via z()
  const display = `${z(hours24)} hours ${z(minutes)} minutes ${z(seconds)} seconds`;

  // Inline styles (all inline, use vh units)
  const containerStyle = {
    boxSizing: "border-box",
    // full viewport
    width: "100vw",
    height: "100vh",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // background image fill (cover)
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    // overlay a subtle dark layer so clock remains legible
    position: "relative",
    overflow: "hidden",
    fontFamily: "LocalClockFont-20251013, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    // semi-transparent overlay using vh-based opacity-like effect via rgba
    background: "rgba(0,0,0,0.25)",
    pointerEvents: "none",
  };

  const clockCardStyle = {
    position: "relative",
    zIndex: 2,
    // sizing using vh (so it scales with viewport height)
    width: "80vh", // card width relative to vh to respect user's "use view height"
    maxWidth: "95vw",
    padding: "3vh",
    borderRadius: "2vh",
    // subtle glass effect
    backdropFilter: "blur(0.6vh)",
    WebkitBackdropFilter: "blur(0.6vh)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    boxShadow: "0 0.6vh 1.5vh rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.2vh",
    border: "0.1vh solid rgba(255,255,255,0.08)",
  };

  const timeTextStyle = {
    fontSize: "6vh", // large, responsive
    lineHeight: 1.05,
    letterSpacing: "0.1vh",
    color: "white",
    textAlign: "center",
    fontWeight: 600,
    margin: 0,
    // ensure the font applies only here
    fontFamily: "LocalClockFont-20251013, inherit",
    userSelect: "none",
  };

  const ampmStyle = {
    fontSize: "2.4vh",
    color: "rgba(255,255,255,0.9)",
    background: "rgba(0,0,0,0.25)",
    padding: "0.6vh 1.2vh",
    borderRadius: "1vh",
    marginTop: "0.6vh",
    border: "0.08vh solid rgba(255,255,255,0.08)",
  };

  const smallMetaStyle = {
    fontSize: "2vh",
    color: "rgba(255,255,255,0.85)",
    marginTop: "0.8vh",
    opacity: 0.95,
  };

  return (
    <div style={containerStyle} aria-hidden={false}>
      <div style={overlayStyle} />
      <div style={clockCardStyle} role="region" aria-label="Digital clock">
        <p style={timeTextStyle}>{display}</p>
        <div style={ampmStyle} aria-hidden={false}>
          {isAM ? "AM" : "PM"}
        </div>
        <div style={smallMetaStyle}>
          24-hour · leading zeros · background image
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import font20251016 from "./20251016-brahmi.ttf"; // replace with your font filename — variable contains today's date
import bgVideo from "./bg.mp4"; // background mp4 (same folder)
import bgFallback from "./bg.webp"; // background webp fallback (same folder)

// 1980s Video Counter Clock (Vite + React)
// - Inline styles only
// - Uses vh units, no px
// - Preloads font and waits for font + background ready before rendering
// - Avoids style leakage by scoping font-family and injecting @font-face into component

export default function VideoCounterClock() {
  const [ready, setReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [time, setTime] = useState(new Date());
  const rafRef = useRef(null);
  const videoRef = useRef(null);

  // Unique font-family name to avoid leakage
  const fontFamily = "VC_1980s_Font_20251016";

  // Inject font-face rule scoped to this component (inline styles only)
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-vc-font", "");
    styleEl.innerHTML = `@font-face { font-family: '${fontFamily}'; src: url('${font20251016}') format('truetype'); font-display: swap; }`;
    document.head.appendChild(styleEl);

    // preload the font resource
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.href = font20251016;
    link.type = "font/ttf";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(styleEl);
      document.head.removeChild(link);
    };
  }, []); // run once

  // Wait for font to be fully loaded (no FOUT)
  const waitForFont = async () => {
    try {
      // document.fonts.ready ensures fonts that are loading become available
      await document.fonts.load(`1rem ${fontFamily}`);
      // Extra wait for readiness
      await (document.fonts.ready);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Try to load video; if it fails, load fallback image
  useEffect(() => {
    let cancelled = false;

    const prepare = async () => {
      const fontOk = await waitForFont();

      if (cancelled) return;

      // try to probe the video by creating a temporary video element
      const v = document.createElement("video");
      v.src = bgVideo;
      v.preload = "auto";
      v.muted = true;
      v.playsInline = true;

      const videoLoadPromise = new Promise((res) => {
        v.onloadeddata = () => res({ ok: true });
        v.onerror = () => res({ ok: false });
      });

      const vidResult = await videoLoadPromise;

      if (cancelled) return;

      if (!vidResult.ok) {
        // try fallback image
        const img = new Image();
        img.src = bgFallback;

        const imgResult = await new Promise((res) => {
          img.onload = () => res({ ok: true });
          img.onerror = () => res({ ok: false });
        });

        if (!imgResult.ok) {
          // neither video nor fallback loaded; still render but with plain background
          setUseFallback(false);
        } else {
          setUseFallback(true);
        }
      } else {
        setUseFallback(false);
      }

      if (fontOk) setReady(true);
    };

    prepare();

    return () => {
      cancelled = true;
    };
  }, []);

  // Clock update using requestAnimationFrame for sub-second precision
  useEffect(() => {
    let mounted = true;

    const tick = () => {
      setTime(new Date());
      rafRef.current = requestAnimationFrame(tick);
    };

    if (ready) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  if (!ready) return null; // only render the clock once font + background probe are done

  // Formatting helpers
  const pad = (n, len = 2) => n.toString().padStart(len, "0");
  const hrs = pad(time.getHours()); // 24-hour
  const mins = pad(time.getMinutes());
  const secs = pad(time.getSeconds());
  const ms = pad(time.getMilliseconds(), 3); // 3 digits
  const msLeft = ms.slice(0, 2); // first two digits in first column
  const msRight = ms.slice(2); // last digit in second column

  // Inline styles (all units in vh or em derived from vh)
  const baseVh = 1; // 1vh === 1 unit
  const remVh = `${3 * baseVh}vh`; // a base 'rem' like value

  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    fontFamily,
  };

  const videoStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  };

  const fallbackImgStyle = {
    ...videoStyle,
    display: "block",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.35))",
    zIndex: 1,
  };

  const clockShellStyle = {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `calc(${remVh} * 0.8)`,
    borderRadius: `calc(${remVh} * 0.4)`,
    background: "rgba(10,10,10,0.45)",
    boxShadow: `0 calc(${baseVh} * 1vh) calc(${baseVh} * 2vh) rgba(0,0,0,0.7) inset`,
    backdropFilter: "blur(0.5vh)",
  };

  const digitsStyle = {
    display: "flex",
    alignItems: "center",
    gap: `calc(${remVh} * 0.35)`,
    color: "#39FF14", // neon green typical 80s counter
    fontWeight: 700,
    fontSize: `calc(${remVh} * 2.4)`,
    letterSpacing: `calc(${baseVh} * 0.2vh)`,
    textShadow: `0 calc(${baseVh} * 0.2vh) calc(${baseVh} * 0.6vh) rgba(0,255,0,0.12)`,
    fontFamily,
  };

  const blockStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `calc(${remVh} * 0.35) calc(${remVh} * 0.6)`,
    background: "rgba(0,0,0,0.65)",
    borderRadius: `calc(${remVh} * 0.2)`,
    minWidth: `calc(${remVh} * 6)`,
    textAlign: "center",
    boxShadow: `0 calc(${baseVh} * 0.1vh) calc(${baseVh} * 0.4vh) rgba(0,0,0,0.6)`,
  };

  const colonStyle = {
    fontFamily,
    opacity: 0.95,
  };

  const msContainer = {
    display: "flex",
    flexDirection: "column",
    marginLeft: `calc(${remVh} * 0.4)`,
    gap: `calc(${remVh} * 0.12)`,
    alignItems: "stretch",
    justifyContent: "center",
  };

  const msColumn = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `calc(${remVh} * 0.25)`,
    background: "rgba(0,0,0,0.6)",
    borderRadius: `calc(${remVh} * 0.15)`,
    minWidth: `calc(${remVh} * 1.4)`,
    fontSize: `calc(${remVh} * 1.05)`,
    letterSpacing: `calc(${baseVh} * 0.08vh)`,
  };

  return (
    <div style={containerStyle} aria-hidden={false}>
      {/* Background: prefer MP4, fallback to WEBP image */}
      {!useFallback ? (
        <video
          ref={videoRef}
          style={videoStyle}
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img src={bgFallback} style={fallbackImgStyle} alt="background" />
      )}

      <div style={overlayStyle} />

      <div style={clockShellStyle}>
        <div style={digitsStyle} role="timer" aria-live="polite">
          <div style={blockStyle}>{hrs}</div>
          <div style={colonStyle}>:</div>
          <div style={blockStyle}>{mins}</div>
          <div style={colonStyle}>:</div>
          <div style={blockStyle}>{secs}</div>

          <div style={msContainer} aria-hidden={false}>
            <div style={msColumn}>{msLeft}</div>
            <div style={msColumn}>{msRight}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

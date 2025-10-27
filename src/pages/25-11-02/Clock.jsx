// MediaClock.jsx
import React, { useEffect, useRef, useState } from "react";
import bgVideo from "./bg.mp4";
import fallbackImg from "./bg.gif";

export default function MediaClock() {
  const [mediaReady, setMediaReady] = useState(false); // only when true we render the clock
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState("--:--");
  const videoRef = useRef(null);

  // clock updater (runs once mediaReady; still safe to start earlier but we only show when mediaReady)
  useEffect(() => {
    // create time string HH:MM (24-hour). change to 12h if you prefer.
    function update() {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setTime(`${hh}:${mm}`);
    }
    update();
    const id = setInterval(update, 1000); // keep updating seconds / minutes correctly
    return () => clearInterval(id);
  }, []);

  // handlers for loading media
  function handleVideoLoaded() {
    // video loaded successfully -> mark media ready
    setMediaReady(true);
  }

  function handleVideoError() {
    // mark that video failed and we'll show the fallback image instead
    console.warn("Video failed to load, switching to fallback image.");
    setVideoFailed(true);
    // do not set mediaReady here — wait for the fallback image to load and call setMediaReady in its onLoad
  }

  function handleImageLoad() {
    setMediaReady(true);
  }

  // don't render the clock (overlay) until mediaReady is true
  // still render the media element (video or img) so it can load and call handlers.
  return (
    <div
      style={{
        // root container spans full viewport (use vh/vw only)
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        // background fallback color while media loads (use vh-based sizing only)
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* MEDIA: video preferred; if video fails we render an image. We always mount the appropriate element so it can load and trigger readiness. */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          src={bgVideo}
          // attributes to allow autoplay in modern browsers
          muted
          autoPlay
          loop
          playsInline
          // inline styles to cover the viewport without leaking styles
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            objectFit: "cover",
            zIndex: 0,
          }}
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          aria-hidden="true"
        />
      ) : (
        <img
          src={fallbackImg}
          alt="" // purely decorative; clock provides the content
          onLoad={handleImageLoad}
          onError={() => {
            console.error("Fallback image failed to load too.");
            // still mark ready so UI doesn't stay empty forever — you can change this behavior if you want
            setMediaReady(true);
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            objectFit: "cover",
            zIndex: 0,
            userSelect: "none",
          }}
        />
      )}

      {/* Only render the clock overlay once mediaReady === true */}
      {mediaReady && (
        <div
          role="region"
          aria-label="Media Clock"
          style={{
            // overlay container
            position: "relative", // sits above the media which is absolute
            zIndex: 2,
            height: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none", // overlay doesn't block clicks by default (change if you want interactive)
          }}
        >
          {/* translucent panel behind digits for contrast */}
          <div
            style={{
              pointerEvents: "auto", // this panel can accept events if needed in future
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2vh",
              borderRadius: "2vh",
              backdropFilter: "blur(1.5vh)",
              WebkitBackdropFilter: "blur(1.5vh)",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.15))",
            }}
          >
            <span
              style={{
                fontSize: "8vh", // big clock using vh
                lineHeight: 1,
                fontWeight: 700,
                color: "white",
                textShadow: "0 0.6vh 1.2vh rgba(0,0,0,0.6)",
                letterSpacing: "0.4vh",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace",
                // ensure no style leakage:
                margin: 0,
                padding: 0,
                display: "block",
              }}
            >
              {time}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

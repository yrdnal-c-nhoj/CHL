import React, { useState, useEffect, useRef } from "react";
import bgVideo from "./unix.mp4";
import fallbackImage from "./unix.webp";
import FontOne_2025_09_25 from "./unix.otf";
import FontTwo_2025_09_25 from "./unix2.otf";
import FontThree_2025_09_25 from "./disco.ttf";
import FontFour_2025_09_25 from "./uunix.ttf"; // your new local font

const today = new Date().toISOString().slice(0, 10).replace(/-/g, "_");

const UnixEpochClock = () => {
  const [ready, setReady] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const [videoFailed, setVideoFailed] = useState(false);
  const intervalRef = useRef(null);

  const fontOneName = `FontOne-${today}`;
  const fontTwoName = `FontTwo-${today}`;
  const fontThreeName = `FontThree-${today}`;
  const fontFourName = `FontFour-${today}`;

  const preloadFont = (url, family) =>
    new FontFace(family, `url(${url}) format('truetype')`).load().then(f => document.fonts.add(f)).catch(() => {});
  const preloadVideo = (src) =>
    new Promise(resolve => {
      const vid = document.createElement("video");
      vid.src = src;
      vid.oncanplaythrough = resolve;
      vid.onerror = resolve;
    });

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: '${fontOneName}';
        src: url(${FontOne_2025_09_25}) format('truetype');
        font-display: block;
      }
      @font-face {
        font-family: '${fontTwoName}';
        src: url(${FontTwo_2025_09_25}) format('truetype');
        font-display: block;
      }
      @font-face {
        font-family: '${fontThreeName}';
        src: url(${FontThree_2025_09_25}) format('truetype');
        font-display: block;
      }
      @font-face {
        font-family: '${fontFourName}';
        src: url(${FontFour_2025_09_25}) format('truetype');
        font-display: block;
      }
    `;
    document.head.appendChild(style);

    Promise.all([
      preloadFont(FontOne_2025_09_25, fontOneName),
      preloadFont(FontTwo_2025_09_25, fontTwoName),
      preloadFont(FontThree_2025_09_25, fontThreeName),
      preloadFont(FontFour_2025_09_25, fontFourName),
      preloadVideo(bgVideo),
    ]).then(() => setReady(true));

    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const updateTime = () => setTimestamp(Math.floor(Date.now() / 1000).toString());
    updateTime();
    intervalRef.current = setInterval(updateTime, 1000);

    return () => clearInterval(intervalRef.current);
  }, [ready]);

  useEffect(() => {
    const videoEl = document.getElementById("bg-video");
    if (videoEl) {
      videoEl.onerror = () => setVideoFailed(true);
      videoEl.onabort = () => setVideoFailed(true);
      videoEl.onstalled = () => setVideoFailed(true);
    }
  }, [ready]);

  if (!ready) {
    return <div style={{ width: "100vw", height: "100dvh", backgroundColor: "black" }} />;
  }

  const currentYear = ((Date.now() - new Date("1970-01-01T00:00:00Z").getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        fontFamily: fontOneName,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        padding: "0.2rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background video or fallback */}
      {!videoFailed ? (
        <video
          id="bg-video"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100dvh",
            objectFit: "cover",
            zIndex: 0,
            pointerEvents: "none",
          }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={bgVideo}
          type="video/mp4"
        />
      ) : (
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100dvh",
            objectFit: "cover",
            zIndex: 0,
            pointerEvents: "none",
          }}
          src={fallbackImage}
          alt="Background fallback"
        />
      )}

      {/* Top Gray + Red text */}
      <div style={{ zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            fontSize: "1.1rem",
            color: "#7E7979FF",
            maxWidth: "25rem",
            marginBottom: "0.5rem",
            lineHeight: "1.1",
          }}
        >
          On January 1st, 1970, at precisely 00:00:00 UTC, the digital universe began counting. That moment became the foundation of time itself in computing. The UNIX Epoch was underway.
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.3rem", zIndex: 10 }}>
          {timestamp.split("").map((digit, idx) => (
            <div
              key={idx}
              style={{
                width: "2.0rem",
                height: "3rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: fontTwoName,
                fontSize: "3rem",
                color: "#FF6F00",
                textShadow: `
                  2px 2px 0 #FFD54F, 
                  4px 4px 0 #321F05FF, 
                  6px 6px 0 #EB5122FF
                `,
                letterSpacing: "-0.1rem",
                borderRadius: "0.5rem",
                transform: "rotate(-1deg) skewX(-3deg)",
              }}
            >
              {digit}
            </div>
          ))}
        </div>

     <div
  style={{
    fontSize: "1.6rem",
    fontFamily: fontFourName,
    color: "#61A0FFFF", // warm retro orange
    background: "linear-gradient(90deg, #0572EFFF, #FFD93D, #720524FF)", // rainbow gradient
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "2px 2px 0 #00000055",
    letterSpacing: "0.05rem",
    marginTop: "0.5rem",
    display: "inline-block",
  }}
>
  seconds since the dawn of digital time
</div>
      </div>

      {/* Bottom Green text */}
      <div
        style={{
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: fontThreeName,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: "0.2rem 0.2rem",
          borderRadius: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "#560367FF" }}>
          celebrating {currentYear} YEARS OF DIGITAL HISTORY
        </div>
      </div>
    </div>
  );
};

export default UnixEpochClock;

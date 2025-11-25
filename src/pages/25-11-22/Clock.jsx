import React, { useRef, useEffect, useState } from "react";
import videoFile from "./sput.mp4";
// import videoWebM from "./sput.webm"; // Ensure you have a real webm if you use it
import fallbackImg from "./sput.webp";
import secondHandImg from "./spu.webp";
import font112425sput from "./spu.ttf";

export default function Clock() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // 1. Load custom font
  useEffect(() => {
    const font = new FontFace("CustomClock-112425", `url(${font112425sput})`, {
      display: "block",
    });

    let active = true;

    font.load().then((loaded) => {
      if (active) {
        document.fonts.add(loaded);
        setFontLoaded(true);
      }
    }).catch((err) => {
      console.warn("Font load failed, falling back", err);
      if (active) setFontLoaded(true); // Render anyway
    });

    return () => { active = false; };
  }, []);

  // 2. Ultra-smooth clock loop
  useEffect(() => {
    let raf;
    const tick = () => {
      setTime(new Date());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 3. Video error handling
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const fail = () => setVideoFailed(true);
    
    // Attempt play, handle browser autoplay policies
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(fail);
    }
    
    v.addEventListener("error", fail);
    return () => v.removeEventListener("error", fail);
  }, []);

  // Math for hands
  const ms = time.getMilliseconds();
  const seconds = (time.getSeconds() + ms / 1000) * 6;
  const minutes = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hours = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;

  return (
    <main
      aria-label={`Current time is ${time.toLocaleTimeString()}`}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND VIDEO layer */}
      {!videoFailed && (
        <video
          ref={videoRef}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover", // This replaces all the manual resize JS
            zIndex: 1,
          }}
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
        >
          <source src={videoFile} type="video/mp4" />
          {/* <source src={videoWebM} type="video/webm" /> */}
        </video>
      )}

      {/* FALLBACK IMAGE layer */}
      {videoFailed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `url(${fallbackImg}) center/cover no-repeat`,
            zIndex: 1,
          }}
        />
      )}

      {/* GRADIENT OVERLAY layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,220,0.2) 100%)",
          zIndex: 5,
        }}
      />

      {/* CLOCK FACE layer */}
      {fontLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "84vmin",
              height: "84vmin",
              fontFamily: "'CustomClock-112425', sans-serif",
            }}
          >
            {/* Numbers */}
            {[...Array(12)].map((_, i) => {
              const n = i + 1;
              const angle = n * 30 - 90;
              const radius = 42; // Percentage radius
              const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
              return (
                <div
                  key={n}
                  style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y}%`,
                    fontSize: "9vmin",
                    color: "#F1F0D3",
                    transform: "translate(-50%, -50%)",
                    userSelect: "none",
                    opacity: 0.7,
                  }}
                >
                  {n}
                </div>
              );
            })}

            {/* Hour hand */}
            <div
              style={{
                position: "absolute",
                bottom: "50%",
                left: "50%",
                width: "2.2vmin",
                height: "22vmin",
                backgroundColor: "white",
                borderRadius: "1.5vmin",
                transformOrigin: "center bottom",
                transform: `translateX(-50%) rotate(${hours}deg)`,
                zIndex: 2,
                opacity: 0.4,
              }}
            />

            {/* Minute hand */}
            <div
              style={{
                position: "absolute",
                bottom: "50%",
                left: "50%",
                width: "1.4vmin",
                height: "34vmin",
                backgroundColor: "#F5F1E0",
                borderRadius: "1vmin",
                transformOrigin: "center bottom",
                transform: `translateX(-50%) rotate(${minutes}deg)`,
                zIndex: 3,
                opacity: 0.4,
              }}
            />

            {/* Second hand (Image) */}
            <img
              src={secondHandImg}
              alt=""
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                height: "190vmin", // Preserved your specific sizing
                width: "auto",
                transformOrigin: "center center",
                transform: `translate(-50%, -50%) rotate(${seconds}deg)`,
                pointerEvents: "none",
                filter: "brightness(1.2) contrast(0.8) drop-shadow(0 0 1.5vmin rgba(255,100,100,0.2))",
                zIndex: 9,
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
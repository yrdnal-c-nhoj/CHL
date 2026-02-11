import React, { useRef, useEffect, useState } from "react";
import videoFile from "../../../assets/images/26-01-17/swww.mp4";
import fallbackImg from "../../../assets/images/26-01-17/sw.webp";
import overlayImage from "../../../assets/images/26-01-17/sw22.webp"; // Add your overlay image path here
import font112425sput from "../../../assets/fonts/26-01-17-sw.ttf?url";

export default function Clock() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  // 1. Load custom font
  useEffect(() => {
    const font = new FontFace("CustomClock-112425", `url(${font112425sput})`, {
      display: "block",
    });

    let active = true;

    font
      .load()
      .then((loaded) => {
        if (active) {
          document.fonts.add(loaded);
          setFontLoaded(true);
          setContentReady(true);
        }
      })
      .catch(() => {
        if (active) {
          setFontLoaded(true);
          setContentReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // 2. Ultra-smooth clock loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 100); // Update every 100ms for smooth time display
    return () => clearInterval(interval);
  }, []);

  // 3. Video error handling & readiness
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const fail = () => setVideoFailed(true);
    const canplay = () => setMediaReady(true);

    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(fail);
    }

    v.addEventListener("error", fail);
    v.addEventListener("canplaythrough", canplay);
    v.addEventListener("loadeddata", canplay);
    return () => v.removeEventListener("error", fail);
  }, []);

  // Fallback image readiness in case video fails
  useEffect(() => {
    const img = new Image();
    const done = () => setMediaReady(true);
    img.onload = done;
    img.onerror = done;
    img.src = fallbackImg;
    const timeout = setTimeout(done, 1500);
    return () => clearTimeout(timeout);
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
      {/* Loading state - prevents flash of unstyled content */}
      {!(contentReady && mediaReady) && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        />
      )}

      {/* BACKGROUND VIDEO layer */}
      {!videoFailed && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1,
            overflow: "hidden"
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "saturate(2.5) brightness(0.9) contrast(0.9) hue-rotate(185deg)",
            }}
            preload="auto"
          >
            <source src={process.env.NODE_ENV === 'production' ? `${process.env.PUBLIC_URL || ''}${videoFile}` : videoFile} type="video/mp4" />
          </video>
        </div>
      )}

      {/* FALLBACK IMAGE layer */}
      {videoFailed && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <img decoding="async" loading="lazy"
            src={fallbackImg}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "saturate(2.5)"
            }}
          />
        </div>
      )}

      {/* OVERLAY IMAGE layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img decoding="async" loading="lazy" 
          src={overlayImage} 
          alt="" 
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.6,
            zIndex: 9,
            mixBlendMode: "overlay",
            filter: "hue-rotate(40deg)"
          }}
        />
      </div>

      {/* GRADIENT OVERLAY layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(183, 127, 7, 0.52) 60%, rgba(236, 99, 26, 0.56) 100%)",
          zIndex: 10, // Keep this above the overlay image
        }}
      />

      {/* CLOCK FACE layer */}
      {contentReady && mediaReady && (
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
              width: "92vmin",
              height: "92vmin",
              fontFamily: "'CustomClock-112425', sans-serif",
            }}
          >
            {/* Numbers */}
            {[...Array(12)].map((_, i) => {
              const n = i + 1;
              const angle = n * 30 - 90;
              const radius = 42;
              const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
              return (
                <div
                  key={n}
                  style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y}%`,
                    fontSize: "5vh",
                    color: "#E9BB7A",
                    fontStyle: "italic",
                    fontVariationSettings: "'slnt' -15, 'ital' 1",
                    transform: "translate(-50%, -50%) skewX(-10deg)",
                    userSelect: "none",
                    opacity: 0.5,
                       zIndex: 1,
                    textShadow: "1px 1px 0px rgba(50, 21, 3, 0.99), -1px -1px 0 rgba(0, 0, 0, 0.3)"
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
                borderRadius: "1.5vmin",
                backgroundColor: "#DD4108",
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
                backgroundColor: "#DF3A03",
                borderRadius: "1vmin",
                transformOrigin: "center bottom",
                transform: `translateX(-50%) rotate(${minutes}deg)`,
                zIndex: 3,
                opacity: 0.4,
              }}
            />

        
            
          </div>
        </div>
      )}
    </main>
  );
}

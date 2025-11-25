import React, { useRef, useEffect, useState } from "react";
import videoFile from "./sput.mp4";
import videoWebM from "./sput.mp4";
import fallbackImg from "./sput.webp";
import secondHandImg from "./spu.webp";
import font112425sput from "./spu.ttf";

export default function Clock() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load custom font
  useEffect(() => {
    const font = new FontFace("CustomClock-112425", `url(${font112425sput})`, { display: 'block' });
    font
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        setFontLoaded(true);
      })
      .catch(() => setFontLoaded(true));
  }, []);

  // Ultra-smooth clock (pure JS — no TypeScript!)
  useEffect(() => {
    let raf;
    const tick = () => {
      setTime(new Date());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Video error fallback
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const fail = () => setVideoFailed(true);
    v.addEventListener("error", fail);
    v.play()?.catch(fail);
    return () => v.removeEventListener("error", fail);
  }, []);

  // Clock calculations
  const ms = time.getMilliseconds();
  const seconds = (time.getSeconds() + ms / 1000) * 6;
  const minutes = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hours = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        minHeight: "100dvh",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
      >
        <source src={videoFile} type="video/mp4" />
        <source src={videoWebM} type="video/webm" />
      </video>

      {/* Fallback static image */}
      {videoFailed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `url(${fallbackImg}) center/cover no-repeat`,
          }}
        />
      )}

      {/* Soft blue radial overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,220,0.2) 100%)",
          zIndex: 5,
        }}
      />

      {/* CLOCK — perfectly centered on every phone */}
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
            fontFamily: fontLoaded ? "'CustomClock-112425', sans-serif" : "sans-serif",
          }}
        >




{/* Numbers 1-12 */}
{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => {
  const angle = n * 30 - 90; // 30 degrees per hour, offset by -90 to start at top
  const radius = 42; // Distance from center in vmin (half of container width)
  const x = 50 + radius * Math.cos(angle * (Math.PI / 180));
  const y = 50 + radius * Math.sin(angle * (Math.PI / 180));

  return (
    <div
      key={n}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        fontSize: "9vmin",
        color: "#F1F0D3",
        transform: "translate(-50%, -50%)", // Center the number on the calculated point
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
                   background: "#F5EED3FF",
              background: "white",
              marginLeft: "-1.1vmin",
              borderRadius: "1.5vmin",
              transform: `translateX(-50%) rotate(${hours}deg)`,
              transformOrigin: "center bottom",
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
              background: "#F5F1E0",
              marginLeft: "-0.7vmin",
              borderRadius: "1vmin",
              transform: `translateX(-50%) rotate(${minutes}deg)`,
              transformOrigin: "center bottom",
              zIndex: 3,
                   opacity: 0.4,
            }}
          />

 {/* Second hand — Sputnik */}
<img
  src={secondHandImg}
  alt="second hand"
  style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "190vmin",
    width: "auto",
    transform: "translate(-50%, -50%)", // Centers the image
    transformOrigin: "center center",   // Rotates around the center of the image
    pointerEvents: "none",
    filter: "brightness(1.2) contrast(0.8) drop-shadow(0 0 1.5vmin rgba(255,100,100,0.2))",
    zIndex: 9,
  }}
  // Apply rotation separately to avoid transform conflicts
  ref={(el) => {
    if (el) {
      el.style.transform = `translate(-50%, -50%) rotate(${seconds}deg)`;
    }
  }}
/>
        </div>
      </div>
    </div>
  );
}

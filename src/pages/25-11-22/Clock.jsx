import React, { useRef, useEffect, useState } from "react";
import videoFile from "./sput.mp4";
import videoWebM from "./sput.mp4";
import fallbackImg from "./sput.webp";
import secondHandImg from "./sputnik.png";
import fontFile from "./spu.ttf";

export default function BackgroundVideo() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load font
  useEffect(() => {
    const fontFace = new FontFace("CustomClock", `url(${fontFile})`);
    fontFace
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
        setFontLoaded(true);
      })
      .catch(() => setFontLoaded(true));
  }, []);

  // Smooth time update
  useEffect(() => {
    const update = () => setTime(new Date());
    const timer = requestAnimationFrame(function tick() {
      update();
      requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Video fallback handling
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handleError = () => setVideoFailed(true);
    v.addEventListener("error", handleError);
    v.play()?.catch(handleError);
    return () => v.removeEventListener("error", handleError);
  }, []);

  // Clock angles
  const ms = time.getMilliseconds();
  const seconds = (time.getSeconds() + ms / 1000) * 6;
  const minutes = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hours = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

  const radius = 19; // vh

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
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

      {/* Static fallback image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${fallbackImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: videoFailed ? "block" : "none",
          zIndex: 1,
        }}
      />

      {/* NEW — Soft radial overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          pointerEvents: "none",

          background: `
            radial-gradient(
              circle,
              rgba(0,0,0,0) 40%,      
              // rgba(0,0,0,0.15) 55%,
              // rgba(0,0,0,0.30) 70%,
              rgba(0,0,220,0.30) 100%   
            )
          `,

        }}
      />

      {/* CLOCK */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "50vh",
          height: "50vh",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          fontFamily: fontLoaded ? "'CustomClock', sans-serif" : "sans-serif",
        }}
      >
        {/* NUMBERS */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
          const angle = num * 30 - 90;
          const x = radius * Math.cos((angle * Math.PI) / 180) + "vh";
          const y = radius * Math.sin((angle * Math.PI) / 180) + "vh";

          return (
            <div
              key={num}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                fontSize: "6vh",
                color: "#F1F0D3FF",
                textShadow: "0 0.3vh 1.5vh rgba(220,220,220,0.9)",
                transform: `translate(calc(-50% + ${x}), calc(-50% + ${y}))`,
                userSelect: "none",
                letterSpacing: "-0.2vh",
              }}
            >
              {num}
            </div>
          );
        })}

        {/* HOUR HAND */}
        <div
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            width: "0.4vh",
            height: "17vh",
            background: "white",
            marginLeft: "-0.7vh",
            borderRadius: "0.8vh",
            transform: `rotate(${hours}deg)`,
            transformOrigin: "bottom center",
          }}
        />

        {/* MINUTE HAND */}
        <div
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            width: "0.3vh",
            height: "26vh",
            background: "#F5F1E0FF",
            marginLeft: "-0.5vh",
            borderRadius: "0.6vh",
            transform: `rotate(${minutes}deg)`,
            transformOrigin: "bottom center",
          }}
        />

        {/* SECOND HAND (IMAGE) */}
        <img
          src={secondHandImg}
          alt="second hand"
          style={{
            position: "absolute",
            bottom: "13vh",
            left: "50%",
            height: "84vh",
            width: "auto",
            transform: `translateX(-50%) rotate(${seconds}deg)`,
            transformOrigin: "center 85%",
            pointerEvents: "none",
            zIndex: 5,
            filter: "drop-shadow(0 0 8px rgba(255,100,100,0.3))",
          }}
        />
      </div>
    </div>
  );
}

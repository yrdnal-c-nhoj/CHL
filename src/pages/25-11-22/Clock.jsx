import React, { useRef, useEffect, useState } from "react";
import videoFile from "./sput.mp4";
import videoWebM from "./sput.mp4";
import fallbackImg from "./sput.webp";
import secondHandImg from "./sputnik.png"; // <- image for second hand
import fontFile from "./day.ttf"; // single font

export default function BackgroundVideo() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load single font
  useEffect(() => {
    const fontFace = new FontFace("CustomClock", `url(${fontFile})`);
    fontFace.load().then((loadedFace) => {
      document.fonts.add(loadedFace);
      setFontLoaded(true);
    }).catch(() => setFontLoaded(true));
  }, []);

  // Smooth clock tick
  useEffect(() => {
    const update = () => setTime(new Date());
    const timer = requestAnimationFrame(function tick() {
      update();
      requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Video handling
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handleError = () => setVideoFailed(true);
    v.addEventListener("error", handleError);
    v.play()?.catch(handleError);
    return () => v.removeEventListener("error", handleError);
  }, []);

  // Angles
  const ms = time.getMilliseconds();
  const seconds = (time.getSeconds() + ms / 1000) * 6; // smooth
  const minutes = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hours = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

  const radius = 23; // vh

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
      <video
        ref={videoRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
      >
        <source src={videoFile} type="video/mp4" />
        <source src={videoWebM} type="video/webm" />
      </video>

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

      {/* ANALOG CLOCK */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "50vh",
          height: "50vh",
          borderRadius: "50%",
          // background: "rgba(0, 0, 0, 0.45)",
          // backdropFilter: "blur(16px)",
          // WebkitBackdropFilter: "blur(16px)",
          // border: "1.4vh solid rgba(255, 255, 255, 0.22)",
          // boxShadow: "0 3vh 6vh rgba(0,0,0,0.8)",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          fontFamily: fontLoaded ? "'CustomClock', sans-serif" : "sans-serif",
        }}
      >
        {/* Numbers 1–12 */}
        {[1,2,3,4,5,6,7,8,9,10,11,12].map((num) => {
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
                // fontWeight: "400",
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

        {/* Hour hand */}
        <div style={{
          position: "absolute",
          bottom: "50%",
          left: "50%",
          width: "1.4vh",
          height: "15vh",
          background: "white",
          marginLeft: "-0.7vh",
          borderRadius: "0.8vh",
          transform: `rotate(${hours}deg)`,
          transformOrigin: "bottom center",
          // boxShadow: "0 0.5vh 1.5vh rgba(0,0,0,0.7)"
        }}/>

        {/* Minute hand */}
        <div style={{
          position: "absolute",
          bottom: "50%",
          left: "50%",
          width: "1vh",
          height: "21vh",
          background: "#f0f0f0",
          marginLeft: "-0.5vh",
          borderRadius: "0.6vh",
          transform: `rotate(${minutes}deg)`,
          transformOrigin: "bottom center",
          // boxShadow: "0 0.5vh 1.5vh rgba(0,0,0,0.6)"
        }}/>

        {/* Second hand as image */}
       {/* Second hand as image */}
<img 
  src={secondHandImg} 
  alt="second hand" 
  style={{
    position: "absolute",
    bottom: "50%",       // pivot point at the center
    left: "50%",
    height: "82vh",       // length of the hand
    width: "auto",
    transform: `translateX(-50%) rotate(${seconds}deg)`, // center image horizontally
    transformOrigin: "bottom center", // rotate around bottom
    pointerEvents: "none",
    zIndex: 5,
  }}
/>



        {/* Center */}
       
      </div>
    </div>
  );
}

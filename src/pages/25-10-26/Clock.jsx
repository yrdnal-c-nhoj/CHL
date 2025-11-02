import React, { useEffect, useRef, useState } from "react";
import bgVideo from "./monarch.mp4";
import fallbackImg from "./monarch.webp";
import romanFont2025_10_27 from "./roman.otf"; // Optimized OTF

export default function MonarchClock() {
  const videoRef = useRef(null);
  const [mediaReady, setMediaReady] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoStyle, setVideoStyle] = useState({});

  // Gradient for hands & numerals
  const clockGradient = "linear-gradient(180deg, #E8B87DFF, #EA9227FF)";

  // Clock state
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    let lastUpdate = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      if (now - lastUpdate >= 1000) {
        setNow(new Date());
        lastUpdate = now;
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  // Load custom font
  useEffect(() => {
    const fontFamilyName = "RomanClockFont_2025_10_27";
    const font = new FontFace(
      fontFamilyName,
      `url(${romanFont2025_10_27}) format('opentype')`
    );
    font.load().then(() => {
      document.fonts.add(font);
      setFontLoaded(true);
    }).catch(() => setFontLoaded(true));

    const timeout = setTimeout(() => {
      if (!fontLoaded) setFontLoaded(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const handleVideoLoaded = () => {
    setMediaReady(true);
    adjustVideoPosition();
  };
  const handleVideoError = () => setVideoFailed(true);
  const handleImageLoad = () => setMediaReady(true);





const adjustVideoPosition = () => {
  const video = videoRef.current;
  if (!video) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const videoAspect = video.videoWidth / video.videoHeight;
  const viewportAspect = vw / vh;

  // Always cover the viewport completely
  if (viewportAspect < videoAspect) {
    // Video is wider → center horizontally
    setVideoStyle({
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      height: "100dvh",
      width: "auto",
      objectFit: "cover",
      zIndex: 0,
      filter: "saturate(1.5)",
    });
  } else {
    // Video is taller → center vertically
    setVideoStyle({
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "100dvw",
      height: "auto",
      objectFit: "cover",
      zIndex: 0,
      filter: "saturate(1.5)",
    });
  }
};



  useEffect(() => {
    window.addEventListener("resize", adjustVideoPosition);
    return () => window.removeEventListener("resize", adjustVideoPosition);
  }, []);

  // Clock calculations
  const clockDiameterVh = 56;
  const clockRadiusVh = clockDiameterVh / 2.7;
  const numeralOffsetVh = 4.2;
  const numeralRadiusVh = clockRadiusVh + numeralOffsetVh;

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12 + minutes / 60 + seconds / 3600;

  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30;

  const romanNumerals = [
    "XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI",
  ];
  const fontFamilyName = "RomanClockFont_2025_10_27";
  const fontFaceStyle = `
    @font-face {
      font-family: '${fontFamilyName}';
      src: url('${romanFont2025_10_27}') format('opentype');
      font-display: swap;
    }
  `;

  const handCommon = {
    position: "absolute",
    left: "50%",
    top: "50%",
    background: clockGradient,
    transformOrigin: "50% 90%",
    borderRadius: "0.6dvh",
    pointerEvents: "none",
  };

  const hourHandStyle = { ...handCommon, height: `${clockRadiusVh * 0.4}dvh`, width: "0.7dvh", transform: `translate(-50%,-100%) rotate(${hourAngle}deg)`, zIndex: 6 };
  const minuteHandStyle = { ...handCommon, height: `${clockRadiusVh * 0.72}dvh`, width: "0.5dvh", transform: `translate(-50%,-100%) rotate(${minAngle}deg)`, zIndex: 8 };
  const secondHandStyle = { ...handCommon, height: `${clockRadiusVh * 0.9}dvh`, width: "0.25dvh", transform: `translate(-50%,-100%) rotate(${secAngle}deg)`, zIndex: 9 };

  const numeralBaseStyle = {
    position: "absolute",
    fontFamily: `'${fontFamilyName}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    fontSize: "7dvh",
    fontWeight: 600,
    userSelect: "none",
    pointerEvents: "none",
    transformOrigin: "50% 50%",
    letterSpacing: "0.15rem",
    background: clockGradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <div style={{ height: "100dvh", width: "100dvw", overflow: "hidden", position: "relative", backgroundColor: "#000" }}>
      {!videoFailed ? (
        <video
          ref={videoRef}
          src={bgVideo}
          muted
          autoPlay
          loop
          playsInline
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          style={videoStyle}
        />
      ) : (
        <img
          src={fallbackImg}
          alt=""
          onLoad={handleImageLoad}
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            height: "100dvh",
            width: "auto",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}

      {mediaReady && fontLoaded && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: `${clockDiameterVh}dvh`,
            height: `${clockDiameterVh}dvh`,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            zIndex: 2,
          }}
        >
          <style>{fontFaceStyle}</style>
          {romanNumerals.map((num, i) => {
            const angleFromTop = i * 30 - 90;
            const angleRad = (angleFromTop * Math.PI) / 180;
            const xOffset = Math.cos(angleRad) * numeralRadiusVh;
            const yOffset = Math.sin(angleRad) * numeralRadiusVh;
            const leftCalc = `calc(50% + ${xOffset}dvh)`;
            const topCalc = `calc(50% + ${yOffset}dvh)`;
            const tangentialRotation = angleFromTop + 90;

            return (
              <div
                key={i}
                style={{
                  ...numeralBaseStyle,
                  left: leftCalc,
                  top: topCalc,
                  transform: `translate(-50%,-50%) rotate(${tangentialRotation}deg)`,
                  zIndex: 5,
                  whiteSpace: "nowrap",
                }}
              >
                {num}
              </div>
            );
          })}
          <div style={hourHandStyle} />
          <div style={minuteHandStyle} />
          <div style={secondHandStyle} />
        </div>
      )}
    </div>
  );
}

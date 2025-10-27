// MonarchClock.jsx
import React, { useEffect, useRef, useState } from "react";
import bgVideo from "./monarch.mp4";
import fallbackImg from "./monarch.webp";
// Font import with today's date in the variable name
import romanFont2025_10_27 from "./roman.otf";

export default function MonarchClock() {
  const [mediaReady, setMediaReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);

  // Analog clock state
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  function handleVideoLoaded() {
    setMediaReady(true);
  }

  function handleVideoError() {
    console.warn("Video failed to load, switching to fallback image.");
    setVideoFailed(true);
  }

  function handleImageLoad() {
    setMediaReady(true);
  }

  // common filter and flip styles for both video and image
  const mediaTransformFilter = {
    transform: "scaleX(-1)", // horizontal flip
    filter: "hue-rotate(-15deg) saturate(2.0)",
    WebkitFilter: "hue-rotate(-15deg) saturate(2.0)",
  };

  // --- Analog clock calculations ---
  const clockDiameterVh = 56;
  const clockRadiusVh = clockDiameterVh / 2;
  const numeralOffsetVh = 4.2;
  const numeralRadiusVh = clockRadiusVh + numeralOffsetVh;

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12 + minutes / 60 + seconds / 3600;

  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30;

  const romanNumerals = ["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"];
  const fontFamilyName = "RomanClockFont_2025_10_27";
  const fontFaceStyle = `
    @font-face {
      font-family: '${fontFamilyName}';
      src: url('${romanFont2025_10_27}') format('truetype');
      font-display: swap;
    }
  `;

  const handCommon = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "50% 90%",
    borderRadius: "0.6vh",
    pointerEvents: "none",
  };

  const hourHandStyle = {
    ...handCommon,
    height: `${clockRadiusVh * 0.55}vh`,
    width: "1.4vh",
    background: "linear-gradient(180deg,  #FE8D03,  #FE8D03)",
    transform: `translate(-50%,-100%) rotate(${hourAngle}deg)`,
    zIndex: 6,
  };

  const minuteHandStyle = {
    ...handCommon,
    height: `${clockRadiusVh * 0.72}vh`,
    width: "1.0vh",
    background: "linear-gradient(180deg,  #FE8D03,  #FE8D03)",
    transform: `translate(-50%,-100%) rotate(${minAngle}deg)`,
    zIndex: 8,
  };

  const secondHandStyle = {
    ...handCommon,
    height: `${clockRadiusVh * 0.86}vh`,
    width: "0.5vh",
    background: "linear-gradient(180deg, #FE8D03,  #FE8D03)",
    transform: `translate(-50%,-100%) rotate(${secAngle}deg)`,
    zIndex: 9,
  };

  const numeralBaseStyle = {
    position: "absolute",
    fontFamily: fontFamilyName + ", system-ui, -apple-system, 'Segoe UI', Roboto",
    fontSize: "9.2vh",
    color: "#FE8D03", // <--- add this
    fontWeight: 600,
    userSelect: "none",
    pointerEvents: "none",
    transformOrigin: "50% 50%",
    letterSpacing: "0.15rem",
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100dvw",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background video or fallback */}
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
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            objectFit: "cover",
            zIndex: 0,
            ...mediaTransformFilter,
          }}
        />
      ) : (
        <img
          src={fallbackImg}
          alt=""
          onLoad={handleImageLoad}
          onError={() => setMediaReady(true)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            objectFit: "cover",
            zIndex: 0,
            userSelect: "none",
            ...mediaTransformFilter,
          }}
        />
      )}

      {mediaReady && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: `${clockDiameterVh}vh`,
            height: `${clockDiameterVh}vh`,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            zIndex: 2,
          }}
        >
          {/* Inject font */}
          <style>{fontFaceStyle}</style>

          {/* Roman numerals */}
          {romanNumerals.map((num, i) => {
            const angleFromTop = i * 30 - 90;
            const angleRad = (angleFromTop * Math.PI) / 180;
            const xOffset = Math.cos(angleRad) * numeralRadiusVh;
            const yOffset = Math.sin(angleRad) * numeralRadiusVh;
            const leftCalc = `calc(50% + ${xOffset}vh)`;
            const topCalc = `calc(50% + ${yOffset}vh)`;
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

          {/* Clock hands */}
          <div style={hourHandStyle} />
          <div style={minuteHandStyle} />
          <div style={secondHandStyle} />
        </div>
      )}
    </div>
  );
}

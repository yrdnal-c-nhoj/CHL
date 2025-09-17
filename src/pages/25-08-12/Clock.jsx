import React, { useState, useEffect } from "react";
import customFontUrl from "./cubic.ttf"; // local font file
import backgroundImage from "./earth.webp"; // local background image

const faceColors = [
  "rgba(102, 51, 0, 0.75)",
  "rgba(194, 178, 128, 0.75)",
  "rgba(85, 87, 17, 0.75)",
  "rgba(160, 82, 45, 0.75)",
  "rgba(34, 32, 52, 0.75)",
  "rgba(230, 180, 140, 0.75)",
];

export default function BiteviteHexahedron() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load custom font before showing
  useEffect(() => {
    const font = new FontFace("CustomHexFont", `url(${customFontUrl})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
      setFontLoaded(true);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    if (hours === 0) hours = 12;
    if (hours > 12) hours -= 12;
    return `${hours}${minutes.toString().padStart(2, "0")}`;
  };

  const timeString = formatTime();

  // ✅ Container ensures stacking context
  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const bgLayerStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "brightness(0.8) contrast(1.15)",
    zIndex: 0,
  };

  const perspectiveStyle = {
    position: "relative",
    width: "24rem",
    height: "24rem",
    perspective: "290rem",
    zIndex: 1,
  };

  const cubeStyle = {
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    animation: "biteviteRotate 120s infinite linear",
  };

  const baseFaceStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(0.125rem)",
  };

  const timeDisplayStyle = {
    fontFamily: "'CustomHexFont', 'Courier New', monospace",
    fontSize: "9.5rem",
    background:
      "linear-gradient(135deg, #5B3A1A 0%, #7A5230 40%, #3E2A15 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: `
      1px 1px 0 #3b2713,
      -1px -1px 1px #F0E4D5FF,
      2px 2px 2px rgba(0,0,0,0.6),
      -2px -2px 1px rgba(255,255,255,0.05),
      0 0 2px #EAE6E3FF,
      0 1px 3px rgba(0,0,0,0.8),
      0 -1px 2px rgba(255,255,255,0.05)
    `,
    filter: "contrast(1.2) brightness(0.9)",
    letterSpacing: "0.01em",
  };

  const faceTransforms = {
    front: "translateZ(12rem)",
    back: "translateZ(-12rem) rotateY(180deg)",
    right: "rotateY(90deg) translateZ(12rem)",
    left: "rotateY(-90deg) translateZ(12rem)",
    top: "rotateX(90deg) translateZ(12rem)",
    bottom: "rotateX(-90deg) translateZ(12rem)",
  };

  return (
    <>
      <style>{`
        @keyframes biteviteRotate {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateX(90deg) rotateY(90deg) rotateZ(90deg); }
          50% { transform: rotateX(180deg) rotateY(180deg) rotateZ(180deg); }
          75% { transform: rotateX(270deg) rotateY(270deg) rotateZ(270deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }

        @media (max-width: 600px) {
          .hexa-perspective {
            perspective: 500rem !important;
            width: 15rem !important;
            height: 15rem !important;
          }

          .hexa-time {
            font-size: 5rem !important;
          }
        }
      `}</style>

      <div style={containerStyle}>
        <div style={bgLayerStyle} />

        {/* Only render cube when font is loaded */}
        {fontLoaded && (
          <div style={perspectiveStyle} className="hexa-perspective">
            <div style={cubeStyle}>
              {["front", "back", "right", "left", "top", "bottom"].map(
                (face, i) => (
                  <div
                    key={face}
                    style={{
                      ...baseFaceStyle,
                      transform: faceTransforms[face],
                      backgroundColor: faceColors[i],
                    }}
                  >
                    <div style={timeDisplayStyle} className="hexa-time">
                      {timeString}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

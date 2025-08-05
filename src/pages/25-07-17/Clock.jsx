import React, { useEffect, useState } from "react";

// Import font and images as modules from the same folder
import animFont from "./ani.ttf";

import num1Img from "./pngtree-a-beautiful-saltwater-crocodile-png-image_13409821-ezgif.com-rotate.gif";
import num2Img from "./nbvfghj-ezgif.com-effects.gif";
import num3Img from "./Kodiak-Brown-Bear-PNG-Isolated-HD-ezgif.com-optimize.gif";
import num4Img from "./jhgf.gif";
import num5Img from "./pngtree-harpy-eagle-vulture-animal-flying-isolated-on-white-background-png-image_15617474-ezgif.com-apng-to-gif-converter.gif";
import num6Img from "./Green-Anaconda-PNG-Photos-ezgif.com-apng-to-gif-converter.gif";
import num7Img from "./m0149_7_cover-ezgif.com-optimize(1).gif";
import num8Img from "./jhgfd(1).gif";
import num9Img from "./myo.gif";
import num10Img from "./dgffcir-93f9489c-305d-45b7-81d4-eb9622481af9-ezgif.com-apng-to-gif-converter.gif";
import num11Img from "./African-Elephant-PNG-File-ezgif.com-optimize.gif";
import num12Img from "./gergfeds.gif";

import bgImage from "./anim.webp";

// Inject font-face and background rotation styles
const fontFaceStyle = `
@font-face {
  font-family: 'anim';
  src: url(${animFont}) format('truetype');
}

@keyframes rotateCCW {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

.bg-rotate {
  animation: rotateCCW 120s linear infinite;
}
`;

const texts = [
  "Ursus arctos middendorffi",
  "Macropus rufus",
  "Harpia harpyja",
  "Eunectes murinus",
  "Suncus etruscus",
  "Dicopomorpha echmepterygis",
  "Mycoplasma genitalium",
  "Balaenoptera musculus",
  "Loxodonta africana",
  "Ceratotherium simum",
  "Crocodylus porosus",
  "Equus ferus caballus",
];

const images = [
  { img: num1Img, className: "num1", style: { left: "78%", top: "65%" } },
  { img: num2Img, className: "num2", style: { left: "67%", top: "78%" } },
  { img: num3Img, className: "num3", style: { left: "50%", top: "83%" } },
  { img: num4Img, className: "num4", style: { left: "35%", top: "77%" } },
  { img: num5Img, className: "num5", style: { left: "22%", top: "65%" } },
  { img: num6Img, className: "num6", style: { left: "17%", top: "50%" } },
  { img: num7Img, className: "num7", style: { left: "22%", top: "32%" } },
  { img: num8Img, className: "num8", style: { left: "35%", top: "22%" } },
  { img: num9Img, className: "num9", style: { left: "50%", top: "17%" } },
  { img: num10Img, className: "num10", style: { left: "65%", top: "22%" } },
  { img: num11Img, className: "num11", style: { left: "78%", top: "35%" } },
  { img: num12Img, className: "num12", style: { left: "83%", top: "50%" } },
];

const numberSizes = {
  num1: { width: "19.5vh", height: "19.5vh" },
  num2: { width: "19.5vh", height: "17.5vh" },
  num3: { width: "19.5vh", height: "17.5vh" },
  num4: { width: "22.5vh", height: "14.5vh" },
  num5: { width: "19.5vh", height: "16.5vh" },
  num6: { width: "17.5vh", height: "15.5vh" },
  num7: { width: "17.5vh", height: "16.5vh" },
  num8: { width: "19.5vh", height: "19.5vh" },
  num9: { width: "12.5vh", height: "12.5vh" },
  num10: { width: "19.5vh", height: "19vh" },
  num11: { width: "15.5vh", height: "13.5vh" },
  num12: { width: "19.5vh", height: "15.5vh" },
};

const textRotationDegrees = Array.from({ length: 12 }, (_, i) => i * 30);

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let animationFrameId;

    const update = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const ms = time.getMilliseconds();
  const s = time.getSeconds() + ms / 1000;
  const m = time.getMinutes() + s / 60;
  const h = time.getHours() + m / 60;

  const globalStyle = {
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    fontFamily: "'anim', sans-serif",
    position: "relative",
  };

  const clockStyle = {
    position: "relative",
    width: "100vh",
    height: "100vh",
    borderRadius: "50%",
    zIndex: 10,
  };

  const numberCommonStyle = {
    position: "absolute",
    transform: "translate(-50%, -50%)",
  };

  const handCommonStyle = {
    position: "absolute",
    bottom: "50%",
    left: "50%",
    transformOrigin: "bottom",
    transform: "translateX(-50%) rotate(0deg)",
    opacity: 0.9,
  };

  const hourHandStyle = {
    ...handCommonStyle,
    width: "7vh",
    height: "25vh",
    background: "#b6b3b3",
    zIndex: 3,
  };

  const minuteHandStyle = {
    ...handCommonStyle,
    width: "3.7vh",
    height: "44vh",
    background: "#686565",
    zIndex: 2,
  };

  const secondHandStyle = {
    ...handCommonStyle,
    width: "0.3vh",
    height: "45vh",
    background: "rgb(248, 122, 4)",
    zIndex: 7,
    opacity: 1,
  };

  const textStyleBase = {
    fontFamily: "'anim', sans-serif",
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "2vh",
    height: "45vh",
    color: "#040404",
    textShadow: "#f8f7f7 -1px 0px",
    fontSize: "0.7rem",
    textAlign: "left",
    textTransform: "uppercase",
    transformOrigin: "top center",
    writingMode: "vertical-lr",
    zIndex: 6,
    whiteSpace: "nowrap",
  };

  const labelStyle = {
    display: "block",
    marginTop: "0.3rem",
    whiteSpace: "nowrap",
  };

  const bgImageStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    zIndex: 1,
    opacity: 0.1,
    transformOrigin: "center center",
  };

  return (
    <>
      <style>{fontFaceStyle}</style>

      <div style={globalStyle}>
        <img src={bgImage} alt="Background" className="bg-rotate" style={bgImageStyle} />

        <div style={clockStyle}>
          {images.map(({ img, className, style }, i) => {
            const sizeStyle = numberSizes[className] || {};
            return (
              <img
                key={i}
                src={img}
                alt={`number${i + 1}`}
                style={{ ...numberCommonStyle, ...sizeStyle, ...style }}
              />
            );
          })}

          {texts.map((text, i) => (
            <div
              key={i}
              style={{
                ...textStyleBase,
                transform: `rotate(${textRotationDegrees[i]}deg)`,
              }}
            >
              <span style={labelStyle}>{text}</span>
            </div>
          ))}

          <div
            style={{
              ...hourHandStyle,
              transform: `translateX(-50%) rotate(${(h % 12) * 30}deg)`,
            }}
          />
          <div
            style={{
              ...minuteHandStyle,
              transform: `translateX(-50%) rotate(${m * 6}deg)`,
            }}
          />
          <div
            style={{
              ...secondHandStyle,
              transform: `translateX(-50%) rotate(${s * 6}deg)`,
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "0.01vh",
              height: "0.01vh",
              backgroundColor: "#222",
              borderRadius: "50%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default AnalogClock;

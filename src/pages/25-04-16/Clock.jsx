import React, { useEffect, useRef } from "react";
import cakeGif from "./images/cake.gif";
import minuteImg from "./images/200w.webp";
import hourImg from "./images/2hhj.webp";
import secondImg from "./images/20.webp";
import confGif from "./images/conf.gif";
import confJpg from "./images/conf.jpg";

const BirthdayCakeClock = () => {
  const hourHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const secondHandRef = useRef(null);

  useEffect(() => {
    function updateClockSmooth() {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      const hourDeg = h * 30;
      const minuteDeg = m * 6;
      const secondDeg = s * 6;

      if (hourHandRef.current)
        hourHandRef.current.style.transform = `rotate(${hourDeg}deg)`;
      if (minuteHandRef.current)
        minuteHandRef.current.style.transform = `rotate(${minuteDeg}deg)`;
      if (secondHandRef.current)
        secondHandRef.current.style.transform = `rotate(${secondDeg}deg)`;

      requestAnimationFrame(updateClockSmooth);
    }

    requestAnimationFrame(updateClockSmooth);
  }, []);

  const bodyStyle = {
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    // Removed overflow: hidden to prevent clipping
  };

  const clockWrapperStyle = {
    position: "relative",
    width: "88vmin", // Increased size to accommodate 110% circle
    aspectRatio: "1 / 1",
  };

  const clockStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    filter: "saturate(1.6)",
    zIndex: 6,
  };

  const circleStyle = {
    position: "absolute",
    top: "-5%", // Adjusted to center the 110% circle
    left: "-5%",
    width: "110%",
    height: "110%",
    borderRadius: "50%",
    animation: "rotateCounterClockwise 30s linear infinite",
    zIndex: 2,
  };

  const circleImgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
    filter: "saturate(300%)",
  };

  const handBaseStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    transformOrigin: "center center",
    pointerEvents: "none",
    zIndex: 9,
  };

  const handImgStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -100%)",
  };

  const hourImgStyle = {
    ...handImgStyle,
    height: "34vh",
    filter: "contrast(120%) brightness(100%)",
    zIndex: 9,
  };

  const minuteImgStyle = {
    ...handImgStyle,
    height: "44vh",
    zIndex: 6,
  };

  const secondImgStyle = {
    ...handImgStyle,
    height: "55vh",
  };

  const fullPageImageStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 6,
    filter: "saturate(300%)",
  };

  const fullPageImage2Style = {
    ...fullPageImageStyle,
    zIndex: 2,
    filter: "saturate(200%)",
  };

  return (
    <>
      <style>
        {`
          @keyframes rotateCounterClockwise {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(-360deg);
            }
          }
        `}
      </style>

      <div style={bodyStyle}>
        <div style={clockWrapperStyle}>
          <div style={clockStyle}>
            <div style={circleStyle}>
              <img src={cakeGif} alt="Rotating Image" style={circleImgStyle} />
            </div>

            <div ref={minuteHandRef} style={{ ...handBaseStyle, zIndex: 9 }} className="minute">
              <img src={minuteImg} alt="Minute hand" style={minuteImgStyle} />
            </div>

            <div ref={hourHandRef} style={{ ...handBaseStyle, zIndex: 9 }} className="hour">
              <img src={hourImg} alt="Hour hand" style={hourImgStyle} />
            </div>

            <div ref={secondHandRef} style={handBaseStyle} className="second">
              <img src={secondImg} alt="Second hand" style={secondImgStyle} />
            </div>
          </div>
        </div>

        <img src={confGif} alt="Confetti gif" style={fullPageImageStyle} />
        <img src={confJpg} alt="Confetti background" style={fullPageImage2Style} />
      </div>
    </>
  );
};

export default BirthdayCakeClock;
import React, { useEffect, useState, useRef } from "react";
import pageBgImgBase from "./skin.jpg";
import pageBgImg from "./sss.webp";
import clockFaceImg from "./sn.gif";
import hourHandImg from "./sn5.webp";
import minuteHandImg from "./sfsd.webp";
import secondHandImg from "./sn1.webp";
import fontFile from "./snake.ttf";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());
  const requestRef = useRef();

  // Smooth update with requestAnimationFrame
  const updateTime = () => {
    setTime(new Date());
    requestRef.current = requestAnimationFrame(updateTime);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  const unit = "vmin"; 
  const clockSize = 100; // smaller size now
  const tileSize = 35;

  const pageWrapperStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh', // <-- dynamic viewport height fixes mobile vertical centering
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const pageBackgroundBase = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${pageBgImgBase})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: "saturate(2.7) contrast(0.4) brightness(0.4)",
    zIndex: -3,
  };

  const pageBackgroundLayer1 = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${pageBgImg})`,
    backgroundRepeat: 'repeat',
    backgroundSize: `${tileSize}${unit} ${tileSize}${unit}`,
    backgroundPosition: 'center',
    zIndex: -2,
  };

  const pageBackgroundLayer2 = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${pageBgImg})`,
    backgroundRepeat: 'repeat',
    backgroundSize: `${tileSize}${unit} ${tileSize}${unit}`,
    backgroundPosition: 'center',
    transform: 'scaleX(-1)',
    zIndex: -1,
  };

  const containerStyle = {
    position: 'relative',
    width: `${clockSize}${unit}`,
    height: `${clockSize}${unit}`,
    borderRadius: "50%",
    overflow: "visible",
    textAlign: "center",
  };

  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundImage: `url(${clockFaceImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "saturate(0.7) contrast(1.4) brightness(0.7)",
    opacity: 0.6,
    zIndex: 1,
  };

  const handStyle = (angle, length) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "auto",
    height: `${length}${unit}`,
    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
    transformOrigin: "50% 100%",
    zIndex: 2,
  });

  const fontBlob = `@font-face {
    font-family: 'customFont';
    src: url(${fontFile}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }`;

  const digits = Array.from({ length: 12 }, (_, i) => i + 1);

  const digitStyle = (num) => {
    const angle = (num * 30 - 90) * (Math.PI / 180);
    const radius = clockSize / 2 - 7;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    return {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(${x}${unit}, ${y}${unit}) translate(-50%, -50%)`,
      fontFamily: "customFont",
      fontSize: `9${unit}`,
      color: "#E3F3C2AA",
      userSelect: "none",
      zIndex: 2,
    };
  };

  const hourHandLen = 36;
  const minuteHandLen = 46;
  const secondHandLen = 58;

  return (
    <div style={pageWrapperStyle}>
      <div style={pageBackgroundBase}></div>
      <div style={pageBackgroundLayer1}></div>
      <div style={pageBackgroundLayer2}></div>
      
      <div style={containerStyle}>
        <style>{fontBlob}</style>
        <div style={backgroundStyle}></div>

        {digits.map((d) => (
          <div key={d} style={digitStyle(d)}>
            {d}
          </div>
        ))}

        <img 
          src={hourHandImg} 
          alt="hour" 
          style={{ 
            ...handStyle(hourAngle, hourHandLen),
            zIndex: 8,
            filter: "saturate(3.6) contrast(1.2) brightness(0.8)" 
          }} 
        />
        <img 
          src={minuteHandImg} 
          alt="minute" 
          style={{ 
            ...handStyle(minuteAngle, minuteHandLen),
            zIndex: 6,
            filter: "saturate(1.8) contrast(1.1) brightness(0.9)" 
          }} 
        />
        <img 
          src={secondHandImg} 
          alt="second" 
          style={{ 
            ...handStyle(secondAngle, secondHandLen),
            zIndex: 3,
            filter: "grayscale(100%) sepia(100%) hue-rotate(-50deg) saturate(130%) contrast(1.7) brightness(0.9)" 
          }} 
        />
      </div>
    </div>
  );
}

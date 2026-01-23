import React, { useEffect, useState, useRef } from "react";
import videoFile from "../../../assets/clocks/25-12-28/coaster.mp4";
import videoWebM from "../../../assets/clocks/25-12-28/coaster.mp4";
import fallbackImg from "../../../assets/clocks/25-12-28/coaster.webp";
import fontUrl_20251128 from '../../../assets/fonts/25-12-28-coaster.ttf?url';

export default function Clock() {
  const [timeText, setTimeText] = useState("");
  const [videoFailed, setVideoFailed] = useState(false);
  const [shake, setShake] = useState({ x: 0, y: 0, rotate: 0 });
  const videoRef = useRef(null);
  const animationFrameId = useRef();
  const lastTime = useRef(0);

  const updateTime = () => {
    const now = new Date();
    const hours24 = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    let hour12 = hours24 % 12;
    if (hour12 === 0) hour12 = 12;

    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hour12}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${ampm}`;
    setTimeText(formattedTime);
  };

  // Enhanced shake animation loop for more dynamic movement
  useEffect(() => {
    let lastTime = 0;
    const intensity = 35; // Increased from 20 to 35 for more dramatic movement
    
    const animate = (time) => {
      if (!lastTime) lastTime = time;
      const delta = (time - lastTime) * 0.001;
      lastTime = time;
      
      // More dynamic movement with multiple frequencies for organic feel
      const t = time * 0.002; // Slower time multiplier for smoother oscillations
      
      // X movement - more pronounced left/right
      const x1 = Math.sin(t * 1.8) * intensity * 2.2;
      const x2 = Math.sin(t * 0.7) * intensity * 1.3;
      const x = (x1 + x2) * 0.7; // Combine multiple frequencies
      
      // Y movement - more bouncy up/down
      const y1 = Math.sin(t * 1.2) * intensity * 1.8;
      const y2 = Math.cos(t * 0.5) * intensity * 1.1;
      const y = (y1 + y2) * 0.6;
      
      // Rotation - more dynamic and varied
      const rotate1 = Math.sin(t * 1.4) * 18; // Increased rotation
      const rotate2 = Math.cos(t * 0.3) * 8;  // Secondary rotation for variation
      const rotate = (rotate1 + rotate2) * 0.7;
      
      // Add some randomness for more organic feel
      const randomX = (Math.random() - 0.5) * 10;
      const randomY = (Math.random() - 0.5) * 5;
      
      setShake({
        x: x + randomX,
        y: y + randomY,
        rotate
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animationFrameId.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  
  // Time update effect
  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onError = () => setVideoFailed(true);
    const onCanPlay = () => setVideoFailed(false);

    v.addEventListener("error", onError);
    v.addEventListener("stalled", onError);
    v.addEventListener("canplay", onCanPlay);

    v.play?.().catch(onError);

    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onError);
      v.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  const containerStyle = {
    width: "100vw",
    height: "100dvh",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
    transform: `
      translate3d(${shake.x * 0.4}px, ${shake.y * 0.4}px, 0)
      rotateX(${Math.sin(Date.now() * 0.0025) * 5}deg)
      rotateY(${Math.cos(Date.now() * 0.002) * 5}deg)
      perspective(1000px)
    `,
    transition: 'transform 0.08s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
    transformStyle: 'preserve-3d',
    perspective: '1000px',
  };

  const videoStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
    transform: `
      scale(1.08)
      translate3d(${shake.x * 0.25}px, ${shake.y * 0.25}px, 0)
      rotate(${shake.rotate * 0.3}deg)
      perspective(800px)
    `,
    transition: 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
  };

  const fallbackStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: videoFailed ? "block" : "none",
    zIndex: 5,
  };

  const timeContainerStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: `
      translate(-50%, -50%)
      translate3d(${shake.x * 0.7}px, ${shake.y * 0.7}px, 0)
      rotate(${shake.rotate * 0.5}deg)
      perspective(500px)
      rotateX(${Math.sin(Date.now() * 0.002) * 2}deg)
      rotateY(${Math.cos(Date.now() * 0.0015) * 2}deg)
    `,
    zIndex: 10,
    color: "#ABA193",
    fontSize: "7vw",
    textAlign: "center",
    letterSpacing: "0.05em",
    textShadow: "1px 0 0 white",
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "visible",
    fontFamily: `"CustomFont_20251128", sans-serif`,
    opacity: 0.7,
    transition: 'transform 0.1s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
    willChange: 'transform',
    transformStyle: 'preserve-3d',
  };

  const digitStyle = (index) => ({
    display: "inline-block",
    animation: `
      jossel 1.2s infinite 
      cubic-bezier(0.4, 0, 0.2, 1) 
      ${index * 0.03}s
    `,
    transformOrigin: "center center",
    willChange: 'transform',
    transform: 'translateZ(0)', // Force hardware acceleration
    backfaceVisibility: 'hidden', // Prevent flickering
  });

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: "CustomFont_20251128";
            src: url(${fontUrl_20251128}) format("truetype");
            font-weight: normal;
            font-style: normal;
          }
          
          @keyframes jossel {
            0%, 100% {
              transform: 
                translateY(0) 
                rotate(0deg) 
                scale(1) 
                translateZ(0);
              text-shadow: 
                1px 0 0 white, 
                0 0 15px rgba(255,255,255,0.4),
                0 0 30px rgba(255, 200, 200, 0.3);
            }
            25% {
              transform: 
                translateY(-25px) 
                rotate(5deg) 
                scale(1.1)
                translateZ(10px);
              text-shadow: 
                3px 0 8px rgba(255,255,255,0.7), 
                0 0 25px rgba(255,255,255,0.6),
                0 0 40px rgba(255, 200, 200, 0.4);
            }
            50% {
              transform: 
                translateY(15px) 
                rotate(-4deg) 
                scale(0.95)
                translateZ(5px);
              text-shadow: 
                -2px 0 4px rgba(255,255,255,0.6),
                0 0 20px rgba(255, 200, 200, 0.3);
            }
            75% {
              transform: 
                translateY(-10px) 
                rotate(3deg) 
                scale(1.05)
                translateZ(8px);
              text-shadow: 
                2px 0 6px rgba(255,255,255,0.6),
                0 0 25px rgba(255,255,255,0.5);
            }
          }
        `}
      </style>
      <div style={containerStyle} role="region" aria-label="Background video and time">
        <div style={timeContainerStyle} aria-live="polite">
          {timeText.split('').map((char, index) => (
            <span 
              key={index} 
              style={digitStyle(index)}
            >
              {char}
            </span>
          ))}
        </div>
        <video
          ref={videoRef}
          style={videoStyle}
          loop
          muted
          playsInline
          autoPlay
          preload="metadata"
        >
          <source src={videoFile} type="video/mp4" />
          <source src={videoWebM} type="video/webm" />
        </video>
        <div style={fallbackStyle} aria-hidden={!videoFailed}>
          {videoFailed && <span style={{ display: "none" }}>Fallback background image</span>}
        </div>
      </div>
    </>
  );
}

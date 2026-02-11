import React, { useState, useEffect, useRef } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';// Asset Imports
import clockFont from '../../../assets/fonts/26-01-30-ne.ttf';
import bgLayer1 from "../../../assets/images/26-01-30/new.webp";
import bgLayer2 from "../../../assets/images/26-01-30/nes.gif";
import bgLayer3 from "../../../assets/images/26-01-30/ne3.gif";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });

  const requestRef = useRef();
  const pos = useRef({ x: 0, y: 0 });

  const brain = useRef({
    angle: Math.random() * Math.PI * 2,
    targetAngle: Math.random() * Math.PI * 2,
    speed: 0.05,
    turnStrength: 0.008,
    confusionTimer: 0
  });

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes tileMove {
        0% { background-position: 0 0; }
        100% { background-position: -200px 200px; }
      }
    `;
    document.head.appendChild(styleSheet);

    const font = new FontFace('MyCustomFont', `url(${clockFont}) format('truetype')`);
    font.load().then((f) => {
      document.fonts.add(f);
      setFontLoaded(true);
    }).catch(() => setFontLoaded(true));

    const timer = setInterval(() => setTime(new Date()), 1000);

    const animate = () => {
      const b = brain.current;
      b.confusionTimer--;

      if (b.confusionTimer <= 0) {
        b.targetAngle = Math.random() * Math.PI * 2;
        b.speed = 0.08 + Math.random() * 0.32; // 0.08–0.40 range
        b.confusionTimer = Math.floor(Math.random() * 80) + 40; // ~0.7–2s
      }

      // Smooth angle lerp
      let angleDiff = b.targetAngle - b.angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      b.angle += angleDiff * b.turnStrength;

      // Move
      pos.current.x += Math.cos(b.angle) * b.speed;
      pos.current.y += Math.sin(b.angle) * b.speed;

      // ── Containment logic ────────────────────────────────────────
      const limitX = 34;   // vw — feels good on most screens
      const limitY = 28;   // vh — slightly tighter vertically

      let bounced = false;

      if (pos.current.x > limitX) {
        pos.current.x = limitX * 0.96;           // soft push inside
        b.targetAngle = Math.atan2(-pos.current.y, -pos.current.x);
        b.speed = 0.5;
        bounced = true;
      } else if (pos.current.x < -limitX) {
        pos.current.x = -limitX * 0.96;
        b.targetAngle = Math.atan2(-pos.current.y, -pos.current.x);
        b.speed = 0.5;
        bounced = true;
      }

      if (pos.current.y > limitY) {
        pos.current.y = limitY * 0.96;
        b.targetAngle = Math.atan2(-pos.current.y, -pos.current.x);
        b.speed = 0.5;
        bounced = true;
      } else if (pos.current.y < -limitY) {
        pos.current.y = -limitY * 0.96;
        b.targetAngle = Math.atan2(-pos.current.y, -pos.current.x);
        b.speed = 0.5;
        bounced = true;
      }

      // Nervous reset on bounce
      if (bounced) {
        b.confusionTimer = Math.floor(Math.random() * 45) + 20;
        b.turnStrength = 0.12 + Math.random() * 0.08; // temporary snappier turn
        setTimeout(() => { b.turnStrength = 0.08; }, 800); // reset after ~0.8s
      }

      // Final safety clamp (prevents any rare overshoot)
      pos.current.x = Math.max(-limitX * 1.05, Math.min(limitX * 1.05, pos.current.x));
      pos.current.y = Math.max(-limitY * 1.05, Math.min(limitY * 1.05, pos.current.y));

      setBgPos({ x: pos.current.x, y: pos.current.y });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(requestRef.current);
      if (document.head.contains(styleSheet)) document.head.removeChild(styleSheet);
    };
  }, []);

  const rawHours = time.getHours();
  const hours = rawHours % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = rawHours >= 12 ? 'PM' : 'AM';

  const styles = {
    container: {
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: '#000',
      overflow: 'hidden',
    },
    imageLayer1: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '130%',
      objectFit: 'cover',
      zIndex: 2,
      opacity: 0.5,
      filter: 'contrast(140%) brightness(1.3) hue-rotate(15deg) saturate(170%)',
      pointerEvents: 'none',
    },
    imageLayer2: {
      position: 'absolute',
      inset: 0,
      zIndex: 3,
      pointerEvents: 'none',
      backgroundImage: `url(${bgLayer2})`,
      backgroundRepeat: 'repeat',
      backgroundSize: '220px 220px',
      animation: 'tileMove 8s linear infinite',
      opacity: 0.4,
      filter: 'drop-shadow(5px -5px 0 white)',
    },
    imageLayer3: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '30%',
      height: '30%',
      objectFit: 'contain',
      zIndex: 7,
      opacity: 0.75,
      filter: 'drop-shadow(1px -1px 0 white)',
      pointerEvents: 'none',
      willChange: 'transform',
      transform: `translate(-50%, -50%) translate(${bgPos.x}vw, ${bgPos.y}vh) rotate(${bgPos.x * 1.6}deg)`,
    },
    uiWrapper: {
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      color: '#CFDEEAB8',
      textShadow: '0 0 20px rgba(255,255,255,0.2)',
    },
    timeText: {
      fontFamily: 'MyCustomFont, sans-serif',
      fontSize: 'clamp(3rem, 15vw, 10rem)',
      lineHeight: 1,
      fontStyle: 'italic',
      transform: 'skewX(-25deg)',
      opacity: fontLoaded ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out'
    },
    ampmText: {
      fontSize: '0.4em',
      verticalAlign: 'middle',
      marginLeft: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <img decoding="async" loading="lazy" src={bgLayer1} alt="" style={styles.imageLayer1} />
      <div style={styles.imageLayer2} />
      <img decoding="async" loading="lazy" src={bgLayer3} alt="" style={styles.imageLayer3} />
      <div style={styles.uiWrapper}>
        <div style={styles.timeText}>
          {hours}:{minutes} <span style={styles.ampmText}>{ampm}</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
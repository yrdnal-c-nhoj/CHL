import React, { useEffect, useState, useRef } from "react";
import font20251027 from "./fall.ttf"; // Local font file

const EntropyClock = () => {
  const [time, setTime] = useState(new Date());
  const [animationKey, setAnimationKey] = useState(0); // triggers animation restart
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showClock, setShowClock] = useState(false);  // controls fade-in
  const [mountedClockKey, setMountedClockKey] = useState(0); // unique key for each cycle
  const numbersRef = useRef([]);
  const handsRef = useRef({ hour: null, minute: null, second: null });
  const dotRef = useRef(null);
  const clockContainerRef = useRef(null);
  const styleElementRef = useRef(null);

  // --- Inject local font ---
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      @font-face {
        font-family: "EntropyFont";
        src: url(${font20251027}) format("truetype");
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(styleElement);
    styleElementRef.current = styleElement;

    setTimeout(() => setFontLoaded(true), 100); // small delay to ensure font is loaded

    return () => {
      if (styleElementRef.current && document.head.contains(styleElementRef.current)) {
        document.head.removeChild(styleElementRef.current);
      }
    };
  }, []);

  // --- Update time every second ---
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Trigger fade-in for each animation cycle ---
  useEffect(() => {
    if (!fontLoaded) return;

    // Hide clock first
    setShowClock(false);

    // Mount a new clock div shortly after
    const mountTimeout = setTimeout(() => setMountedClockKey((k) => k + 1), 50);
    return () => clearTimeout(mountTimeout);
  }, [animationKey, fontLoaded]);

  // --- Fade in the mounted clock ---
  useEffect(() => {
    if (!fontLoaded) return;
    const fadeTimeout = setTimeout(() => setShowClock(true), 50);
    return () => clearTimeout(fadeTimeout);
  }, [mountedClockKey, fontLoaded]);

  // --- Helper to shuffle arrays ---
  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  // --- Animation sequence: numbers → hands → dot → clock ---
  useEffect(() => {
    if (!fontLoaded) return;

    const timers = [];
    let cumulativeDelay = 2000;

    // Numbers tremble then fall
    const numbersOrder = shuffle([...Array(12).keys()]);
    numbersOrder.forEach((i) => {
      const trembleDelay = 500 + Math.random() * 500;
      cumulativeDelay += trembleDelay;
      timers.push(setTimeout(() => trembleNumber(i), cumulativeDelay));
      timers.push(setTimeout(() => fallNumber(i), cumulativeDelay + 1500));
    });

    // Hands tremble then fall
    const handsOrder = shuffle(["hour", "minute", "second"]);
    handsOrder.forEach((hand) => {
      const trembleDelay = 800 + Math.random() * 500;
      cumulativeDelay += trembleDelay;
      timers.push(setTimeout(() => trembleHand(hand), cumulativeDelay));
      timers.push(setTimeout(() => fallHand(hand), cumulativeDelay + 1500));
    });

    // Dot explodes
    cumulativeDelay += 1000 + Math.random() * 500;
    timers.push(setTimeout(() => explodeDot(), cumulativeDelay));

    // Clock explodes
    cumulativeDelay += 1000 + Math.random() * 500;
    timers.push(setTimeout(() => explodeClock(), cumulativeDelay));

    // Restart animation
    cumulativeDelay += 2000;
    timers.push(setTimeout(() => setAnimationKey((k) => k + 1), cumulativeDelay));

    return () => timers.forEach(clearTimeout);
  }, [animationKey, fontLoaded]);

  // --- Time calculations ---
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

  // === Animation helpers ===
  const trembleNumber = (index) => {
    const el = numbersRef.current[index];
    if (!el) return;
    let start = null;
    const duration = 1500;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const t = (timestamp - start) / duration;
      if (t >= 1) return;
      const intensity = Math.pow(t, 2) * 5;
      const offsetX = (Math.random() - 0.5) * intensity;
      const offsetY = (Math.random() - 0.5) * intensity;
      const rotation = (Math.random() - 0.5) * intensity * 2;
      el.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) rotate(${rotation}deg)`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const trembleHand = (hand) => {
    const el = handsRef.current[hand];
    if (!el) return;
    let start = null;
    const duration = 1500;
    const deg = hand === "hour" ? hourDeg : hand === "minute" ? minuteDeg : secondDeg;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const t = (timestamp - start) / duration;
      if (t >= 1) return;
      const intensity = Math.pow(t, 2) * 10;
      const wobble = (Math.random() - 0.5) * intensity;
      el.style.transform = `rotate(${deg + wobble}deg)`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const fallNumber = (index) => {
    const el = numbersRef.current[index];
    if (!el) return;
    let start = null;
    const duration = 3000 + Math.random() * 2000;
    const rotateX = Math.random() * 1440 - 720;
    const rotateY = Math.random() * 1440 - 720;
    const rotateZ = Math.random() * 1440 - 720;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const t = Math.min((timestamp - start) / duration, 1);
      const jump = Math.sin(t * Math.PI) * 20;
      el.style.transform = `translate(-50%, ${jump + t * 150}vh) rotateX(${rotateX * t}deg) rotateY(${rotateY * t}deg) rotateZ(${rotateZ * t}deg)`;
      el.style.opacity = 1 - t;
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const fallHand = (hand) => {
    const el = handsRef.current[hand];
    if (!el) return;
    let start = null;
    const duration = 3000 + Math.random() * 1000;
    const rotateX = Math.random() * 1440 - 720;
    const rotateY = Math.random() * 1440 - 720;
    const rotateZ = Math.random() * 1440 - 720;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const t = Math.min((timestamp - start) / duration, 1);
      const jump = Math.sin(t * Math.PI) * 20;
      el.style.transform = `translate(-50%, ${jump + t * 150}vh) rotateX(${rotateX * t}deg) rotateY(${rotateY * t}deg) rotateZ(${rotateZ * t}deg)`;
      el.style.opacity = 1 - t;
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const explodeDot = () => {
    const dot = dotRef.current;
    if (!dot) return;
    const total = 500;
    const rect = dot.getBoundingClientRect();
    for (let i = 0; i < total; i++) {
      const p = document.createElement("div");
      Object.assign(p.style, {
        position: "fixed",
        width: "2px",
        height: "2px",
        background: "gold",
        borderRadius: "50%",
        left: `${rect.left + rect.width / 2}px`,
        top: `${rect.top + rect.height / 2}px`,
        pointerEvents: "none",
        zIndex: "1000"
      });
      document.body.appendChild(p);

      const angle = Math.random() * 2 * Math.PI;
      const speed = 5 + Math.random() * 15;
      const rotateX = Math.random() * 720;
      const rotateY = Math.random() * 720;
      const rotateZ = Math.random() * 720;
      const startTime = performance.now();
      const duration = 2000 + Math.random() * 1000;

      const animateParticle = (timestamp) => {
        const t = Math.min((timestamp - startTime) / duration, 1);
        const dx = Math.cos(angle) * speed * t * 50;
        const dy = Math.sin(angle) * speed * t * 50;
        p.style.transform = `translate(${dx}px, ${dy}px) rotateX(${rotateX * t}deg) rotateY(${rotateY * t}deg) rotateZ(${rotateZ * t}deg)`;
        p.style.opacity = 1 - t;
        if (t < 1) requestAnimationFrame(animateParticle);
        else p.remove();
      };
      requestAnimationFrame(animateParticle);
    }
    dot.style.opacity = "0";
  };

  const explodeClock = () => {
    const allElements = [
      ...numbersRef.current.filter(Boolean),
      ...Object.values(handsRef.current).filter(Boolean),
      dotRef.current,
    ].filter(Boolean);

    allElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const angle = Math.atan2(rect.top - centerY, rect.left - centerX);
      const distance = 150 + Math.random() * 100;
      let start = null;
      const duration = 2000 + Math.random() * 1000;
      const rotateX = Math.random() * 1440 - 720;
      const rotateY = Math.random() * 1440 - 720;
      const rotateZ = Math.random() * 1440 - 720;
      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const t = Math.min((timestamp - start) / duration, 1);
        const easeOut = 1 - Math.pow(1 - t, 3);
        const dx = Math.cos(angle) * distance * easeOut;
        const dy = Math.sin(angle) * distance * easeOut + t * 150;
        const currentTransform = el.style.transform || "";
        el.style.transform = `${currentTransform} translate(${dx}vw, ${dy}vh) rotateX(${rotateX * t}deg) rotateY(${rotateY * t}deg) rotateZ(${rotateZ * t}deg)`;
        el.style.opacity = 1 - t;
        if (t < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
  };

  const clockSize = "90vmin";

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        fontFamily: "EntropyFont, monospace",
        perspective: "1500px",
        background: "radial-gradient(circle at center, #FF1500FF 0%, #631212 70%, #41025EFF 100%)",
        margin: 0,
        padding: 0
      }}
    >
   <div
  key={mountedClockKey} // new key triggers re-mount each cycle
  ref={clockContainerRef}
  style={{
    position: "relative",
    width: clockSize,
    height: clockSize,
    borderRadius: "50%",
    opacity: showClock ? 1 : 0,
    transition: "opacity 1s ease-in-out",
    transform: "translateY(-3vh)" // <-- move entire clock up by 5vh
  }}
      >
        {[...Array(12).keys()].map((i) => {
          const angle = (i / 12) * 360;
          const rad = ((angle - 90) * Math.PI) / 180;
          return (
            <div
              key={i}
              ref={(el) => (numbersRef.current[i] = el)}
              style={{
                position: "absolute",
                left: `calc(50% + ${40 * Math.cos(rad)}vmin)`,
                top: `calc(50% + ${40 * Math.sin(rad)}vmin)`,
                transform: "translate(-50%, -50%)",
                fontSize: "7vh",
                fontWeight: "900",
                color: "#FFD700",
                textShadow: "-1px -1px 0px #37034AFF,   0 0 30px #FFEA00",
                fontFamily: "EntropyFont, monospace",
                userSelect: "none"
              }}
            >
              {i === 0 ? 12 : i}
            </div>
          );
        })}

        <div
          ref={dotRef}
          style={{
            position: "absolute",
            width: "2vmin",
            height: "2vmin",
            backgroundColor: "gold",
            borderRadius: "50%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFEA00",
            zIndex: 10
          }}
        />

        {["hour", "minute", "second"].map((hand) => {
          const deg = hand === "hour" ? hourDeg : hand === "minute" ? minuteDeg : secondDeg;
          const size = hand === "hour" ? "25vmin" : hand === "minute" ? "35vmin" : "45vmin";
          const width = hand === "hour" ? "1.5vmin" : hand === "minute" ? "1vmin" : "0.5vmin";
          const color = hand === "second" ? "#FF6347" : "#FFD700";
          const shadow = hand === "second" ? "0 0 6px #FF6347, 0 0 12px #FF6347" : "0 0 6px #FFD700, 0 0 12px #FFD700, 0 0 20px #FFEA00";

          return (
            <div
              key={hand}
              ref={(el) => (handsRef.current[hand] = el)}
              style={{
                position: "absolute",
                width: width,
                height: size,
                backgroundColor: color,
                left: `calc(50% - ${parseFloat(width) / 2}vmin)`,
                top: `calc(50% - ${parseFloat(size)}vmin)`,
                transformOrigin: "center bottom",
                transform: `rotate(${deg}deg)`,
                borderRadius: "50%",
                boxShadow: shadow
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default EntropyClock;

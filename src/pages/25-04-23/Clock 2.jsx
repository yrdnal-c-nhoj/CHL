import React, { useEffect } from "react";
import pirateHook from "./images/pngtree-silver-pirate-hook-3d-object-png-image_11098846.png";
import pirateCutlass from "./images/pirate_foam.gif";
import pirateKnife from "./images/cut.gif";
import pirateOverlay from "./images/sasasd.gif";
import pirateBackground from "./images/2afe90c0ee6f32a3c59f29e2418047fd.gif";

const PirateClock = () => {
  useEffect(() => {
    const clock = document.getElementById("clock");
    const romanNumerals = [
      "XII", "I", "II", "III", "IV", "V",
      "VI", "VII", "VIII", "IX", "X", "XI"
    ];

    function placeNumbers() {
      // Clear any existing numbers
      clock.querySelectorAll(".number").forEach(el => el.remove());

      const clockWidth = clock.offsetWidth;
      const radius = clockWidth * 0.45;
      const center = clockWidth / 2;

      romanNumerals.forEach((num, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        const number = document.createElement("div");

        Object.assign(number.style, {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(-50%, -50%)",
          fontSize: "4rem",
          color: "#c29b0e",
          textShadow: "rgb(14, 2, 26) 1px 1px 5px",
          textAlign: "center",
          width: "4vw",
          height: "4vw",
          lineHeight: "4vw",
          minWidth: "30px",
          minHeight: "30px",
          animation: `float ${3.5 + Math.random()}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
          fontFamily: "Metamorphous, serif",
          zIndex: "10"
        });

        number.textContent = num;
        number.className = "number";
        clock.appendChild(number);
      });
    }

    function updateClock() {
      const now = new Date();
      const hour = now.getHours() % 12;
      const min = now.getMinutes();
      const sec = now.getSeconds();

      const hourDeg = hour * 30 + min * 0.5;
      const minuteDeg = min * 6;
      const secondDeg = sec * 6;

      document.querySelector(".hour").style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
      document.querySelector(".minute").style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      document.querySelector(".second").style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
    }

    placeNumbers();
    updateClock();
    const interval = setInterval(updateClock, 1000);

    const handleResize = () => {
      placeNumbers(); // also clears existing numbers
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      margin: 0,
      backgroundColor: "#1c4dd3",
      overflow: "hidden"
    }}>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${pirateOverlay})`,
        backgroundSize: "15% 15%",
        backgroundRepeat: "repeat",
        opacity: 0.4,
        zIndex: 1
      }} />
      <img
        src={pirateBackground}
        alt="Background"
        style={{
          position: "fixed",
          bottom: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: 0
        }}
      />
      <div
        id="clock"
        style={{
          position: "relative",
          width: "80vh",    // Increased from 30vw
          height: "80vh",
          borderRadius: "50%",
          fontFamily: "Metamorphous, serif",
          zIndex: 2
        }}
      >
        <img
          className="hand hour"
          src={pirateHook}
          alt="Hour hand"
          style={{
            position: "absolute",
            bottom: "52%",
            left: "50%",
            transformOrigin: "bottom",
            transform: "translateX(-50%)",
            width: "20vh",
            filter: "contrast(0.8)",
            zIndex: 5
          }}
        />
        <img
          className="hand minute"
          src={pirateCutlass}
          alt="Minute hand"
          style={{
            position: "absolute",
            bottom: "52%",
            left: "50%",
            transformOrigin: "bottom",
            transform: "translateX(-50%)",
            width: "19vh",
            filter: "saturate(0.8)",
            zIndex: 3
          }}
        />
        <img
          className="hand second"
          src={pirateKnife}
          alt="Second hand"
          style={{
            position: "absolute",
            bottom: "55%",
            left: "50%",
            transformOrigin: "bottom",
            transform: "translateX(-50%)",
            width: "33vh",
            zIndex: 3
          }}
        />
      </div>
      <style>{`
        @keyframes float {
          0%   { transform: translate(-50%, -50%) translateY(0); }
          50%  { transform: translate(-50%, -50%) translateY(-1.9vw); }
          100% { transform: translate(-50%, -50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PirateClock;

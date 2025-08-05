import React, { useEffect } from "react";
import bg1 from "./co.png";
import bg2 from "./cos.png";
import wheFont from "./whe.ttf";

const CosmicWheelClock = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: 'whe';
        src: url(${wheFont}) format('truetype');
      }
    `;
    document.head.appendChild(style);

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      hours = hours % 12 || 12;

      const pad = (num, digits) => String(num).padStart(digits, '0');
      const set = (id, val) => {
        const section = document.getElementById(id);
        if (section) {
          const boxes = section.getElementsByClassName("digit-box");
          [...boxes].forEach((box, i) => (box.textContent = val[i]));
        }
      };

      set("hours", pad(hours, 2));
      set("minutes", pad(minutes, 2));
      set("seconds", pad(seconds, 2));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    margin: 0,
    padding: 0,
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#dbd7ca",

   overflow: "hidden",
    position: "relative",
  };

  const clockContainer = {
    zIndex: 4,
    display: "flex",
    flexDirection: window.innerWidth >= 768 ? "row" : "column",
    alignItems: "center",
  };

  const timeSection = {
    display: "flex",
  };

  const digitBox = (index) => ({
    fontFamily: "whe",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: "1 / 1",
    fontSize: "10rem",
    width: "8rem",
    height: "8rem",
    color: "red",
    background: "transparent",
    WebkitTextFillColor: "transparent",
    backgroundImage: `url(${bg2})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    animation: `${index % 2 === 0 ? "spinClockwise" : "spinCounter"} 30s linear infinite`,
  });

  const bgImgStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "contrast(0.9) invert()",
    zIndex: 1,
    opacity: 0.9,
    animation: "slow-rotate 120s linear infinite",
    transformOrigin: "center center",
  };

  const bgImg2Style = {
    ...bgImgStyle,
    zIndex: 2,
    opacity: 0.5,
    animation: "slowrotate 120s linear infinite",
  };

  

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spinClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinCounter {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes slow-rotate {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(-360deg) scale(1.5); }
        }
        @keyframes slowrotate {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        a:hover {
          color: #e8ecec;
          background-color: rgb(21, 0, 255);
        }
      `}</style>

    

      <img src={bg1} alt="Background 1" style={bgImgStyle} />
      <img src={bg2} alt="Background 2" style={bgImg2Style} />

      <div style={clockContainer}>
        {["hours", "minutes", "seconds"].map((section) => (
          <div style={timeSection} id={section} key={section}>
            {[0, 1].map((i) => (
              <div key={i} className="digit-box" style={digitBox(i)}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CosmicWheelClock;

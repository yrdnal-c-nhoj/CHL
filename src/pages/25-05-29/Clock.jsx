import { useEffect } from "react";
import watchFont from "./watch.ttf";
import gearsGif from "./gears-13950_128.gif";

const Clock = () => {
  useEffect(() => {
    const charMap = {
      "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
      "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine"
    };

    const substituteDigit = (str) =>
      str.split("").map((d) => charMap[d] || d);

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      hours = hours % 12 || 12;

      const hoursDigits = substituteDigit(String(hours));
      const minutesDigits = substituteDigit(String(minutes).padStart(2, "0"));
      const secondsDigits = substituteDigit(String(seconds).padStart(2, "0"));

      const setValue = (id, digits) => {
        const container = document.querySelector(`#${id} .value`);
        if (!container) return;
        container.innerHTML = "";
        digits.forEach((digitName) => {
          const span = document.createElement("span");
          span.className = "digit-box";
          span.textContent = digitName;
          container.appendChild(span);
        });
      };

      setValue("hours", hoursDigits);
      setValue("minutes", minutesDigits);
      setValue("seconds", secondsDigits);
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  const backgroundStyle = {
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundImage: `url(${gearsGif})`,
    backgroundRepeat: "repeat",
    backgroundPosition: "center",
    pointerEvents: "none",
  };

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#c9dbef",
        margin: 0,
        padding: 0,
      }}
    >
      <style>{`
        @font-face {
          font-family: 'watch';
          src: url(${watchFont}) format('truetype');
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        .clock {
          font-family: 'watch', sans-serif;
          color: rgb(29, 2, 84);
          text-shadow: rgb(238, 87, 5) 1px 1px 0px, white -1px 0px 0px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          text-align: center;
          z-index: 10;
        }

        .unit {
          display: flex;
          flex-direction: column;
        }

        .value {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .digit-box {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          height: 3rem;
          user-select: none;
        }

        .divider {
          height: 1px;
          width: 30vw;
          background-color: rgb(52, 1, 77);
          margin: 0.5rem auto;
        }
      `}
      </style>

      {/* Background Layers */}
      <div style={{ ...backgroundStyle, backgroundSize: "22vw 18vw", opacity: 0.3, zIndex: 5 }} />
      <div style={{ ...backgroundStyle, backgroundSize: "21vw 17vw", opacity: 0.35, zIndex: 4 }} />
      <div style={{ ...backgroundStyle, backgroundSize: "20vw 16vw", opacity: 0.4, zIndex: 3 }} />

      {/* Clock */}
      <div className="clock">
        <div className="unit" id="hours"><div className="value"></div></div>
        <div className="divider"></div>
        <div className="unit" id="minutes"><div className="value"></div></div>
        <div className="divider"></div>
        <div className="unit" id="seconds"><div className="value"></div></div>
      </div>
    </div>
  );
};

export default Clock;

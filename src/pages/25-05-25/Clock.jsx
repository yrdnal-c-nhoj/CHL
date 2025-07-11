import { useEffect } from "react";
import arm from "./arm.gif";
import arm2 from "./arm2.gif";
import arm3 from "./arm3.gif";
import botFont from "./bot.ttf"; // Import the font file

const Clock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const second = now.getSeconds();
      const minute = now.getMinutes();
      const hour = now.getHours() % 12;

      const secondDeg = second * 6;
      const minuteDeg = minute * 6 + second * 0.1;
      const hourDeg = hour * 30 + minute * 0.5;

      document.getElementById("second-hand").style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
      document.getElementById("minute-hand").style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
      document.getElementById("hour-hand").style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inject font-face dynamically
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: 'bot';
        src: url(${botFont}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const containerStyle = {
    margin: 0,
    padding: 0,
    height: "100vh",
    width: "100vw",
    background: "radial-gradient(circle at center, #dfeb6f, #ff6a06)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const clockContainerStyle = {
    position: "relative",
    width: "80vmin",
    height: "80vmin",
  };

  const clockStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    zIndex: 1,
  };

  const numberStyle = {
    position: "absolute",
    color: "rgb(1, 80, 94)",
    fontSize: "7vh",
    transform: "translate(-50%, -50%)",
    textShadow: "#f4d6f4 6px 6px",
    fontFamily: "'bot', sans-serif",
  };

  const handBaseStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "bottom center",
    transform: "translate(-50%, -100%) rotate(0deg)",
    pointerEvents: "none",
  };

  return (
    <div style={containerStyle}>
      <div style={clockContainerStyle}>
        <div style={clockStyle} id="clock">
          {/* Numbers */}
          {Array.from({ length: 12 }, (_, i) => {
            const num = i + 1;
            const angle = num * 30 * (Math.PI / 180);
            const x = 50 + 42 * Math.sin(angle);
            const y = 50 - 42 * Math.cos(angle);
            return (
              <div
                key={num}
                style={{
                  ...numberStyle,
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                {num}
              </div>
            );
          })}

          {/* Hands */}
          <div className="hand second" id="second-hand" style={handBaseStyle}>
            <img
              src={arm2}
              alt="Second Hand"
              style={{
                height: "45vmin",
                filter: "saturate(100%)  hue-rotate(73deg) contrast(280%) brightness(150%)",
              }}
            />
          </div>

          <div className="hand minute" id="minute-hand" style={handBaseStyle}>
            <img
              src={arm3}
              alt="Minute Hand"
              style={{
                height: "35vmin",
                filter: "saturate(600%) contrast(180%) hue-rotate(170deg)",
              }}
            />
          </div>

          <div className="hand hour" id="hour-hand" style={handBaseStyle}>
            <img
              src={arm}
              alt="Hour Hand"
              style={{
                height: "27vmin",
                transform: "scaleX(-1)",
                filter: "saturate(70%)  hue-rotate(73deg) contrast(180%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
